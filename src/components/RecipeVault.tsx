import React, { useState } from 'react';
import { Layers, Plus, Search, Settings, X } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeCategory, Recipe } from '../types/coffee';
import { CategoryPillSelector } from './CategoryPillSelector';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { BrewMethodsSheet } from './BrewMethods';
import { Btn } from '../brew/ui';

interface Props {
  onLaunchBrew: (recipe: Recipe) => void;
  onOpenSetup?: () => void;
  onOpenGear?: (c: CoffeeCategory) => void;
}

export const RecipeVault: React.FC<Props> = ({ onLaunchBrew, onOpenSetup, onOpenGear }) => {
  const { recipes, activeCategory, setActiveCategory } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [methodsOpen, setMethodsOpen] = useState(false);

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
    <div className="px-4 sm:px-6 pb-6">
      {/* Screen band */}
      <header className="-mx-4 sm:-mx-6 bg-ink text-paper px-4 sm:px-6 py-4 flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1 basis-[220px]">
          <h1 className="text-[28px] font-black tracking-[-0.02em] leading-tight">Recipe Vault</h1>
          <p className="text-[13px] opacity-80 mt-0.5">
            Saved recipes for each discipline, with the beans, tools and water they were dialled in on.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMethodsOpen(true)}
          className="min-h-[44px] px-3 border border-paper text-[13px] font-bold flex items-center gap-2 whitespace-nowrap"
        >
          <Layers className="w-4 h-4" aria-hidden />
          Brew methods
        </button>
        {onOpenSetup && (
          <button
            type="button"
            onClick={onOpenSetup}
            className="min-h-[44px] px-3 border border-paper text-[13px] font-bold flex items-center gap-2 whitespace-nowrap"
          >
            <Settings className="w-4 h-4" aria-hidden />
            Customise setup & tools
          </button>
        )}
      </header>

      {/* Search + create */}
      <div className="flex items-stretch gap-2 py-3 border-b border-rule">
        <label className="relative flex-1 min-w-0">
          <span className="sr-only">Search recipes</span>
          <Search className="w-5 h-5 text-mute absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
          <input
            type="text"
            enterKeyHint="search"
            placeholder="Search bean, tools or notes"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-paper border border-ink pl-10 pr-11 text-[15px] text-ink"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-0 top-0 w-11 h-12 flex items-center justify-center text-mute"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </label>
        <Btn variant="primary" size="md" className="!min-h-[48px] shrink-0" onClick={handleCreateNew}>
          <Plus className="w-5 h-5" aria-hidden />
          <span>New<span className="hidden sm:inline"> recipe</span></span>
        </Btn>
      </div>

      {/* Discipline filter */}
      <div className="py-2 border-b border-rule">
        <CategoryPillSelector activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      </div>

      <p className="label-caps pt-4 pb-2" aria-live="polite">
        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
      </p>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 pb-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onEdit={handleEdit} onLaunchBrew={onLaunchBrew} />
          ))}
        </div>
      ) : (
        <section className="border-t border-ink py-8 max-w-md">
          <h2 className="text-[19px] font-extrabold">No recipes found</h2>
          <p className="text-[14px] text-mute mt-1">
            Try another search or discipline, or create a new recipe.
          </p>
          <Btn size="md" className="mt-4" onClick={handleCreateNew}>
            <Plus className="w-4 h-4" aria-hidden />
            Create a recipe
          </Btn>
        </section>
      )}

      {/* Recipe Create/Edit Modal */}
      <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipeToEdit={recipeToEdit} />
      {methodsOpen && <BrewMethodsSheet onClose={() => setMethodsOpen(false)} onOpenGear={onOpenGear ? (c) => { setMethodsOpen(false); onOpenGear(c); } : undefined} />}
    </div>
  );
};
