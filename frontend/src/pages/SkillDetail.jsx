import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, User, ArrowLeft, MessageCircle, Share2, MapPin, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SkillDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Use different endpoints based on authentication status
        const endpoint = isAuthenticated ? `/api/skills/${id}` : `/api/skills/public/${id}`;
        
        // Only add Authorization header if user is logged in
        if (token && isAuthenticated) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${endpoint}`,
          { headers }
        );
        const data = await response.json();
        if (data.success) {
          setSkill(data.skill);
        } else {
          setError(data.error || 'Failed to fetch skill details');
        }
      } catch (err) {
        setError('Failed to fetch skill details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSkill();
    }
  }, [id, isAuthenticated]);

  const startChat = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to start a conversation');
      navigate('/login');
      return;
    }

    if (skill.createdBy._id === user.id) {
      toast.error('You cannot start a chat with yourself');
      return;
    }

    setStartingChat(true);
    try {
      // Create an initial message to start the conversation
      const messageData = {
        recipient: skill.createdBy._id,
        content: `Hi! I'm interested in your skill "${skill.title}". Can we discuss this further?`,
        exchangeId: skill._id // Link the message to this skill
      };

      console.log('Sending message data:', messageData); // Debug log

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(messageData)
        }
      );

      console.log('Response status:', response.status); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result); // Debug log
        toast.success('Chat started! Redirecting to messages...');
        // Navigate to the new chat interface with the recipient
        navigate(`/chat?recipient=${skill.createdBy._id}`);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        toast.error(errorData.message || 'Failed to start chat');
      }
    } catch (err) {
      console.error('Network error:', err); // Debug log
      toast.error('Failed to start chat');
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading skill details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Link to="/explore" className="text-blue-600 hover:underline">
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Skill not found</p>
            <Link to="/explore" className="text-blue-600 hover:underline">
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-4">
          <Link to="/explore" className="inline-flex items-center text-primary-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Explore
          </Link>
        </div>

        {/* Skill Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Media */}
            <div className="flex-shrink-0 w-full md:w-64 h-48 md:h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {skill.mediaUrls && skill.mediaUrls.length > 0 ? (
                <img src={skill.mediaUrls[0].url} alt={skill.title} className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  skill.isOffering 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {skill.isOffering ? 'Offering' : 'Seeking'}
                </span>
                <span className="text-sm text-gray-500">{skill.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{skill.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {skill.createdBy?.name || 'Unknown User'}
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="w-4 h-4" />
                  {skill.rating || 0}
                </div>
                {skill.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {skill.location}
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-4">{skill.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.tags && skill.tags.map((tag, index) => (
                  <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                {isAuthenticated ? (
                  skill.createdBy._id === user.id ? (
                    <button 
                      disabled
                      className="bg-gray-300 text-gray-500 px-5 py-2 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Your Own Skill
                    </button>
                  ) : (
                    <button 
                      onClick={startChat}
                      disabled={startingChat}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50 shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {startingChat ? 'Starting Chat...' : 'Start Chat'}
                    </button>
                  )
                ) : (
                  <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-sm">
                    <BookOpen className="w-5 h-5" />
                    Login to Connect
                  </Link>
                )}
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">{skill.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Level:</span>
                <span className="ml-2 text-gray-600 capitalize">{skill.level}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <span className="ml-2 text-gray-600">{skill.location || 'Not specified'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">{skill.isOffering ? 'Offering' : 'Seeking'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Availability:</span>
                <span className="ml-2 text-gray-600 capitalize">{skill.availability || 'Flexible'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Requirements:</span>
                <span className="ml-2 text-gray-600">{skill.requirements?.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Section */}
        {skill.createdBy && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-6">
            <img
              src={skill.createdBy.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.createdBy.name)}&background=6366f1&color=fff`}
              alt={skill.createdBy.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{skill.createdBy.name}</h3>
              <p className="text-gray-600">{skill.createdBy.bio || 'No bio provided.'}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{skill.createdBy.rating || 0}</span>
                </div>
                <Link to={`/profile/${skill.createdBy._id}`} className="text-primary-600 hover:underline text-sm font-medium">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetail; 