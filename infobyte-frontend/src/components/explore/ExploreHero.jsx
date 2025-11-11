import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Bookmark, Share2, ChevronLeft, ChevronRight } from 'lucide-react'; // ✅ NEW
import { categoryColors, formatTimeAgo } from '../../utils/helpers';
import { useInterval } from '../../hooks/useInterval';

export default function ExploreHero({ articles, onArticleClick }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // ✅ NEW

  const article = articles[index];

  // ✅ CHANGED: Auto-play only if not hovered
  useInterval(() => {
    if (articles.length > 0 && !isHovered) {
      setIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }
  }, 7000);

  // ✅ NEW: Navigation functions
  const goToNext = () => {
    if (articles.length > 0) {
      setIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }
  };

  const goToPrev = () => {
    if (articles.length > 0) {
      setIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
    }
  };

  if (!article) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-navy-800/75 backdrop-blur-lg border border-gray-700/50 flex items-center justify-center">
        <p className="text-gray-400">No trending articles found.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer bg-navy-800 group"
      // ✅ NEW: Pause on hover
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with Click */}
      <div onClick={() => onArticleClick(article)} className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={article.id}
            src={article.imageUrl}
            alt={article.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-600'}`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-300">{formatTimeAgo(article.createdAt)}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
          <p className="text-sm text-gray-300 line-clamp-2 mb-4">
            {article.summary}
          </p>
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <Heart size={18} />
              <span>{article.stats?.likeCount || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark size={18} />
              <span>{article.stats?.bookmarkCount || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 size={18} />
              <span>{article.stats?.shareCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Navigation Buttons */}
      <button 
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}