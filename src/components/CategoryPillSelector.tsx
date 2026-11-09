import React from 'react';
import { CoffeeCategory } from '../types/coffee';

interface Props {
  activeCategory: CoffeeCategory | 'all';
  onSelectCategory: (cat: CoffeeCategory | 'all') => void;
}

const CATEGORIES: { id: CoffeeCategory | 'all'; label: string; icon: string; countBadge?: string }[] = [
  { id: 'all', label: 'All Disciplines', icon: '☕' },
  { id: 'espresso', label: 'Benchtop Espresso', icon: '⚡' },
  { id: 'manual_lever', label: 'Manual Lever & Portable', icon: '🦾' },
  { id: 'moka_stovetop', label: 'Stovetop & Moka Pot', icon: '🔥' },
  { id: 'filter', label: 'Modern Filter Coffee', icon: '💧' },
  { id: 'immersion', label: 'Immersion & AeroPress', icon: '⏳' },
  { id: 'singaporean_kopi', label: 'Singaporean Kopi', icon: '🇸🇬' },
];

export const CategoryPillSelector: React.FC<Props> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
      {CATEGORIES.map(cat => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-2 border ${
              isActive
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-950/40 font-semibold'
                : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-800/80'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
