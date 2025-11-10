import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { feedAPI } from '../services/api';
import CategoryFilter from '../components/feed/CategoryFilter';
import ArticleCard from '../components/feed/ArticleCard';
import ArticleModal from '../components/common/ArticleModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function FeedPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Handle category from navigation state (when coming from sidebar)
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, user?.userId]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = selectedCategory
        ? await feedAPI.getByCategory(user.userId, selectedCategory, 0, 20)
        : await feedAPI.getLatest(0, 20);
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-6">All Categories</h1>

        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article}
                showImage={false}
                onArticleClick={setSelectedArticle}
              />
            ))}
          </div>
        )}

        {articles.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            No articles found in this category
          </div>
        )}
      </div>

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </>
  );
}