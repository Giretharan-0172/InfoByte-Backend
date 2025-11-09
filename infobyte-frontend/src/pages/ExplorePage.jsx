import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { feedAPI } from '../services/api';
import ArticleCard from '../components/feed/ArticleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    try {
      const response = await feedAPI.getTrending(0, 6);
      setTrendingArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error loading trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = searchQuery
    ? trendingArticles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : trendingArticles;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore</h1>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-12 pr-4 py-4 bg-navy-800 border border-gray-700 rounded-xl focus:outline-none focus:border-accent-blue transition-colors text-lg"
        />
      </div>

      {/* Trending Section */}
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="text-green-500" size={24} />
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {filteredArticles.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          No articles found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}