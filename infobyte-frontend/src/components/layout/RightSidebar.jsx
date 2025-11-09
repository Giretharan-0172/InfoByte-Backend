import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { categoryColors } from '../../utils/helpers';

export default function RightSidebar() {
  const { user } = useAuth();
  const categories = ['AI', 'GEO POLITICS', 'Sports', 'Business', 'Medicine', 'Science'];

  return (
    <div className="w-80 bg-navy-800 border-l border-gray-800 p-6 overflow-y-auto scrollbar-hide">
      {/* User Interests */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Your Interests</h3>
        <div className="flex flex-wrap gap-2">
          {user?.interests?.map(interest => (
            <span
              key={interest}
              className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[interest] || 'bg-gray-600'}`}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* FEED Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">FEED</h3>
        <div className="space-y-4">
          {[
            { name: 'AI', category: 'Technology' },
            { name: 'GEO POLITICS', category: 'WorldNews' },
            { name: 'Sports', category: 'Sports' }
          ].map(item => (
            <div key={item.name} className="bg-navy-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{item.name}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">
                  • Big Tech overhauls mid...
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  • NYC Proposes AI Chat...
                </li>
                <li className="hover:text-white cursor-pointer transition-colors">
                  • Secretaries vs AI
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          Trending
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
            >
              <span className="text-green-500 font-bold">#{i}</span>
              <span>Trending Topic {i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}