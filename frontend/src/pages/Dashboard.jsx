import { useState } from 'react';
import { Plus, Star, Calendar, MessageCircle, TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/SkillCard';
import { mockSkills } from '../data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Filter skills for current user
  const myOfferedSkills = mockSkills.filter(skill => skill.userId === user?.id && skill.isOffering);
  const myRequestedSkills = mockSkills.filter(skill => skill.userId === user?.id && !skill.isOffering);

  const stats = [
    {
      label: 'Skills Offered',
      value: myOfferedSkills.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Skills Seeking',
      value: myRequestedSkills.length,
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Exchanges',
      value: '12',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'exchange',
      message: 'New skill exchange request from Sarah Chen',
      time: '2 hours ago',
      icon: MessageCircle,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'review',
      message: 'You received a 5-star review for React tutoring',
      time: '1 day ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'match',
      message: 'New potential match found for UI/UX Design',
      time: '2 days ago',
      icon: Users,
      color: 'text-green-600'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'offered', label: `Skills Offered (${myOfferedSkills.length})` },
    { id: 'seeking', label: `Skills Seeking (${myRequestedSkills.length})` },
    { id: 'exchanges', label: 'Exchanges' },
    { id: 'reviews', label: 'Reviews' }
  ];

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
            <Link
              to="/post-skill"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Post New Skill</span>
            </Link>
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
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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
                    Your Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Profile Completion</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Skill Exchanges</span>
                        <span className="font-medium">12/15</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
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
              
              {myOfferedSkills.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myOfferedSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
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
              
              {myRequestedSkills.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRequestedSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
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

          {activeTab === 'exchanges' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Your Skill Exchanges
              </h2>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No active exchanges
                </h3>
                <p className="text-gray-600 mb-4">
                  Start connecting with other members to begin skill exchanges
                </p>
                <Link to="/explore" className="btn-primary">
                  Find Skill Partners
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Reviews & Ratings
              </h2>
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete skill exchanges to start receiving reviews
                </p>
                <Link to="/explore" className="btn-primary">
                  Start Learning
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;