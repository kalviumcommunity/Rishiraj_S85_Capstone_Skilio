import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCheckbox = (e) => {
    setAgree(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!agree) {
      setError('You must agree to the Terms and Conditions and Privacy Policy');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      console.log('Registering with:', userData); // Debug log
      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f3f6fd] py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-blue-600">Skilio</span>
          </Link>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-base shadow-sm transition-all bg-[#f6f9ff]"
                placeholder="Enter your name"
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-base shadow-sm transition-all bg-[#f6f9ff]"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-3 pl-12 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-base shadow-sm transition-all bg-[#f6f9ff]"
                placeholder="Enter your password"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full py-3 pl-12 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-base shadow-sm transition-all bg-[#f6f9ff]"
                placeholder="Confirm your password"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={agree}
              onChange={handleCheckbox}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-bold text-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href="http://localhost:5000/api/auth/google"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-100 transition"
              style={{ textDecoration: 'none' }}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;