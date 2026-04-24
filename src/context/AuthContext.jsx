import React, { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser  = localStorage.getItem('user');
    if (storedToken) {
      setAccessToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await response.json();
    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const register = async (username, password, user_type) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, user_type }),
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await response.json();
    setAccessToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {}
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const refreshToken = async () => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) { logout(); throw new Error('Token refresh failed'); }
    const data = await response.json();
    setAccessToken(data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  };

  return (
    <AuthContext.Provider value={{
      user, accessToken, isLoading,
      login, register, logout, refreshToken,
      isAuthenticated: !!accessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
