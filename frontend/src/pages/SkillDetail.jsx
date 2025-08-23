import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, User, ArrowLeft, MessageCircle, MapPin, Clock, BookOpen, Share2 } from 'lucide-react';
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
      // Navigate to chat page with the skill creator as recipient
      navigate(`/chat?recipient=${skill.createdBy._id}`);
    } catch (error) {
      toast.error('Failed to start chat');
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </Link>
        </div>

        {/* Skill Header */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Skill Image */}
              <div className="lg:w-1/3">
                {skill.image ? (
                  <img
                    src={skill.image}
                    alt={skill.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Skill Info */}
              <div className="lg:w-2/3">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{skill.title}</h1>
                    <p className="text-gray-600 text-lg mb-4">{skill.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      skill.isOffering 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {skill.isOffering ? 'Offering' : 'Seeking'}
                    </span>
                  </div>
                </div>

                {/* Skill Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                    <p className="text-gray-600">{skill.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
                    <p className="text-gray-600">{skill.level}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600">{skill.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Posted</h3>
                    <p className="text-gray-600">{formatDate(skill.createdAt)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {skill.isOffering && (
                    <button
                      onClick={startChat}
                      disabled={startingChat}
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {startingChat ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Starting Chat...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Chat
                        </>
                      )}
                    </button>
                  )}
                  <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Creator</h2>
            <div className="flex items-center space-x-4">
              {skill.createdBy?.profileImage ? (
                <img
                  src={skill.createdBy.profileImage}
                  alt={skill.createdBy.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {skill.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{skill.createdBy?.name || 'Unknown User'}</h3>
                <p className="text-gray-600">{skill.createdBy?.bio || 'No bio available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail; 