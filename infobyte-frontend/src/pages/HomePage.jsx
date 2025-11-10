import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { feedAPI } from '../services/api';
import ArticleCard from '../components/feed/ArticleCard';
import ArticleModal from '../components/common/ArticleModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const { user } = useAuth();
  const { articles, loadMore, hasMore, loading } = useInfiniteScroll(feedAPI.getPersonalizedFeed);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      loadMore(user.userId);
    }
  }, [user?.userId]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Personalized Feed</h1>
          <p className="text-gray-400">
            Showing articles from: {user?.interests?.join(', ') || 'All categories'}
          </p>
        </div>

        {loading && articles.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* All Cards as Large Cards */}
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  isHero={true}
                  showImage={true}
                  onArticleClick={handleArticleClick}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => loadMore(user.userId)}
                  disabled={loading}
                  className="px-8 py-3 bg-accent-blue hover:bg-blue-600 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {!hasMore && articles.length > 0 && (
              <p className="text-center text-gray-400 py-8 mt-8">
                You've reached the end! 🎉
              </p>
            )}
          </>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </>
  );
}