import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { feedAPI } from '../services/api';
import ArticleModal from '../components/common/ArticleModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ExploreHero from '../components/explore/ExploreHero';
import TopStoriesWidget from '../components/explore/TopStoriesWidget';
import InfoWidgets from '../components/explore/InfoWidgets';
import ArticleCard from '../components/feed/ArticleCard';

export default function ExplorePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [heroArticles, setHeroArticles] = useState([]);
  const [topStories, setTopStories] = useState([]);
  
  const [searchResults, setSearchResults] = useState(null); 
  const [isSearching, setIsSearching] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId && !searchResults) {
      loadPersonalizedTrending();
    }
  }, [user?.userId, searchResults]);

  const loadPersonalizedTrending = async () => {
    setLoading(true);
    try {
      // Fetch 27 articles: 7 for hero, 20 for top stories
      const response = await feedAPI.getPersonalizedTrending(user.userId, 0, 27); 
      const articles = response.data.articles || [];
      
      setHeroArticles(articles.slice(0, 7)); 
      setTopStories(articles.slice(7, 27));
    } catch (error) {
      console.error('Error loading trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key !== 'Enter') return;
    
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const response = await feedAPI.search(searchQuery, 0, 20);
      setSearchResults(response.data.articles || []);
    } catch (error) {
      console.error('Error searching articles:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const renderSearchResults = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Search results for "{searchQuery}"</h2>
      {isSearching ? (
        <LoadingSpinner />
      ) : (
        <>
          {searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                  // ✅ UPDATED: Set to false to match FeedPage layout
                  showImage={false} 
                  onArticleClick={setSelectedArticle}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No articles found matching your search.</p>
          )}
        </>
      )}
    </div>
  );

  const renderDashboard = () => (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
            <div className="lg:col-span-2 h-full">
              <ExploreHero 
                articles={heroArticles} 
                onArticleClick={setSelectedArticle} 
              />
            </div>
            
            <div className="lg:col-span-1 h-full">
              <TopStoriesWidget 
                articles={topStories} 
                onArticleClick={setSelectedArticle} 
              />
            </div>
          </div>
          <div>
            <InfoWidgets />
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Explore</h1>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 bg-navy-800/75 backdrop-blur-lg border border-gray-700/50 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
            />
          </div>
        </div>
        
        {searchResults ? renderSearchResults() : renderDashboard()}

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