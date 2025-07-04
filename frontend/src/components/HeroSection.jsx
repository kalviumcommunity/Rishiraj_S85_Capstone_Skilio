import React from 'react';
import { Users, Star, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-blue-600 text-white py-16 px-4">
      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Exchange Skills. <span className="text-blue-200">Expand Horizons</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Connect with others to trade your expertise. Learn new skills while teaching what you know best.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            onClick={() => navigate('/explore')}
          >
            Start Exploring →
          </button>
          <button 
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            onClick={() => navigate('/register')}
          >
            Join the Community
          </button>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-4 text-blue-200" />
            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
            <div className="text-blue-200">Active Users</div>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-12 h-12 mb-4 text-blue-200" />
            <div className="text-3xl md:text-4xl font-bold mb-2">200+</div>
            <div className="text-blue-200">Skills Exchanged</div>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="w-12 h-12 mb-4 text-blue-200" />
            <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
            <div className="text-blue-200">Success Rate</div>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-12 h-12 mb-4 text-blue-200" />
            <div className="text-3xl md:text-4xl font-bold mb-2">6+</div>
            <div className="text-blue-200">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;