import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ChatInterface = ({ recipientId, recipientName, recipientAvatar }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('receive_message', (message) => {
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

    setSocket(newSocket);

    // Load existing messages
    loadMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [recipientId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/messages/conversation?userId1=${user.id}&userId2=${recipientId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      recipientId,
      content: newMessage.trim(),
      exchangeId: null // Add exchange ID if needed
    };

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

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { recipientId });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={recipientAvatar || `https://ui-avatars.com/api/?name=${recipientName}&background=6366f1&color=fff`}
            alt={recipientName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{recipientName}</h3>
            <p className="text-sm text-gray-500">
              {isTyping ? `${typingUser} is typing...` : 'Online'}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender._id === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender._id === user.id ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {formatTime(message.createdAt)}
                {message.sender._id === user.id && (
                  <span className="ml-2">
                    {message.read ? '✓✓' : '✓'}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 