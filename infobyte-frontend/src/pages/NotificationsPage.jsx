import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock notifications for now - replace with actual API call when backend is ready
    setNotifications([
      {
        id: '1',
        type: 'NEW_ARTICLE',
        title: 'New Technology Article',
        message: 'New article: AI Revolutionizes Healthcare Diagnostics',
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'TRENDING',
        title: 'Trending in Science',
        message: 'Mars Rover article is trending!',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ]);
    setLoading(false);
  }, [user?.userId]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <Check size={16} />
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto mb-4 text-gray-600" size={48} />
          <p className="text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all ${
                notification.read
                  ? 'bg-navy-800 border-gray-800'
                  : 'bg-accent-blue/5 border-accent-blue'
              }`}
            >
              <div className="flex items-start gap-3">
                <Bell size={20} className={notification.read ? 'text-gray-400' : 'text-accent-blue'} />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}