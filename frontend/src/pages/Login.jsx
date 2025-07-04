import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const { login } = useAuth();
  const navigate = useNavigate();

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
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;