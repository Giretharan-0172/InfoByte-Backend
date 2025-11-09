import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user
    const savedUser = localStorage.getItem('infobyte_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('infobyte_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (email, name, password, interests) => {
    const response = await authAPI.register({ email, name, password, interests });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('infobyte_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('infobyte_user');
  };

  const updateInterests = async (interests) => {
    const response = await authAPI.updateInterests(user.userId, interests);
    const updatedUser = { ...user, interests };
    setUser(updatedUser);
    localStorage.setItem('infobyte_user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-navy-900 text-white">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateInterests }}>
      {children}
    </AuthContext.Provider>
  );
};