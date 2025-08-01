import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/SkillCard';
import { mockSkills, mockReviews } from '../data/mockData';
import { 
  Camera, 
  Edit2, 
  Star, 
  User, 
  BookOpen, 
  Users, 
  Mail, 
  MapPin, 
  Calendar,
  Award,
  TrendingUp,
  MessageCircle,
  Plus,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.profileImage || 'https://ui-avatars.com/api/?name=User');
  const [activeTab, setActiveTab] = useState('skills');
  const fileInputRef = useRef(null);

  // Filter skills for current user
  const mySkills = mockSkills.filter(skill => skill.userId === user?.id);
  const myReviews = mockReviews.filter(review => review.userId === user?.id);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => setEditing(true);
  const handleSave = () => setEditing(false);

  const stats = [
    {
      icon: BookOpen,
      value: mySkills.length,
      label: 'Skills Added',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      value: myReviews.length,
      label: 'Reviews Received',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Background Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="relative -mt-20 mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-blue-100"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        className="bg-white/90 text-gray-700 p-3 rounded-full shadow-lg hover:bg-white transition-all"
                        onClick={() => fileInputRef.current.click()}
                        title="Change Avatar"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* Profile Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User Name'}</h1>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                      onClick={handleEdit}
                      title="Edit Profile"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  {editing ? (
                    <div className="space-y-4 mb-6">
                      <textarea
                        className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                      <div className="flex gap-3">
                        <button
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                          onClick={handleSave}
                        >
                          Save Changes
                        </button>
                        <button
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
                          onClick={() => { setEditing(false); setBio(user?.bio || ''); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {bio || 'No bio provided. Click the edit button to add your bio.'}
                    </p>
                  )}

                                     {/* Contact Info */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex items-center gap-3 text-gray-600">
                       <Mail className="w-5 h-5 text-blue-500" />
                       <span className="font-medium">{user?.email}</span>
                     </div>
                     <div className="flex items-center gap-3 text-gray-600">
                       <MapPin className="w-5 h-5 text-green-500" />
                       <span className="font-medium">Location not set</span>
                     </div>
                     <div className="flex items-center gap-3 text-gray-600">
                       <Calendar className="w-5 h-5 text-purple-500" />
                       <span className="font-medium">Joined recently</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'skills', label: 'My Skills', icon: BookOpen },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'stats', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'skills' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">My Skills</h3>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySkills.length > 0 ? mySkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
                  )) : (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
                      <p className="text-gray-500 mb-6">Start showcasing your expertise by adding your first skill.</p>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-105">
                        Add Your First Skill
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-semibold text-gray-900">Reviews</h3>
                 </div>
                <div className="space-y-4">
                  {myReviews.length > 0 ? myReviews.map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-gray-900 font-semibold">{review.reviewerName}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                      <p className="text-gray-500">Reviews will appear here once you start getting feedback from your connections.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Activity Chart Placeholder */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h4>
                    <div className="h-48 bg-white rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart coming soon...</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">New skill added</span>
                        <span className="text-xs text-gray-400 ml-auto">2h ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Received a review</span>
                        <span className="text-xs text-gray-400 ml-auto">1d ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Profile updated</span>
                        <span className="text-xs text-gray-400 ml-auto">3d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 