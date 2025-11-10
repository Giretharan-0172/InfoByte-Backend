// ===== BookmarksPage.jsx =====
import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { interactionAPI } from '../services/api';
import ArticleCard from '../components/feed/ArticleCard';
import ArticleModal from '../components/common/ArticleModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BookmarksPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [user?.userId]);

  const loadBookmarks = async () => {
    try {
      const response = await interactionAPI.getBookmarkedArticles(user.userId);
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2">Bookmarks</h1>
        <p className="text-gray-400 mb-6">{articles.length} saved articles</p>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">No bookmarks yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Bookmark articles to read them later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

