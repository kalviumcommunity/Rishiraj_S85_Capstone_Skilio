import { useState, useEffect } from 'react';
import { Plus, Star, Calendar, MessageCircle, TrendingUp, Users, BookOpen, Award, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/SkillCard';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [seekingSkills, setSeekingSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user's skills from backend
  const fetchUserSkills = async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Use the correct user ID format
      const userId = user.id || user._id;

      // Fetch offered skills
      const offeredResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/skills/user/${userId}?type=offering`,
        { headers }
      );
      
      // Fetch seeking skills
      const seekingResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/skills/user/${userId}?type=seeking`,
        { headers }
      );

      if (offeredResponse.ok && seekingResponse.ok) {
        const offeredData = await offeredResponse.json();
        const seekingData = await seekingResponse.json();
        
        setOfferedSkills(offeredData.skills || []);
        setSeekingSkills(seekingData.skills || []);
      } else {
        setError('Failed to fetch user skills');
      }
    } catch (err) {
      console.error('Error fetching user skills:', err);
      setError('Failed to fetch user skills');
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserSkills();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUserSkills();
  }, [isAuthenticated, user]);

  // Refresh data when component becomes visible (e.g., returning from PostSkill)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && user) {
        fetchUserSkills();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, user]);

  const stats = [
    {
      label: 'Skills Offered',
      value: offeredSkills.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Skills Seeking',
      value: seekingSkills.length,
      icon: Users,
      color: 'text-green-600 bg-green-100'
    }
  ];

  const recentActivities = [];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'offered', label: `Skills Offered (${offeredSkills.length})` },
    { id: 'seeking', label: `Skills Seeking (${seekingSkills.length})` }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading your dashboard...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchUserSkills}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your skills and track your learning journey
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <Link
                to="/post-skill"
                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Post New Skill</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-100`}>
                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No recent activity</p>
                        <p className="text-gray-400 text-xs mt-1">Your activity will appear here once you start using the platform</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link
                      to="/post-skill"
                      className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Post New Skill
                    </Link>
                    <Link
                      to="/explore"
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Find Skills
                    </Link>
                    <Link
                      to="/profile"
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Update Profile
                    </Link>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Getting Started
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Start by adding your first skill</p>
                    </div>
                    <div className="text-center py-4">
                      <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Connect with other learners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offered' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Skills You're Offering
                </h2>
                <Link
                  to="/post-skill"
                  className="btn-primary"
                >
                  Add New Skill
                </Link>
              </div>
              
              {offeredSkills.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offeredSkills.map((skill) => (
                    <SkillCard key={skill._id || skill.id} skill={skill} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No skills offered yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing your expertise with the community
                  </p>
                  <Link to="/post-skill" className="btn-primary">
                    Post Your First Skill
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'seeking' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Skills You're Seeking
                </h2>
                <Link
                  to="/post-skill"
                  className="btn-primary"
                >
                  Request New Skill
                </Link>
              </div>
              
              {seekingSkills.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {seekingSkills.map((skill) => (
                    <SkillCard key={skill._id || skill.id} skill={skill} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No skill requests yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Let the community know what you'd like to learn
                  </p>
                  <Link to="/post-skill" className="btn-primary">
                    Request Your First Skill
                  </Link>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default Dashboard;