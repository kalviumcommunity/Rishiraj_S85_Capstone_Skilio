import { Link } from 'react-router-dom';
import { ArrowRight, Users, Star, Zap, Shield, Search, TrendingUp, Plus, BookOpen, MessageCircle } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import HeroSection from '../components/HeroSection';
import { categories } from '../data/mockData';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const safeCategories = categories || [];
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSkills = async () => {
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
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${endpoint}?limit=12`,
          { headers }
        );
        const data = await response.json();
        if (data.success) {
          setSkills(data.skills);
        } else {
          setError(data.error || 'Failed to fetch skills');
        }
      } catch (err) {
        setError('Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [isAuthenticated]);

  const featuredSkills = skills
    .filter(skill => {
      // Filter out user's own skill requests (seeking skills)
      if (isAuthenticated && user && skill.createdBy?._id === user.id) {
        // Only show user's own skills if they are offering (not seeking)
        return skill.isOffering;
      }
      // Show all other skills
      return true;
    })
    .slice(0, 3);

  // Get user's own skill requests for the separate section
  const userSkillRequests = skills
    .filter(skill => 
      isAuthenticated && 
      user && 
      skill.createdBy?._id === user.id && 
      !skill.isOffering
    )
    .slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: 'Secure Exchanges',
      description: 'Safe and verified skill exchanges with built-in protection'
    },
    {
      icon: Search,
      title: 'Smart Matching',
      description: 'AI-powered matching system to find your perfect skill partner'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a thriving community of learners and teachers'
    },
    {
      icon: Zap,
      title: 'Real-time Chat',
      description: 'Connect instantly with skill partners through live messaging'
    }
  ];

  // Personalized content for logged-in users
  const LoggedInContent = () => (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, {user?.name || 'there'}! 👋
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ready to continue your skill journey? Explore new opportunities or share your expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/post-skill"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Post a Skill</span>
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Explore Skills</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/dashboard"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    My Dashboard
                  </h3>
                  <p className="text-gray-600 text-sm">View your skills and activity</p>
                </div>
              </div>
            </Link>
            <Link
              to="/chat"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Messages
                  </h3>
                  <p className="text-gray-600 text-sm">Check your conversations</p>
                </div>
              </div>
            </Link>
            <Link
              to="/profile"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    My Profile
                  </h3>
                  <p className="text-gray-600 text-sm">Update your profile</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Skills
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing skills shared by our community members
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading featured skills...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500 py-8">{error}</div>
            ) : featuredSkills.length === 0 ? (
              <div className="col-span-full text-center py-8">No skills found.</div>
            ) : (
              featuredSkills.map((skill) => (
                <SkillCard key={skill._id || skill.id} skill={skill} />
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>View All Skills</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Your Skill Requests - Only show if user has skill requests */}
      {userSkillRequests.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Skill Requests
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Skills you're looking to learn from the community
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userSkillRequests.map((skill) => (
                <SkillCard key={skill._id || skill.id} skill={skill} />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>View All Your Skills</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );

  // Generic content for non-logged-in users
  const LoggedOutContent = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Skills */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Skills
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing skills shared by our community members
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading featured skills...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500 py-8">{error}</div>
            ) : featuredSkills.length === 0 ? (
              <div className="col-span-full text-center py-8">No skills found.</div>
            ) : (
              featuredSkills.map((skill) => (
                <SkillCard key={skill._id || skill.id} skill={skill} />
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>View All Skills</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find skills across various domains and expertise areas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {safeCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.name.toLowerCase().replace(' ', '-')}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {(category.subcategories || []).length} subcategories
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Skilio?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for seamless skill exchanges with cutting-edge features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Skill Journey?
          </h2>
          <p className="text-xl text-blue-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and teachers in our vibrant community
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );

  return isAuthenticated ? <LoggedInContent /> : <LoggedOutContent />;
};

export default Home;