import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { feedAPI } from '../../services/api';
import { categoryColors } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import ArticleModal from '../common/ArticleModal';
import Modal from '../common/Modal';

export default function RightSidebar() {
  const { user, updateInterests } = useAuth();
  const navigate = useNavigate();
  const [feedData, setFeedData] = useState({});
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [tempInterests, setTempInterests] = useState([]);

  const CATEGORIES = ['Technology', 'Business', 'Sports', 'Medicine', 'Science', 'WorldNews'];
  const FEED_CATEGORIES = [
    { name: 'AI', category: 'Technology' },
    { name: 'GEO POLITICS', category: 'WorldNews' },
    { name: 'Sports', category: 'Sports' }
  ];

  useEffect(() => {
    loadFeedData();
    loadTrending();
  }, []);

  useEffect(() => {
    if (user?.interests) {
      setTempInterests(user.interests);
    }
  }, [user]);

  const loadFeedData = async () => {
    const data = {};
    for (const item of FEED_CATEGORIES) {
      try {
        const response = await feedAPI.getByCategory(user?.userId || 'guest', item.category, 0, 3);
        data[item.name] = response.data.articles || [];
      } catch (error) {
        console.error(`Error loading ${item.name}:`, error);
        data[item.name] = [];
      }
    }
    setFeedData(data);
  };

  const loadTrending = async () => {
    try {
      const response = await feedAPI.getTrending(0, 4);
      setTrendingArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error loading trending:', error);
    }
  };

  const handleArticleClick = async (articleId) => {
    try {
      const response = await feedAPI.getArticle(articleId);
      setSelectedArticle(response.data);
    } catch (error) {
      console.error('Error loading article:', error);
    }
  };

  const handleTrendingClick = (index) => {
    if (trendingArticles[index]) {
      setSelectedArticle(trendingArticles[index]);
    }
  };

  const handleInterestToggle = (interest) => {
    setTempInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = async () => {
    try {
      await updateInterests(tempInterests);
      setShowInterestsModal(false);
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };

  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <>
      <div className="w-80 bg-navy-800 border-l border-gray-800 p-6 overflow-y-auto scrollbar-hide">
        {/* User Interests */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Your Interests</h3>
            <button
              onClick={() => setShowInterestsModal(true)}
              className="text-accent-blue hover:text-blue-400 transition-colors"
              title="Edit interests"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.interests?.map(interest => (
              <span
                key={interest}
                className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[interest] || 'bg-gray-600'}`}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* FEED Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">FEED</h3>
          <div className="space-y-4">
            {FEED_CATEGORIES.map(item => (
              <div key={item.name} className="bg-navy-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{item.name}</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {feedData[item.name]?.length > 0 ? (
                    feedData[item.name].map((article, idx) => (
                      <li 
                        key={article.id}
                        onClick={() => handleArticleClick(article.id)}
                        className="hover:text-white cursor-pointer transition-colors"
                      >
                        • {truncateTitle(article.title)}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No articles available</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <h3 
            className="text-lg font-bold mb-4 flex items-center gap-2 cursor-pointer hover:text-accent-blue transition-colors"
            onClick={() => navigate('/explore')}
          >
            <TrendingUp size={20} className="text-green-500" />
            Trending
          </h3>
          <div className="space-y-3">
            {trendingArticles.map((article, i) => (
              <div
                key={article.id}
                onClick={() => handleTrendingClick(i)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                <span className="text-green-500 font-bold">#{i + 1}</span>
                <span>{truncateTitle(article.title, 35)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      {/* Edit Interests Modal */}
      {showInterestsModal && (
        <Modal 
          isOpen={showInterestsModal} 
          onClose={() => setShowInterestsModal(false)}
          title="Edit Your Interests"
        >
          <div className="space-y-3">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleInterestToggle(category)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  tempInterests.includes(category)
                    ? 'border-accent-blue bg-accent-blue/10 text-white'
                    : 'border-gray-600 bg-navy-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={handleSaveInterests}
            className="w-full mt-6 px-6 py-3 bg-accent-blue hover:bg-blue-600 rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
        </Modal>
      )}
    </>
  );
}