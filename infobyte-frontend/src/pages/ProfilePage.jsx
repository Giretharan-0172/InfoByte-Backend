import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Heart, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const CATEGORIES = ['Technology', 'Business', 'Sports', 'Medicine', 'Science', 'WorldNews'];

export default function ProfilePage() {
  // ✅ CHANGED: Get new functions from context
  const { user, updateInterests, updateProfile, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    interests: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        interests: user.interests || []
      });
    }
  }, [user]);

  const handleInterestToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(category)
        ? prev.interests.filter(i => i !== category)
        : [...prev.interests, category]
    }));
  };

  // ✅ CHANGED: Updated profile handler to submit all changes
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let successMessages = [];

      // 1. Update Name if changed
      if (formData.name !== user.name) {
        await updateProfile(formData.name);
        successMessages.push('Name updated');
      }

      // 2. Update Interests if changed
      const interestsChanged = formData.interests.length !== user.interests.length ||
        !formData.interests.every(interest => user.interests.includes(interest));

      if (interestsChanged) {
        if (formData.interests.length === 0) {
          setError('Please select at least one interest');
          setLoading(false);
          return;
        }
        await updateInterests(formData.interests);
        successMessages.push('Interests updated');
      }

      // 3. Update Password if new password is set
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to set a new password');
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('New password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await changePassword(formData.currentPassword, formData.newPassword);
        successMessages.push('Password updated');
      }

      if (successMessages.length === 0) {
        setSuccess('No changes to save');
      } else {
        setSuccess(successMessages.join(' & ') + ' successfully!');
      }

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account information and preferences</p>
      </div>

      {/* Profile Header */}
      <div className="bg-navy-800 rounded-xl p-6 mb-6 border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-3xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-navy-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User size={20} className="text-accent-blue" />
            Personal Information
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                // ✅ CHANGED: Enabled input
                disabled={loading}
                className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50"
                placeholder="Your name"
              />
              {/* ✅ CHANGED: Updated help text */}
              <p className="text-xs text-gray-500 mt-1">Update your display name</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled
                className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-navy-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lock size={20} className="text-accent-blue" />
            Change Password
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>
          {/* ✅ REMOVED: "Not implemented" text */}
        </div>

        {/* Interests */}
        <div className="bg-navy-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart size={20} className="text-accent-blue" />
            Your Interests
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Select categories you're interested in to personalize your feed
          </p>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleInterestToggle(category)}
                disabled={loading}
                className={`px-4 py-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                  formData.interests.includes(category)
                    ? 'border-accent-blue bg-accent-blue/10 text-white'
                    : 'border-gray-600 bg-navy-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}