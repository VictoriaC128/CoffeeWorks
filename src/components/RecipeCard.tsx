import React from 'react';
import {
  Play,
  Copy,
  Edit2,
  Trash2,
  Scale,
  Droplets,
  Thermometer,
  Layers,
  Sparkles,
  Gauge,
  ShieldCheck
} from 'lucide-react';
import { Recipe } from '../types/coffee';
import { useCoffee } from '../context/CoffeeContext';

interface Props {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onLaunchBrew: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<Props> = ({ recipe, onEdit, onLaunchBrew }) => {
  const { beans, gearProfiles, waterProfiles, deleteRecipe, duplicateRecipe } = useCoffee();

  const bean = beans.find(b => b.id === recipe.beanId);
  const gear = gearProfiles.find(g => g.id === recipe.gearId);
  const water = waterProfiles.find(w => w.id === recipe.waterProfileId);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateRecipe(recipe.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete recipe "${recipe.title}"?`)) {
      deleteRecipe(recipe.id);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 hover:border-stone-700/80 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Tags & Category */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            {recipe.category.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDuplicate}
              title="Duplicate & Customize Cup"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              title="Edit Recipe"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Recipe"
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {recipe.title}
        </h3>

        {/* Bean Details */}
        {bean && (
          <p className="text-xs text-stone-400 mt-1 flex items-center space-x-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {bean.name} ({bean.roastLevel} · {bean.processMethod})
            </span>
          </p>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 my-3 py-2.5 px-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-xs font-mono">
          <div>
            <span className="text-[10px] text-stone-400 block">Dose / Yield</span>
            <span className="font-bold text-stone-200">
              {recipe.doseGrams}g → {recipe.yieldGrams}g
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block">Ratio</span>
            <span className="font-bold text-amber-400">
              1:{recipe.ratio || (recipe.yieldGrams / recipe.doseGrams).toFixed(1)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 block">Time</span>
            <span className="font-bold text-stone-200">{recipe.targetTotalTimeSeconds}s</span>
          </div>
        </div>

        {/* Equipment & Tool Badges */}
        <div className="space-y-1 text-[11px] text-stone-300">
          {gear && (
            <div className="flex items-center space-x-1.5 truncate">
              <Layers className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="text-stone-300 truncate">
                {gear.dripperModel || gear.machineModel}
              </span>
            </div>
          )}

          {gear?.filterPaperType && (
            <div className="flex items-center space-x-1.5 text-amber-400/90 font-medium truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Filter: {gear.filterPaperType}</span>
            </div>
          )}

          {gear?.puckPrep && (gear.category === 'espresso' || gear.category === 'manual_lever') && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {gear.puckPrep.wdt && (
                <span className="bg-stone-800 text-[10px] text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">
                  WDT
                </span>
              )}
              {gear.puckPrep.tamperType === 'calibrated_30lb' && (
                <span className="bg-amber-950/60 text-[10px] text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/60">
                  30lb Tamp
                </span>
              )}
              {gear.puckPrep.puckScreen && (
                <span className="bg-stone-800 text-[10px] text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">
                  Puck Screen
                </span>
              )}
              {gear.puckPrep.bottomPaperFilter && (
                <span className="bg-stone-800 text-[10px] text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">
                  Bottom Paper
                </span>
              )}
            </div>
          )}

          {water && (
            <div className="flex items-center space-x-1.5 text-stone-400 truncate pt-1">
              <Droplets className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{water.name} ({water.tdsPpm} ppm)</span>
            </div>
          )}
        </div>

        {/* Grind setting */}
        <div className="mt-2.5 text-[11px] font-mono text-stone-400 flex items-center justify-between border-t border-stone-800/60 pt-2">
          <span>Grind: {recipe.grindSetting}</span>
          <span className="text-red-400 font-semibold">{recipe.waterTempC}°C</span>
        </div>
      </div>

      {/* Launch CTA */}
      <div className="mt-4 pt-3 border-t border-stone-800">
        <button
          onClick={() => onLaunchBrew(recipe)}
          className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-amber-950/40 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Brew This Cup</span>
        </button>
      </div>
    </div>
  );
};
