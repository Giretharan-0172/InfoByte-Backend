import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('infobyte_user');
    if (savedUser) setUser(JSON.parse(savedUser));
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
    await authAPI.updateInterests(user.userId, interests);
    const updatedUser = { ...user, interests };
    setUser(updatedUser);
    localStorage.setItem('infobyte_user', JSON.stringify(updatedUser));
  };

  // ✅ NEW: Function to update profile name
  const updateProfile = async (name) => {
    const response = await authAPI.updateProfile(user.userId, name);
    // Update user state with new name from response
    const updatedUser = { ...user, name: response.data.name };
    setUser(updatedUser);
    localStorage.setItem('infobyte_user', JSON.stringify(updatedUser));
  };

  // ✅ NEW: Function to change password
  const changePassword = async (currentPassword, newPassword) => {
    // This call just returns success/error, no user state to update
    await authAPI.changePassword(user.userId, currentPassword, newPassword);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-navy-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-blue"></div>
      </div>
    );
  }

  return (
    // ✅ NEW: Added new functions to provider value
    <AuthContext.Provider value={{ user, login, register, logout, updateInterests, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};