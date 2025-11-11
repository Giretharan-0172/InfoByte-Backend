import React, { useEffect, useRef } from 'react';
import { Heart, Bookmark, Share2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useArticleInteraction } from '../../hooks/useArticleInteraction';
import { categoryColors, formatTimeAgo, shareArticle } from '../../utils/helpers';
import { interactionAPI } from '../../services/api';

export default function ArticleCard({ article, isHero = false, showImage = true, onArticleClick }) {
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

  const handleShare = async (e) => {
    e.stopPropagation();
    await shareArticle(article, user.userId);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (onArticleClick) onArticleClick(article);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike();
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    toggleBookmark();
  };

  const hasImage = showImage && article.imageUrl;

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-abyss-700 rounded-2xl border border-abyss-500 hover:border-cyber-500/50 transition-all cursor-pointer overflow-hidden"
    >
      {/* Main Content Container - Block Layout */}
      <div className="p-6 block relative after:content-[''] after:table after:clear-both">
        
        {/* Right Side - Image (Floated) */}
        {/* Placed first in DOM to float correctly to the right */}
        {hasImage && (
          <div className="w-full md:w-72 h-48 mb-4 md:mb-0 md:ml-6 md:float-right rounded-xl overflow-hidden flex-shrink-0">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Content Sections - Wraps around image */}
        <div className="content-wrapper">
          
          {/* Category & Time */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-600 text-white'}`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(article.createdAt)}
            </span>
          </div>

          {/* Title - Full text displayed */}
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyber-500 transition-colors">
            {article.title}
          </h3>

          {/* Summary - Full text displayed */}
          <p className="text-gray-400 text-sm mb-4">
            {article.summary}
          </p>

          {/* Actions at Bottom */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
              }`}
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{(article.stats?.likeCount || 0) + (liked ? 1 : 0)}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 transition-colors ${
                bookmarked ? 'text-cyber-500' : 'text-gray-500 hover:text-cyber-500'
              }`}
            >
              <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-gray-500 hover:text-matrix-500 transition-colors"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">{article.stats?.shareCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}