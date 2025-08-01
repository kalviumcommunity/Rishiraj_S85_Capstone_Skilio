import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MessageCircle, Send, ArrowLeft, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [allMessages, setAllMessages] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if we should open a specific chat
  const recipientId = searchParams.get('recipient');

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  // If recipient is specified, open that specific chat
  useEffect(() => {
    if (recipientId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.userId === recipientId);
      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        // Create a placeholder conversation for new chats
        setSelectedConversation({
          userId: recipientId,
          name: 'New Chat',
          avatar: null,
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0
        });
      }
    }
  }, [recipientId, conversations]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/messages`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Conversations response:', data); // Debug log
        
        // Check if data has the expected structure
        if (!data.success || !data.messages) {
          console.error('Unexpected response format:', data);
          toast.error('Failed to load conversations - invalid response format');
          return;
        }
        
        // Store all messages for later use
        setAllMessages(data.messages);
        
        // Group messages by conversation
        const conversationMap = new Map();
        
        data.messages.forEach(message => {
          const otherUserId = message.sender._id === user.id ? message.recipient._id : message.sender._id;
          const otherUserName = message.sender._id === user.id ? message.recipient.name : message.sender.name;
          const otherUserAvatar = message.sender._id === user.id ? message.recipient.profileImage : message.sender.profileImage;
          
          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              name: otherUserName,
              avatar: otherUserAvatar,
              lastMessage: message.content,
              lastMessageTime: message.createdAt,
              unreadCount: 0
            });
          } else {
            const conversation = conversationMap.get(otherUserId);
            if (new Date(message.createdAt) > new Date(conversation.lastMessageTime)) {
              conversation.lastMessage = message.content;
              conversation.lastMessageTime = message.createdAt;
            }
          }
          
          // Calculate unread count: only count messages sent TO current user that are NOT read
          if (message.recipient._id === user.id && !message.read) {
            const conversation = conversationMap.get(otherUserId);
            if (conversation) {
              conversation.unreadCount++;
            }
          }
        });
        
        const conversationsList = Array.from(conversationMap.values())
          .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        
        setConversations(conversationsList);
      } else {
        const errorData = await response.json();
        console.error('Failed to load conversations:', errorData);
        toast.error('Failed to load conversations');
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    // Update URL to reflect the selected conversation
    navigate(`/chat?recipient=${conversation.userId}`);
    
    // Mark messages as read when conversation is opened
    try {
      const unreadMessageIds = allMessages
        .filter(msg => msg.sender._id === conversation.userId && msg.recipient._id === user.id && !msg.read)
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
          // Reload conversations to update unread counts
          loadConversations();
        }
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
    navigate('/chat');
  };

  // If a specific chat is selected, show the chat interface
  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white shadow-sm">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToConversations}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedConversation.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Chat Interface */}
          <ChatInterface recipientId={selectedConversation.userId} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            {/* Conversations List */}
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-500 mb-6">Start connecting with other users to see your conversations here.</p>
                  <button
                    onClick={() => navigate('/explore')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Explore Skills
                  </button>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => handleConversationSelect(conversation)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                  >
                    {/* Avatar */}
                    {conversation.avatar ? (
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                        <span className="text-sm text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    
                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 