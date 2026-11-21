import { CoffeeCategory, Recipe } from '../types/coffee';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';

export interface ModeMeta {
  id: CoffeeCategory;
  label: string;
  short: string;
  /** CSS custom property holding the RGB triplet */
  cssVar: string;
  /** Tailwind classes for the mode colour */
  bg: string;
  text: string;
  /** Text colour on the mode colour */
  on: string;
  /** Scale weight is kettle water (ml) rather than coffee in the cup (g) */
  scaleIsWater: boolean;
  /** Has a pressure profile (espresso-style step editor) */
  pressure: boolean;
}

export const MODES: Record<CoffeeCategory, ModeMeta> = {
  espresso: { id: 'espresso', label: 'Espresso', short: 'Esp', cssVar: '--m-espresso', bg: 'bg-mode-espresso', text: 'text-mode-espresso', on: 'text-[#fff]', scaleIsWater: false, pressure: true },
  manual_lever: { id: 'manual_lever', label: 'Lever', short: 'Lever', cssVar: '--m-lever', bg: 'bg-mode-lever', text: 'text-mode-lever', on: 'text-[#fff]', scaleIsWater: false, pressure: true },
  moka_stovetop: { id: 'moka_stovetop', label: 'Moka', short: 'Moka', cssVar: '--m-moka', bg: 'bg-mode-moka', text: 'text-mode-moka', on: 'text-[#151515]', scaleIsWater: false, pressure: false },
  filter: { id: 'filter', label: 'Filter', short: 'Filter', cssVar: '--m-filter', bg: 'bg-mode-filter', text: 'text-mode-filter', on: 'text-[#fff]', scaleIsWater: true, pressure: false },
  immersion: { id: 'immersion', label: 'Immersion', short: 'Imm', cssVar: '--m-immersion', bg: 'bg-mode-immersion', text: 'text-mode-immersion', on: 'text-[#fff]', scaleIsWater: true, pressure: false },
  singaporean_kopi: { id: 'singaporean_kopi', label: 'Kopi', short: 'Kopi', cssVar: '--m-kopi', bg: 'bg-mode-kopi', text: 'text-mode-kopi', on: 'text-[#fff]', scaleIsWater: true, pressure: false },
};

export const MODE_ORDER: CoffeeCategory[] = ['espresso', 'manual_lever', 'moka_stovetop', 'filter', 'immersion', 'singaporean_kopi'];

/** Lot code printed on the label band: presets keep their catalogue number, user recipes start at 100. */
export function lotFor(recipe: Recipe, all: Recipe[]): string {
  const preset = DEFAULT_RECIPES.findIndex((r) => r.id === recipe.id);
  let n: number;
  if (preset >= 0) n = preset + 1;
  else {
    const users = all.filter((r) => !DEFAULT_RECIPES.some((d) => d.id === r.id));
    n = 100 + (users.length - users.findIndex((r) => r.id === recipe.id));
  }
  const base = `CW-${String(n).padStart(3, '0')}`;
  return recipe.baseRecipeId ? `${base}·B` : base;
}
