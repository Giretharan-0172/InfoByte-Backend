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
  const [availableCategories, setAvailableCategories] = useState([]);

  // ✅ Get categories dynamically from user interests or default
  const CATEGORIES = ['Technology', 'Business', 'Sports', 'Medicine', 'Science', 'WorldNews'];

  useEffect(() => {
    loadAvailableCategories();
    loadTrending();
  }, []);

  useEffect(() => {
    if (availableCategories.length > 0) {
      loadFeedData();
    }
  }, [availableCategories]);

  useEffect(() => {
    if (user?.interests) {
      setTempInterests(user.interests);
    }
  }, [user]);

  // ✅ Load categories dynamically (in real app, fetch from backend)
  const loadAvailableCategories = () => {
    // For now, use user's interests or top 3 categories
    const topCategories = user?.interests?.slice(0, 3) || ['Technology', 'WorldNews', 'Sports'];
    setAvailableCategories(topCategories);
  };

  const loadFeedData = async () => {
    const data = {};
    for (const category of availableCategories) {
      try {
        const response = await feedAPI.getByCategory(user?.userId || 'guest', category, 0, 3);
        data[category] = response.data.articles || [];
      } catch (error) {
        console.error(`Error loading ${category}:`, error);
        data[category] = [];
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

  // ✅ Redirect to Feed page filtered by category
  const handleCategoryClick = (category) => {
    navigate('/feed', { state: { selectedCategory: category } });
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
      // Reload categories based on new interests
      loadAvailableCategories();
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };

  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // ✅ Get display name for category
  const getCategoryDisplayName = (category) => {
    const displayNames = {
      'Technology': 'AI',
      'WorldNews': 'GEO POLITICS',
      'Sports': 'Sports',
      'Business': 'Business',
      'Science': 'Science',
      'Medicine': 'Medicine'
    };
    return displayNames[category] || category;
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

        {/* FEED Categories - Dynamic */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">FEED</h3>
            <button
              onClick={() => navigate('/feed')}
              className="text-sm text-accent-blue hover:text-blue-400 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {availableCategories.map(category => (
              <div key={category} className="bg-navy-700 rounded-lg p-4">
                <h4 
                  className="font-semibold mb-2 cursor-pointer hover:text-accent-blue transition-colors"
                  onClick={() => handleCategoryClick(category)}
                >
                  {getCategoryDisplayName(category)}
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {feedData[category]?.length > 0 ? (
                    feedData[category].map((article) => (
                      <li 
                        key={article.id}
                        onClick={() => handleArticleClick(article.id)}
                        className="hover:text-white cursor-pointer transition-colors group relative"
                        title={article.title} // ✅ Full title on hover
                      >
                        <span className="block">• {truncateTitle(article.title)}</span>
                        {/* ✅ Tooltip for full title */}
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 bg-navy-900 border border-gray-600 rounded-lg p-2 text-xs text-white shadow-lg max-w-xs whitespace-normal">
                          {article.title}
                        </div>
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
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors group relative"
                title={article.title} // ✅ Full title on hover
              >
                <span className="text-green-500 font-bold">#{i + 1}</span>
                <span className="flex-1">{truncateTitle(article.title, 35)}</span>
                {/* ✅ Tooltip for full title */}
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 bg-navy-900 border border-gray-600 rounded-lg p-2 text-xs text-white shadow-lg max-w-xs whitespace-normal">
                  {article.title}
                </div>
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