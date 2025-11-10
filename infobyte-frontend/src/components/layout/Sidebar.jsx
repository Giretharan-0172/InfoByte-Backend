import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Compass, Bell, Bookmark, Newspaper, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/feed', icon: Newspaper, label: 'FEED' }
  ];

  return (
    <div className="w-64 bg-navy-800 border-r border-gray-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
          INFOBYTE
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive 
                ? 'bg-accent-blue text-white shadow-lg shadow-blue-500/50' 
                : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile - Clickable */}
      <div className="p-4 border-t border-gray-800">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-3 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-lg font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}