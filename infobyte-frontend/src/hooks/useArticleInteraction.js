import { useState, useEffect } from 'react';
import { interactionAPI } from '../services/api';

export const useArticleInteraction = (articleId, userId) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId || !userId) return;

    interactionAPI.getInteraction(userId, articleId)
      .then(res => {
        setLiked(res.data.liked || false);
        setBookmarked(res.data.bookmarked || false);
      })
      .catch(() => {
        setLiked(false);
        setBookmarked(false);
      })
      .finally(() => setLoading(false));
  }, [articleId, userId]);

  const toggleLike = async () => {
    try {
      const res = await interactionAPI.toggleLike(userId, articleId);
      setLiked(res.data.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await interactionAPI.toggleBookmark(userId, articleId);
      setBookmarked(res.data.bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return { liked, bookmarked, toggleLike, toggleBookmark, loading };
};