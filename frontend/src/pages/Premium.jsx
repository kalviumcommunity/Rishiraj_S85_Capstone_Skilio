import React from 'react';
import { Star, ShieldCheck, Zap, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    title: 'Priority Matching',
    description: 'Get matched faster with top skill partners and enjoy priority placement in search results.'
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
    title: 'Verified Badge',
    description: 'Showcase your credibility with a verified badge on your profile and skill posts.'
  },
  {
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    title: 'AI Skill Suggestions+',
    description: 'Unlock advanced AI-powered skill recommendations tailored just for you.'
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    title: 'Unlimited Messaging',
    description: 'Enjoy unlimited chat and connections with no daily limits.'
  }
];

const Premium = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Star className="w-8 h-8 text-yellow-500" />
            Go Premium
          </h1>
          <p className="text-gray-600 mb-6">
            Unlock exclusive features and supercharge your skill barter experience!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg">
                {feature.icon}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition">
            Upgrade Now
          </button>
          <p className="text-xs text-gray-400 mt-4">Cancel anytime. 30-day money-back guarantee.</p>
        </div>
      </div>
    </div>
  );
};

export default Premium; 