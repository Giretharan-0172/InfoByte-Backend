import React from 'react';
import { X, ExternalLink, Heart, Bookmark, Share2 } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-80" onClick={onClose}></div>
      
      <div className="relative bg-navy-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-navy-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-600'}`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{formatTimeAgo(article.createdAt)}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

          {/* Image (if exists) */}
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}

          {/* Summary */}
          {article.summary && (
            <div className="mb-6 p-4 bg-navy-700 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">SUMMARY</h3>
              <p className="text-gray-300">{article.summary}</p>
            </div>
          )}

          {/* Original Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {article.originalContent}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-navy-800 border-t border-gray-700 p-4">
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
              </button>
            </div>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 bg-accent-blue hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
            >
              Read Original
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}