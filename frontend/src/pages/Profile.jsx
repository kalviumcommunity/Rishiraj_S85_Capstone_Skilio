import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/SkillCard';
import { mockSkills, mockReviews } from '../data/mockData';
import { Camera, Edit2, Star, User, BookOpen, Users } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 mb-8">
          <div className="relative group">
            <img
              src={avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 shadow-lg"
            />
            <button
              className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow hover:bg-primary-700 transition-opacity opacity-0 group-hover:opacity-100"
              onClick={() => fileInputRef.current.click()}
              title="Change Avatar"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User Name'}</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition"
                onClick={handleEdit}
                title="Edit Profile"
              >
                <Edit2 className="w-4 h-4 text-primary-600" />
              </button>
            </div>
            {editing ? (
              <div className="flex flex-col gap-2 mb-2">
                <textarea
                  className="w-full border rounded-lg p-2 text-gray-700"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    onClick={() => { setEditing(false); setBio(user?.bio || ''); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mb-2">{bio || 'No bio provided.'}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1 text-gray-500">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4" />
                <span>4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'skills' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('skills')}
            >
              My Skills
            </button>
            <button
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'stats' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'skills' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySkills.length > 0 ? mySkills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                )) : (
                  <div className="col-span-full text-gray-500">No skills added yet.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-4">
                {myReviews.length > 0 ? myReviews.map(review => (
                  <div key={review.id} className="card p-4 flex items-start gap-4">
                    <Star className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="text-gray-900 font-medium">{review.reviewerName}</p>
                      <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-500">No reviews yet.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card flex items-center gap-4 p-6">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mySkills.length}</p>
                  <p className="text-gray-600">Skills Added</p>
                </div>
              </div>
              <div className="card flex items-center gap-4 p-6">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{myReviews.length}</p>
                  <p className="text-gray-600">Reviews Received</p>
                </div>
              </div>
              <div className="card flex items-center gap-4 p-6">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 