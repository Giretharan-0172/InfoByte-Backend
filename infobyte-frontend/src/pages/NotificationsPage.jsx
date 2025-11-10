import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationAPI, feedAPI } from '../services/api';
import { formatTimeAgo } from '../utils/helpers';
import ArticleModal from '../components/common/ArticleModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [user?.userId]);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications(user.userId, 0, 50);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(user.userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification.id);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Load and show article
    if (notification.articleId) {
      try {
        const response = await feedAPI.getArticle(notification.articleId);
        setSelectedArticle(response.data);
      } catch (error) {
        console.error('Error loading article:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Check size={16} />
              Mark all as read
            </button>
          )}
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
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  notification.read
                    ? 'bg-navy-800 border-gray-800 hover:border-gray-700'
                    : 'bg-accent-blue/5 border-accent-blue hover:bg-accent-blue/10'
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

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </>
  );
}