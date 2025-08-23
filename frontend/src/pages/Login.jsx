import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [searchParams] = useSearchParams();

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth errors from URL parameters
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    
    console.log('--- LOGIN COMPONENT URL PARAMS ---');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Error param:', errorParam);
    console.log('Message param:', messageParam);
    console.log('--------------------------------');
    
    if (errorParam) {
      let errorMessage = 'Authentication failed';
      
      switch (errorParam) {
        case 'oauth_failed':
          errorMessage = messageParam || 'Google sign-in failed. Please try again.';
          break;
        case 'auth_failed':
          errorMessage = messageParam || 'Authentication failed. Please try again.';
          break;
        case 'no_user':
          errorMessage = messageParam || 'User not found. Please try signing up instead.';
          break;
        case 'jwt_failed':
          errorMessage = messageParam || 'Token generation failed. Please try again.';
          break;
        default:
          errorMessage = messageParam || 'An error occurred during authentication.';
      }
      
      setError(errorMessage);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCheckbox = (e) => {
    setRemember(e.target.checked);
  };

  const handleGoogleSignIn = () => {
    try {
      // Use the backend URL from your .env file
      const backendUrl = 'http://localhost:5000';
      const googleAuthUrl = `${backendUrl}/api/auth/google`;
      
      console.log('Redirecting to Google OAuth:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Error redirecting to Google OAuth:', error);
      setError('Failed to initiate Google sign-in. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
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
                autoComplete="current-password"
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
          <div className="flex items-center mb-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={handleCheckbox}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-600 font-bold text-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </div>
        </form>
        
        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold text-base shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
          
          {/* Test Backend Connection Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/health');
                const data = await response.json();
                console.log('Backend health check:', data);
                alert(`Backend is running! Status: ${data.status}`);
              } catch (error) {
                console.error('Backend connection failed:', error);
                alert('Backend connection failed. Make sure your server is running on port 5000.');
              }
            }}
            className="w-full mt-2 py-2 px-4 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 text-sm hover:bg-gray-200 transition-all duration-200"
          >
            Test Backend Connection
          </button>
          
          {/* Test Google OAuth Strategy Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/auth/google/test');
                const data = await response.json();
                console.log('Google OAuth strategy test:', data);
                alert(`Google Strategy: ${data.googleStrategyExists ? 'EXISTS' : 'MISSING'}\nCheck console for details.`);
              } catch (error) {
                console.error('Google OAuth strategy test failed:', error);
                alert('Google OAuth strategy test failed. Check console for details.');
              }
            }}
            className="w-full mt-2 py-2 px-4 rounded-lg bg-blue-100 border border-blue-300 text-blue-600 text-sm hover:bg-blue-200 transition-all duration-200"
          >
            Test Google OAuth Strategy
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
