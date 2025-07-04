import { useState } from 'react';
import { Star, Clock, MapPin, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill, className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === skill.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? skill.images.length - 1 : prev - 1
    );
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className={`card skill-card-hover ${className}`}>
      {/* Image Gallery */}
      <div className="relative mb-4 rounded-lg overflow-hidden">
        <img
          src={skill.images[currentImageIndex]}
          alt={skill.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Image Navigation */}
        {skill.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {skill.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Skill Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            skill.isOffering 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {skill.isOffering ? 'Offering' : 'Seeking'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {skill.title}
          </h3>
          <p className="text-sm text-primary-600 font-medium">
            {skill.category} • {skill.subcategory}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {skill.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {skill.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{skill.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Skill Level and Time */}
        <div className="flex items-center justify-between text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.skillLevel)}`}>
            {skill.skillLevel}
          </span>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{skill.timeCommitment}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src={skill.user.avatar}
              alt={skill.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm text-gray-900">{skill.user.name}</p>
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{skill.user.location}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          {skill.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{skill.rating}</span>
              <span className="text-xs text-gray-600">({skill.reviews})</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Link
            to={`/skill/${skill.id}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;