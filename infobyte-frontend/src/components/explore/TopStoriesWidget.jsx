import React from 'react';
import { formatTimeAgo } from '../../utils/helpers';

export default function TopStoriesWidget({ articles, onArticleClick }) {
  return (
    <div className="bg-navy-800/75 backdrop-blur-lg border border-gray-700/50 rounded-2xl h-full flex flex-col">
      <h3 className="text-xl font-bold p-4 border-b border-gray-700/50">Top Stories</h3>
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {articles.length > 0 ? articles.map(article => (
          <div 
            key={article.id}
            onClick={() => onArticleClick(article)}
            className="group cursor-pointer"
          >
            <span className="text-xs text-gray-400">{article.category} - {formatTimeAgo(article.createdAt)}</span>
            <p 
              className="text-sm font-medium text-gray-200 group-hover:text-accent-blue transition-colors truncate relative"
              title={article.title} // Tooltip for accessibility
            >
              {article.title}
              {/* Hover tooltip as requested */}
              <span className="absolute bottom-full left-0 mb-2 w-max max-w-xs
                               hidden group-hover:block 
                               bg-navy-900 text-white text-xs rounded-lg p-2 shadow-lg z-10
                               border border-gray-700">
                {article.title}
              </span>
            </p>
          </div>
        )) : (
          <p className="text-gray-400 text-sm">No other stories available.</p>
        )}
      </div>
    </div>
  );
}