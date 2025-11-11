import React from 'react';
import { X, Heart, Bookmark, Share2, Clock } from 'lucide-react';
import { useArticleInteraction } from '../../hooks/useArticleInteraction';
import { useAuth } from '../../context/AuthContext';
import { categoryColors, formatTimeAgo, shareArticle } from '../../utils/helpers';

export default function ArticleModal({ article, onClose }) {
  const { user } = useAuth();
  const { liked, bookmarked, toggleLike, toggleBookmark } = useArticleInteraction(article.id, user?.userId);

  if (!article) return null;

  const handleShare = async () => {
    await shareArticle(article, user.userId);
  };
  
  const hasImage = article.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-80" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-navy-800/75 backdrop-blur-lg rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700/50 flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 text-gray-300 bg-black/30 rounded-full p-1 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Single scrolling content area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          
          {/* ✅ NEW: Image Section with Overlay */}
          {hasImage ? (
            <div className="relative">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-80 object-cover" // Taller image for modal
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content on top of Image */}
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-600'}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimeAgo(article.createdAt)}
                  </span>
                </div>
                <h1 className="font-bold text-3xl text-white">
                  {article.title}
                </h1>
              </div>
            </div>
          ) : (
            // ✅ NEW: Fallback header if no image
            <div className="p-6 pt-12">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-600'}`}>
                  {article.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimeAgo(article.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4 pr-8">{article.title}</h1>
            </div>
          )}

          {/* Content (below image) */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {article.originalContent}
              </p>
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-700/50 my-6" />

            {/* Action buttons */}
            <div className="flex items-center justify-start">
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}