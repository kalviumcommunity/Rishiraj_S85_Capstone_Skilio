import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Optionally: set user context here
      navigate('/dashboard');
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
};

export default AuthCallback;