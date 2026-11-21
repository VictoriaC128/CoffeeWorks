import { Bean, BrewSession, BrewStep, GearProfile, PrepItem, Recipe, WaterProfile } from '../types/coffee';
import { ModeMeta } from './modes';
import { BrewTimer } from './useBrewTimer';
import { defaultPrep } from './steps';

/** Everything that can differ from the recipe for this one brew. */
export interface BrewSetup {
  dose: number;
  /** grams of water (filter, immersion, kopi) or grams in the cup (espresso, lever, moka) */
  water: number;
  tempC: number;
  grind: string;
  beanId?: string;
  waterProfileId?: string;
  prep: PrepItem[];
  prepDone: string[];
  /** "This brew only" steps from the step editor */
  stepsOverride?: BrewStep[];
}

export function setupFrom(recipe: Recipe, gear?: GearProfile): BrewSetup {
  return {
    dose: recipe.doseGrams,
    water: recipe.yieldGrams,
    tempC: recipe.waterTempC,
    grind: recipe.grindSetting,
    beanId: recipe.beanId,
    waterProfileId: recipe.waterProfileId,
    prep: recipe.prepItems?.length ? recipe.prepItems : defaultPrep(recipe, gear),
    prepDone: [],
  };
}

export interface BrewModel {
  recipe: Recipe;
  lot: string;
  mode: ModeMeta;
  steps: BrewStep[];
  setup: BrewSetup;
  setSetup: (fn: (s: BrewSetup) => BrewSetup) => void;
  bean?: Bean;
  gear?: GearProfile;
  water?: WaterProfile;
  timer: BrewTimer;
  /** Sessions of this recipe, newest first */
  history: BrewSession[];
  brewNumber: number;
  open: (view: 'prep' | 'steps' | 'change' | 'picker') => void;
  finish: () => void;
}

export function beanAgeDays(bean?: Bean): number | undefined {
  if (!bean?.roastDate) return undefined;
  const d = Math.floor((Date.now() - new Date(bean.roastDate).getTime()) / 86400000);
  return Number.isFinite(d) && d >= 0 ? d : undefined;
}

/** Scale step weights when the barista changes the water/yield for this brew. */
export function scaleSteps(steps: BrewStep[], factor: number): BrewStep[] {
  if (Math.abs(factor - 1) < 0.001) return steps;
  return steps.map((s) => (s.targetWeightGrams ? { ...s, targetWeightGrams: Math.round(s.targetWeightGrams * factor) } : s));
}

/** Words for the finish button per discipline. */
export function finishLabel(category: Recipe['category']) {
  switch (category) {
    case 'espresso':
    case 'manual_lever': return 'Stop shot & taste';
    case 'moka_stovetop': return 'Off heat & taste';
    case 'singaporean_kopi': return 'Serve & taste';
    default: return 'Finish & taste';
  }
}

/** One line of advice for the running screen, from the last brew of this recipe. */
export function runningAdvice(history: BrewSession[], grind: string): string {
  const last = history[0];
  if (!last) return `First brew of this recipe. Taste it at the end and the next brew gets a dial-in suggestion. Grind ${grind}.`;
  const verdict = {
    under_extracted: 'tasted sour or thin',
    balanced: 'tasted balanced',
    over_extracted: 'tasted bitter or dry',
    channeling: 'channelled',
    stalled: 'stalled',
  }[last.sensory.verdict];
  const tip = last.dialInAdvice?.[0] ? ` ${last.dialInAdvice[0].split('. ')[0].replace(/\.$/, '')}.` : '';
  return `Last brew ${verdict}.${tip}`;
}
