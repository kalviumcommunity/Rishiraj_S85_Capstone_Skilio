import React from 'react';
import { Star, Clock, Users, MapPin, CheckCircle } from 'lucide-react';

const SkillCard = ({ skill }) => {
  // Early return if skill is undefined or null
  if (!skill) {
    return null;
  }

  // Destructure with default values to prevent undefined errors
  const {
    title = '',
    category = '',
    description = '',
    difficulty = '',
    duration = '',
    provider = {},
    rating = 0,
    students = 0,
    image = '',
    tags = [],
    type = 'offering',
    skillLevel = difficulty // fallback to difficulty if skillLevel not provided
  } = skill;

  // Get skill type styling
  const getTypeColor = (skillType) => {
    switch (skillType) {
      case 'offering':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'seeking':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(type)}`}>
              {type === 'offering' ? 'Offering' : 'Seeking'}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Category and Difficulty */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
            {category}
          </span>
          {(difficulty || skillLevel) && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(skillLevel || difficulty)}`}>
              {skillLevel || difficulty}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {description}
        </p>
        
        {/* Rating and Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{rating}</span>
            </div>
            {students > 0 && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="text-sm">({students})</span>
              </div>
            )}
          </div>
          {duration && (
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{duration}</span>
            </div>
          )}
        </div>
        
        {/* Provider */}
        {provider?.name && (
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="relative">
              <img 
                src={provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=6366f1&color=fff`}
                alt={provider.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              {provider.verified && (
                <CheckCircle className="w-4 h-4 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{provider.name}</p>
              {provider.location && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{provider.location}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{tags.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <button className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          {type === 'offering' ? 'Learn More' : 'Offer Help'}
        </button>
      </div>
    </div>
  );
};

export default SkillCard;