import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Lock, Tag, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { categoryColors } from '../utils/helpers';

const CATEGORIES = ['Technology', 'Business', 'Sports', 'Medicine', 'Science', 'WorldNews'];

export default function ProfilePage() {
  const { user, updateProfile, updateInterests, changePassword, logout } = useAuth();
  
  // Separate states for each section's editing mode
  const [editName, setEditName] = useState(false);
  const [editInterests, setEditInterests] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [interests, setInterests] = useState([]);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setInterests(user.interests || []);
    }
  }, [user]);

  // Helper to handle success/error messages
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // --- Handlers ---

  const handleNameSave = async () => {
    setLoading(true);
    try {
      await updateProfile(name);
      setEditName(false);
      showMessage('success', 'Username updated successfully');
    } catch (err) {
      showMessage('error', 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (category) => {
    setInterests(prev => 
      prev.includes(category) 
        ? prev.filter(i => i !== category) 
        : [...prev, category]
    );
  };

  const handleInterestsSave = async () => {
    setLoading(true);
    try {
      await updateInterests(interests);
      setEditInterests(false);
      showMessage('success', 'Interests updated successfully');
    } catch (err) {
      showMessage('error', 'Failed to update interests');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.new !== passwords.confirm) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(passwords.current, passwords.new);
      setEditPassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
      showMessage('success', 'Password changed successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      {/* Header Banner Area */}
      <div className="relative bg-navy-800 rounded-t-2xl h-48 bg-gradient-to-r from-navy-800 to-navy-700">
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gray-500 border-4 border-navy-900 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          
          {/* Name & Handle */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-gray-400">@{user?.email?.split('@')[0]}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-navy-900 mt-16 px-8 pb-8">
        
        {/* Feedback Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid gap-6">
          
          {/* 1. Username Section */}
          <div className="bg-navy-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Username</h3>
                  <p className="text-sm text-gray-400">Your display name across InfoByte</p>
                </div>
              </div>
              {!editName && (
                <button onClick={() => setEditName(true)} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 bg-navy-700 px-3 py-1.5 rounded-full transition-colors">
                  Edit <Edit2 size={14} />
                </button>
              )}
            </div>

            {editName ? (
              <div className="flex gap-3 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-4 py-2 bg-navy-900 border border-gray-600 rounded-lg focus:border-accent-blue outline-none"
                />
                <Button onClick={handleNameSave} disabled={loading} className="py-2">Save</Button>
                <button onClick={() => setEditName(false)} className="px-4 py-2 bg-navy-700 rounded-lg hover:bg-navy-600">Cancel</button>
              </div>
            ) : (
              <p className="text-xl font-medium pl-12">{user?.name}</p>
            )}
          </div>

          {/* 2. Email Section (Read Only) */}
          <div className="bg-navy-800 rounded-2xl p-6 border border-gray-700 opacity-75">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <span className="text-lg">@</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Email Address</h3>
                <p className="text-sm text-gray-400">Managed by InfoByte ID (Cannot be changed)</p>
              </div>
            </div>
            <p className="text-xl font-medium pl-12">{user?.email}</p>
          </div>

          {/* 3. Password Section */}
          <div className="bg-navy-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Password</h3>
                  <p className="text-sm text-gray-400">Secure your account</p>
                </div>
              </div>
              {!editPassword && (
                <button onClick={() => setEditPassword(true)} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 bg-navy-700 px-3 py-1.5 rounded-full transition-colors">
                  Change <Edit2 size={14} />
                </button>
              )}
            </div>

            {editPassword ? (
              <div className="space-y-3 pl-12 animate-in fade-in slide-in-from-top-2">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full px-4 py-2 bg-navy-900 border border-gray-600 rounded-lg focus:border-accent-blue outline-none"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full px-4 py-2 bg-navy-900 border border-gray-600 rounded-lg focus:border-accent-blue outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full px-4 py-2 bg-navy-900 border border-gray-600 rounded-lg focus:border-accent-blue outline-none"
                />
                <div className="flex gap-3 mt-4">
                  <Button onClick={handlePasswordSave} disabled={loading}>Update Password</Button>
                  <button onClick={() => setEditPassword(false)} className="px-4 py-2 bg-navy-700 rounded-lg hover:bg-navy-600">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-xl font-medium pl-12">••••••••</p>
            )}
          </div>

          {/* 4. Interests Section */}
          <div className="bg-navy-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Your Interests</h3>
                  <p className="text-sm text-gray-400">Customize your feed</p>
                </div>
              </div>
              {!editInterests ? (
                <button onClick={() => setEditInterests(true)} className="text-sm text-gray-400 hover:text-white flex items-center gap-1 bg-navy-700 px-3 py-1.5 rounded-full transition-colors">
                  Edit <Edit2 size={14} />
                </button>
              ) : (
                <div className="flex gap-2">
                   <button onClick={handleInterestsSave} className="text-sm bg-accent-blue text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                    Save <Save size={14} />
                  </button>
                  <button onClick={() => setEditInterests(false)} className="text-sm bg-navy-700 text-gray-300 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pl-12">
              {editInterests ? (
                CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => handleInterestToggle(category)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      interests.includes(category)
                        ? 'bg-accent-blue/20 border-accent-blue text-white'
                        : 'bg-navy-900 border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {category}
                  </button>
                ))
              ) : (
                user?.interests?.map(interest => (
                  <span key={interest} className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[interest] || 'bg-gray-600'}`}>
                    {interest}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end mt-4">
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}