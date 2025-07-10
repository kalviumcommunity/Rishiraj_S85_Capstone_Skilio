import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockSkills, mockUsers } from '../data/mockData';
import { Star, User, ArrowLeft, MessageCircle, Share2 } from 'lucide-react';

const SkillDetail = () => {
  const { id } = useParams();
  // Find the skill by id from mock data (replace with API call in real app)
  const skill = mockSkills.find((s) => s.id === id) || mockSkills[0];
  const user = mockUsers.find((u) => u.id === skill.userId) || mockUsers[0];

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
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Media */}
            <div className="flex-shrink-0 w-full md:w-64 h-48 md:h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {skill.mediaUrls && skill.mediaUrls.length > 0 ? (
                <img src={skill.mediaUrls[0]} alt={skill.title} className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{skill.title}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {user.name}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="w-4 h-4" />
                  4.8
                </span>
              </div>
              <p className="text-gray-700 mb-4">{skill.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {skill.tags && skill.tags.map((tag) => (
                  <span key={tag} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Details</h2>
          <ul className="text-gray-700 space-y-1">
            <li><span className="font-medium">Category:</span> {skill.category}</li>
            <li><span className="font-medium">Level:</span> {skill.level}</li>
            <li><span className="font-medium">Location:</span> {skill.location}</li>
            <li><span className="font-medium">Type:</span> {skill.isOffering ? 'Offering' : 'Seeking'}</li>
            <li><span className="font-medium">Availability:</span> {skill.availability || 'N/A'}</li>
            <li><span className="font-medium">Requirements:</span> {skill.requirements || 'None'}</li>
          </ul>
        </div>

        {/* User Section */}
        <div className="card p-6 flex items-center gap-6">
          <img
            src={user.profileImage || 'https://ui-avatars.com/api/?name=User'}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.bio || 'No bio provided.'}</p>
            <Link to={`/profile`} className="text-primary-600 hover:underline text-sm font-medium mt-1 inline-block">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail; 