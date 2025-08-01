import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ChatInterface = ({ recipientId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch recipient information
  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        console.log('Fetching recipient info for ID:', recipientId); // Debug log
        
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users/${recipientId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        console.log('Response status:', response.status); // Debug log
        
        if (response.ok) {
          const data = await response.json();
          console.log('Recipient data:', data); // Debug log
          setRecipientInfo(data.user);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch recipient info:', errorData);
        }
      } catch (error) {
        console.error('Error fetching recipient info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (recipientId) {
      fetchRecipientInfo();
    }
  }, [recipientId]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    // Listen for messages from others
    newSocket.on('receive_message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });

    // Listen for your own sent messages - FIXED: Added this listener
    newSocket.on('message_sent', (message) => {
      console.log('Your message sent:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data) => {
      if (data.userId === recipientId) {
        setIsTyping(true);
        setTypingUser(data.name);
      }
    });

    newSocket.on('user_stop_typing', (data) => {
      if (data.userId === recipientId) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    newSocket.on('messages_read', (data) => {
      if (data.readerId === recipientId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.sender._id === recipientId ? { ...msg, read: true } : msg
          )
        );
      }
    });

    // Handle message errors
    newSocket.on('message_error', (error) => {
      console.error('Message error:', error);
      alert('Failed to send message: ' + error.error);
    });

    setSocket(newSocket);

    // Load existing messages
    loadMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [recipientId]);

  // Mark messages as read when chat interface is opened
  useEffect(() => {
    if (messages.length > 0 && recipientId) {
      markMessagesAsRead();
    }
  }, [messages, recipientId]);

  const markMessagesAsRead = async () => {
    try {
      const unreadMessageIds = messages
        .filter(msg => msg.sender._id === recipientId && msg.recipient._id === user.id && !msg.read)
        .map(msg => msg._id);
      
      if (unreadMessageIds.length > 0) {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/messages/mark-read/bulk`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              messageIds: unreadMessageIds
            })
          }
        );
        
        if (response.ok) {
          // Update local message state to mark as read
          setMessages(prev => 
            prev.map(msg => 
              unreadMessageIds.includes(msg._id) ? { ...msg, read: true } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const loadMessages = async () => {
    try {
      console.log('Loading messages for conversation...'); // Debug log
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/messages/conversation?userId1=${user.id}&userId2=${recipientId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log('Messages response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Messages data:', data); // Debug log
        
        // Handle different response formats
        let messagesArray = [];
        if (Array.isArray(data)) {
          messagesArray = data;
        } else if (data.messages && Array.isArray(data.messages)) {
          messagesArray = data.messages;
        } else if (data.success && data.messages && Array.isArray(data.messages)) {
          messagesArray = data.messages;
        } else {
          console.warn('Unexpected messages response format:', data);
          messagesArray = [];
        }
        
        console.log('Processed messages array:', messagesArray); // Debug log
        setMessages(messagesArray);
      } else {
        const errorData = await response.json();
        console.error('Failed to load messages:', errorData);
        setMessages([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]); // Set empty array on error
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      recipientId,
      content: newMessage.trim(),
      exchangeId: null // Add exchange ID if needed
    };

    console.log('Sending message:', messageData); // Debug log
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing_start', { recipientId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { recipientId });
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!recipientInfo) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Removed duplicate chat header - it should be handled by parent Chat.jsx component */}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {!Array.isArray(messages) || messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === user.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender._id === user.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                  {message.sender._id === user.id && (
                    <span className="ml-1">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-sm">
              <p className="text-sm italic">{typingUser || recipientInfo?.name} is typing...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Smile className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;