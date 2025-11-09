import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { feedAPI } from '../services/api';
import InfiniteList from '../components/feed/InfiniteList';
import HeroCard from '../components/feed/HeroCard';

export default function HomePage() {
  const { user } = useAuth();
  const { articles, loadMore, hasMore, loading } = useInfiniteScroll(feedAPI.getPersonalizedFeed);

  useEffect(() => {
    if (user?.userId) {
      loadMore(user.userId);
    }
  }, [user?.userId]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Personalized Feed</h1>
        <p className="text-gray-400">
          Showing articles from: {user?.interests?.join(', ') || 'All categories'}
        </p>
      </div>

      {articles.length > 0 && <HeroCard article={articles[0]} />}

      <div className="mt-6">
        <InfiniteList
          articles={articles.slice(1)}
          loadMore={() => loadMore(user.userId)}
          hasMore={hasMore}
          loading={loading}
        />
      </div>
    </div>
  );
}