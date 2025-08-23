import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    console.log('--- AUTH CALLBACK COMPONENT LOADED ---');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Pathname:', window.location.pathname);
    console.log('Hash:', window.location.hash);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    console.log('Token from params:', token ? 'EXISTS' : 'MISSING');
    console.log('Error from params:', error || 'NONE');
    console.log('All params:', Object.fromEntries(params.entries()));
    
    // Check if we have a token in localStorage (in case we were redirected to dashboard)
    const storedToken = localStorage.getItem('token');
    console.log('Stored token in localStorage:', storedToken ? 'EXISTS' : 'MISSING');
    
    if (token) {
      console.log('Token found in URL params, storing in localStorage and fetching user data');
      console.log('Token value:', token.substring(0, 50) + '...');
      localStorage.setItem('token', token);
      
      // Fetch user data using the token
      fetchUserData(token);
    } else if (storedToken) {
      console.log('Token found in localStorage, fetching user data');
      fetchUserData(storedToken);
    } else if (error) {
      console.log('Error found, redirecting to login with error:', error);
      // If there's an error parameter, redirect to login with the error
      navigate(`/login?error=${error}`);
    } else {
      console.log('No token or error found, redirecting to login with fallback error');
      // Fallback error
      navigate('/login?error=oauth_failed&message=Authentication callback failed');
    }
  }, [navigate, updateUser]);

  const fetchUserData = async (token) => {
    try {
      console.log('Fetching user data with token...');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        
        // Update AuthContext with user data
        updateUser(userData.user);
        
        console.log('User data updated in context, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.error('Failed to fetch user data:', response.status);
        navigate('/login?error=auth_failed&message=Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login?error=auth_failed&message=Failed to fetch user data');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;