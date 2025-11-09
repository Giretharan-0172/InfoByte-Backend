import React from 'react';
import { categoryColors } from '../../utils/helpers';

const CATEGORIES = ['Technology', 'Business', 'Sports', 'Medicine', 'Science', 'WorldNews'];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          selected === null
            ? 'bg-accent-blue text-white'
            : 'bg-navy-800 text-gray-400 hover:text-white'
        }`}
      >
        All
      </button>
      {CATEGORIES.map(category => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selected === category
              ? categoryColors[category] + ' text-white'
              : 'bg-navy-800 text-gray-400 hover:text-white'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}