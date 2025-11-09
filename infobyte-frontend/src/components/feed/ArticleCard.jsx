import React, { useEffect, useRef } from 'react';
import { Heart, Bookmark, Share2, ExternalLink, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArticleInteraction } from '../../hooks/useArticleInteraction';
import { categoryColors, formatTimeAgo, shareArticle } from '../../utils/helpers';
import { interactionAPI } from '../../services/api';

export default function ArticleCard({ article, isHero = false }) {
  const { user } = useAuth();
  const { liked, bookmarked, toggleLike, toggleBookmark } = useArticleInteraction(article.id, user?.userId);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    return () => {
      const readTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (readTime > 3) {
        interactionAPI.recordView(user.userId, article.id, readTime).catch(console.error);
      }
    };
  }, [article.id, user.userId]);

  const handleShare = async () => {
    await shareArticle(article, user.userId);
  };

  return (
    <div className={`bg-navy-800 rounded-xl overflow-hidden border border-gray-800 hover:border-accent-blue transition-all ${
      isHero ? 'col-span-2' : ''
    }`}>
      {/* Hero Image */}
      {isHero && (
        <div className="h-80 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 text-6xl">🚀</div>
        </div>
      )}

      <div className="p-6">
        {/* Category & Time */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-600'}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            {formatTimeAgo(article.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-3 hover:text-accent-blue transition-colors cursor-pointer ${
          isHero ? 'text-3xl' : 'text-xl'
        }`}>
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-400 mb-4 line-clamp-2">
          {article.summary}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm">{(article.stats?.likeCount || 0) + (liked ? 1 : 0)}</span>
            </button>

            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-2 transition-colors ${
                bookmarked ? 'text-accent-blue' : 'text-gray-400 hover:text-accent-blue'
              }`}
            >
              <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
            >
              <Share2 size={20} />
              <span className="text-sm">{article.stats?.shareCount || 0}</span>
            </button>
          </div>

          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent-blue hover:text-blue-400 text-sm transition-colors"
          >
            Read original
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}