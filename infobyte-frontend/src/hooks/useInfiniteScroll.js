import { useState, useCallback } from 'react';

export const useInfiniteScroll = (fetchFunction) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async (...args) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetchFunction(...args, page, 10);
      const newArticles = response.data.articles || [];
      
      setArticles(prev => [...prev, ...newArticles]);
      setPage(prev => prev + 1);
      setHasMore(response.data.currentPage < response.data.totalPages - 1);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, loading, hasMore]);

  const reset = () => {
    setArticles([]);
    setPage(0);
    setHasMore(true);
  };

  return { articles, loadMore, hasMore, loading, reset };
};             