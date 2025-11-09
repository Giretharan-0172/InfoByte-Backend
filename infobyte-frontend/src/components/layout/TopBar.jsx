import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopBar({ onSearch }) {
  return (
    <div className="sticky top-0 z-10 bg-navy-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-gray-700 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
        <button className="relative p-2 hover:bg-navy-800 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}