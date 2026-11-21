import { grindShort } from '../brew/steps';
import React, { useState } from 'react';
import { Play, Copy, Pencil, Trash2, Star, Check } from 'lucide-react';
import { Recipe } from '../types/coffee';
import { useCoffee } from '../context/CoffeeContext';
import { MODES, lotFor } from '../brew/modes';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { Btn } from '../brew/ui';

interface Props {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onLaunchBrew: (recipe: Recipe) => void;
}

const has = (v?: string) => !!v && v !== 'N/A';

export const RecipeCard: React.FC<Props> = ({ recipe, onEdit, onLaunchBrew }) => {
  const {
    recipes,
    beans,
    gearProfiles,
    waterProfiles,
    deleteRecipe,
    duplicateRecipe,
    userPreferences,
    setDefaultRecipeForCategory,
  } = useCoffee();
  const { settings } = useSettings();
  const u = settings.units;

  const [toastMessage, setToastMessage] = useState<string>('');

  const mode = MODES[recipe.category];
  const lot = lotFor(recipe, recipes);
  const bean = beans.find(b => b.id === recipe.beanId);
  const gear = gearProfiles.find(g => g.id === recipe.gearId);
  const water = waterProfiles.find(w => w.id === recipe.waterProfileId);

  const isDefault = userPreferences.defaultRecipePerCategory[recipe.category] === recipe.id;

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

  const handleToggleDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDefaultRecipeForCategory(recipe.category, recipe.id);
    setToastMessage(`Daily driver for ${mode.label}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Key numbers
  const dose = F.coffee(recipe.doseGrams, u);
  const yieldR = F.scale(recipe.yieldGrams, u, mode.scaleIsWater);
  const temp = F.temp(recipe.waterTempC, u);
  const ratio = `1:${recipe.ratio || (recipe.yieldGrams / recipe.doseGrams).toFixed(1)}`;
  const grind = F.grind(recipe.grindSetting, recipe.grindMicrons, u);

  const cells: { k: string; v: React.ReactNode; title?: string }[] = [
    { k: 'Dose', v: <>{dose.value}<small className="text-[12px] text-mute font-semibold ml-0.5">{dose.unit}</small></> },
    { k: 'Yield', v: <>{yieldR.value}<small className="text-[12px] text-mute font-semibold ml-0.5">{yieldR.unit}</small></> },
    { k: 'Ratio', v: ratio },
    { k: 'Time', v: F.clock(recipe.targetTotalTimeSeconds, u) },
    { k: 'Water temp', v: <>{temp.value}<small className="text-[12px] text-mute font-semibold ml-0.5">{temp.unit}</small></> },
    { k: 'Grind', v: u.grind === 'um' ? grind : grindShort(recipe.grindSetting), title: recipe.grindSetting },
  ];

  // Equipment & tool rows
  const rows: [string, string][] = [];
  if (gear && (gear.dripperModel || gear.machineModel) && gear.dripperModel !== 'N/A' && gear.machineModel !== 'N/A') {
    rows.push([gear.dripperModel ? 'Dripper' : 'Machine', (gear.dripperModel || gear.machineModel) as string]);
  }
  if (recipe.basketSpec && has(recipe.basketSpec.brand)) {
    const b = recipe.basketSpec;
    rows.push(['Basket', [b.brand, has(b.sizeGrams) ? b.sizeGrams : '', has(b.diameterMm) ? `(${b.diameterMm})` : ''].filter(Boolean).join(' · ').replace(' · (', ' (')]);
  }
  if (has(recipe.portafilter)) rows.push(['Portafilter', recipe.portafilter as string]);
  if (has(recipe.showerScreen)) rows.push(['Shower screen', recipe.showerScreen as string]);
  if (has(gear?.filterPaperType)) rows.push(['Filter paper', gear!.filterPaperType as string]);
  if (gear?.puckPrep && (gear.category === 'espresso' || gear.category === 'manual_lever')) {
    const p = gear.puckPrep;
    const prep = [
      p.wdt && 'WDT',
      p.tamperType === 'calibrated_30lb' && '30 lb tamp',
      p.puckScreen && 'Puck screen',
      p.bottomPaperFilter && 'Bottom paper',
    ].filter(Boolean) as string[];
    if (prep.length) rows.push(['Puck prep', prep.join(' · ')]);
  }
  if (water) rows.push(['Water', `${water.name} · ${water.tdsPpm} ppm TDS`]);

  const iconBtn = 'w-11 h-11 shrink-0 flex items-center justify-center border border-rule text-ink';

  return (
    <article className="relative border border-ink bg-paper flex flex-col" aria-label={recipe.title}>
      {/* Label band in the discipline colour */}
      <header className={`${mode.bg} ${mode.on} px-4 py-2 min-h-[40px] flex items-center gap-2`}>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] truncate">{lot} · {mode.label}</span>
        {isDefault && (
          <span className="ml-auto shrink-0 border border-current px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" aria-hidden />
            Daily driver
          </span>
        )}
      </header>

      {toastMessage && (
        <div role="status" className="absolute inset-x-0 top-0 z-10 min-h-[40px] bg-ink text-paper px-4 py-2 text-[13px] font-bold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" aria-hidden />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      <div className="px-4 pt-3 pb-3">
        <h3 className="text-[19px] font-extrabold leading-tight tracking-[-0.01em] line-clamp-2">{recipe.title}</h3>
        {bean && (
          <p className="text-[13px] text-mute mt-1 truncate">
            {bean.name} · {bean.roastLevel} · {bean.processMethod}
          </p>
        )}
      </div>

      {/* Key numbers */}
      <dl className="grid grid-cols-3 border-y border-rule">
        {cells.map((c, i) => (
          <div key={c.k} className={`px-4 py-2 min-w-0 border-rule ${i % 3 !== 2 ? 'border-r' : ''} ${i < 3 ? 'border-b' : ''}`}>
            <dt className="label-caps !text-[10.5px]">{c.k}</dt>
            <dd className="text-[20px] font-bold num leading-tight truncate" title={c.title}>{c.v}</dd>
          </div>
        ))}
      </dl>

      {/* Equipment */}
      {rows.length > 0 && (
        <dl className="px-4">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-3 py-2 border-b border-rule last:border-b-0 text-[13px]">
              <dt className="label-caps w-[92px] shrink-0 pt-px">{k}</dt>
              <dd className="min-w-0 truncate font-medium" title={v}>{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {(recipe.updatedAt || recipe.createdAt) && (
        <p className="px-4 pt-1 pb-2 text-[12px] text-mute truncate">Saved {recipe.updatedAt || recipe.createdAt}</p>
      )}

      {/* Actions */}
      <footer className="mt-auto border-t border-ink p-2 flex items-center gap-2">
        <Btn size="md" className="flex-1 min-w-0 !min-h-[44px]" onClick={() => onLaunchBrew(recipe)}>
          <Play className="w-4 h-4 fill-current shrink-0" aria-hidden />
          <span className="truncate">Brew</span>
        </Btn>
        <button
          type="button"
          onClick={handleToggleDefault}
          aria-pressed={isDefault}
          aria-label={isDefault ? `${recipe.title} is the daily driver for ${mode.label}` : `Make ${recipe.title} the daily driver for ${mode.label}`}
          className={`${iconBtn} ${isDefault ? `${mode.bg} ${mode.on} !border-transparent` : ''}`}
        >
          <Star className={`w-[18px] h-[18px] ${isDefault ? 'fill-current' : ''}`} />
        </button>
        <button type="button" onClick={handleDuplicate} aria-label={`Duplicate ${recipe.title}`} className={iconBtn}>
          <Copy className="w-[18px] h-[18px]" />
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onEdit(recipe);
          }}
          aria-label={`Edit ${recipe.title}`}
          className={iconBtn}
        >
          <Pencil className="w-[18px] h-[18px]" />
        </button>
        <button type="button" onClick={handleDelete} aria-label={`Delete ${recipe.title}`} className={`${iconBtn} text-bad`}>
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </footer>
    </article>
  );
};
