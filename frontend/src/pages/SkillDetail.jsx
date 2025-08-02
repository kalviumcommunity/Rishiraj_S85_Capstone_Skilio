import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, User, ArrowLeft, MessageCircle, MapPin, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingChat, setStartingChat] = useState(false);

  const fetchSkill = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Use different endpoints based on authentication status
      const endpoint = isAuthenticated ? '/api/skills' : '/api/skills/public';
      
      // Only add Authorization header if user is logged in
      if (token && isAuthenticated) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${endpoint}/${id}`,
        { headers }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSkill(data.skill);
      } else {
        setError('Failed to fetch skill details');
      }
    } catch (err) {
      setError('Failed to fetch skill details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkill();
  }, [id, isAuthenticated]);

  const startChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setStartingChat(true);
    try {
      // Here you would implement the chat creation logic
      // For now, we'll just show a toast
      toast.success('Chat feature coming soon!');
    } catch (error) {
      toast.error('Failed to start chat');
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading skill details...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Skill not found'}
            </h3>
            <p className="text-gray-600 mb-4">
              The skill you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Explore</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </Link>
        </div>

        {/* Skill Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Image */}
          {skill.mediaUrls && skill.mediaUrls.length > 0 && (
            <div className="relative h-64 overflow-hidden">
              <img 
                src={skill.mediaUrls[0].url} 
                alt={skill.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                  skill.isOffering 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {skill.isOffering ? 'Offering' : 'Seeking'}
                </span>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {/* Title and Category */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{skill.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                  {skill.category}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {skill.level}
                </span>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{skill.description}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{skill.rating || 0}</span>
              </div>
              {skill.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{skill.location}</span>
                </div>
              )}
              {skill.availability && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="capitalize">{skill.availability}</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
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