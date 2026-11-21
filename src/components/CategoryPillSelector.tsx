import React from 'react';
import { CoffeeCategory } from '../types/coffee';
import { MODES } from '../brew/modes';

interface Props {
  activeCategory: CoffeeCategory | 'all';
  onSelectCategory: (cat: CoffeeCategory | 'all') => void;
}

const CATEGORIES: { id: CoffeeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All disciplines' },
  { id: 'espresso', label: 'Benchtop Espresso' },
  { id: 'manual_lever', label: 'Manual Lever & Portable' },
  { id: 'moka_stovetop', label: 'Stovetop & Moka Pot' },
  { id: 'filter', label: 'Modern Filter Coffee' },
  { id: 'immersion', label: 'Immersion & AeroPress' },
  { id: 'singaporean_kopi', label: 'Singaporean Kopi' },
];

/** Horizontal, scrollable discipline filter. The selected chip fills with the mode colour. */
export const CategoryPillSelector: React.FC<Props> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1" role="group" aria-label="Filter by discipline">
      {CATEGORIES.map(cat => {
        const isActive = activeCategory === cat.id;
        const mode = cat.id === 'all' ? null : MODES[cat.id];
        const on = isActive ? (mode ? `${mode.bg} ${mode.on} border-transparent` : 'bg-ink text-paper border-ink') : 'bg-paper text-ink border-rule';
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 whitespace-nowrap min-h-[44px] px-3.5 border text-[14px] font-bold flex items-center gap-2 ${on}`}
          >
            {mode && <i className={`w-3.5 h-3.5 shrink-0 ${mode.bg} ${isActive ? 'border border-current' : ''}`} aria-hidden />}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
