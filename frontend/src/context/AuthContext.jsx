import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => { // Changed to named export
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('skilioUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      );
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('skilioUser', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        }
      );
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('skilioUser', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('skilioUser');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // Keep default export for backward compatibility