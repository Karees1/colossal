import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setAccessToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      // Optionally verify token is valid by calling /auth/verify endpoint
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (username, password, user_type) => {
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, user_type }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
      throw err;
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
