import React, { useState } from 'react';
import { Plus, Search, Sparkles, BookOpen } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { Recipe } from '../types/coffee';
import { CategoryPillSelector } from './CategoryPillSelector';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';

interface Props {
  onLaunchBrew: (recipe: Recipe) => void;
}

export const RecipeVault: React.FC<Props> = ({ onLaunchBrew }) => {
  const { recipes, activeCategory, setActiveCategory } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  // Filter recipes by Category and Search Query
  const filteredRecipes = recipes.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateNew = () => {
    setRecipeToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2.5">
            <BookOpen className="w-7 h-7 text-amber-500" />
            <span>Coffee Recipe Vault</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Browse, customize, and pull curated recipes tailored to specific bean origins, equipment rigs, and water chemistry.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search bean, rig, or notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Recipe</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryPillSelector
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={handleEdit}
              onLaunchBrew={onLaunchBrew}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-900/50 border border-stone-800/80 rounded-3xl p-8">
          <Sparkles className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-300">No Recipes Found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or category filter, or create a brand new recipe.
          </p>
          <button
            onClick={handleCreateNew}
            className="mt-4 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold"
          >
            Create First Recipe
          </button>
        </div>
      )}

      {/* Recipe Create/Edit Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipeToEdit={recipeToEdit}
      />
    </div>
  );
};
