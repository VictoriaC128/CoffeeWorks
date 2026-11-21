import { BrewStep, CoffeeCategory, CustomMethod, PrepItem, Recipe, StepAction, GearProfile } from '../types/coffee';

let seq = 0;
export const newStepId = () => `step-${Date.now().toString(36)}-${(seq++).toString(36)}`;

const AGITATION_TO_ACTION: Record<string, StepAction> = {
  swirl: 'pour_swirl', stir: 'stir', melodrip: 'pour', gentle_pour: 'pour', center_pour: 'pour', other: 'other',
};

function cleanName(name: string) {
  return name.replace(/^stage\s*\d+\s*[:.-]\s*/i, '').trim();
}

/** The preset schedule for a recipe, ignoring any custom steps. A custom method's starting steps come before the discipline defaults. */
export function presetSteps(recipe: Recipe, method?: CustomMethod): BrewStep[] {
  const total = Math.max(1, recipe.targetTotalTimeSeconds || 60);
  const stages = recipe.pourStages || [];
  if (stages.length) {
    const sorted = [...stages].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    return sorted.map((s, i) => {
      const next = sorted[i + 1];
      const end = next ? next.startTimeSeconds : Math.max(total, s.startTimeSeconds + s.durationSeconds);
      return {
        id: s.id,
        name: cleanName(s.name),
        durationSeconds: Math.max(1, end - s.startTimeSeconds),
        targetWeightGrams: s.targetWeightGrams,
        action: s.agitation ? AGITATION_TO_ACTION[s.agitation] : 'pour',
        notes: s.notes,
        endsWhen: 'time',
      };
    });
  }
  if (method?.steps?.length) return method.steps.map((s) => ({ ...s }));
  return defaultSteps(recipe.category, recipe, total);
}

function defaultSteps(cat: CoffeeCategory, r: Recipe, total: number): BrewStep[] {
  const y = r.yieldGrams;
  const mk = (name: string, d: number, extra: Partial<BrewStep> = {}): BrewStep => ({
    id: `${cat}-${name.toLowerCase().replace(/\W+/g, '-')}`, name, durationSeconds: Math.max(1, Math.round(d)), endsWhen: 'time', ...extra,
  });
  switch (cat) {
    case 'espresso': {
      const pre = r.preInfusionSeconds || 8;
      const rest = Math.max(6, total - pre);
      const ramp = rest * 0.25, hold = rest * 0.42;
      return [
        mk('Pre-infuse', pre, { control: 'pressure', target: r.preInfusionPressureBar || 3, action: 'wait' }),
        mk('Ramp to 9 bar', ramp, { control: 'pressure', target: 9, action: 'press' }),
        mk('Hold 9 bar', hold, { control: 'pressure', target: 9, targetWeightGrams: Math.round(y * 0.75), action: 'press' }),
        mk('Declining flow', rest - ramp - hold, { control: 'pressure', target: 6, targetWeightGrams: y, action: 'press', endsWhen: 'weight' }),
      ];
    }
    case 'manual_lever': {
      const pre = r.preInfusionSeconds || 10;
      const rest = Math.max(6, total - pre);
      const ramp = rest * 0.3;
      return [
        mk('Pre-infuse', pre, { control: 'pressure', target: r.preInfusionPressureBar || 2.5, action: 'wait' }),
        mk('Ramp to peak', ramp, { control: 'pressure', target: 9, action: 'press' }),
        mk('Declining pressure', rest - ramp, { control: 'pressure', target: 6, targetWeightGrams: y, action: 'press', endsWhen: 'weight' }),
      ];
    }
    case 'moka_stovetop': {
      const extract = 25, off = 5, fill = 30;
      return [
        mk('Fill & assemble', fill, { action: 'other' }),
        mk('Heat to valve', Math.max(30, total - fill - extract - off), { action: 'heat', endsWhen: 'valve' }),
        mk('Extraction', extract, { targetWeightGrams: y, action: 'wait', endsWhen: 'weight' }),
        mk('Off heat, cool base', off, { action: 'other' }),
      ];
    }
    case 'immersion':
      return [
        mk('Bloom', 30, { targetWeightGrams: Math.round(r.doseGrams * 2.5), action: 'pour_swirl' }),
        mk('Fill & steep', Math.max(20, total - 60), { targetWeightGrams: y, action: 'pour' }),
        mk('Press', 30, { action: 'press' }),
      ];
    case 'other':
      return [
        mk('Prepare', 30, { action: 'other' }),
        mk('Brew', Math.max(20, total - 60), { targetWeightGrams: y, action: 'pour' }),
        mk('Finish', 30, { action: 'other' }),
      ];
    case 'singaporean_kopi':
      return [
        mk('Bloom in sock', 30, { targetWeightGrams: Math.round(y * 0.3), action: 'pour' }),
        mk('Steep', Math.max(30, total - 90), { targetWeightGrams: y, action: 'wait' }),
        mk('Pull & dip ×3', 45, { action: 'dip' }),
        mk('Mix the cup', 15, { action: 'stir' }),
      ];
    case 'filter':
    default: {
      const bloom = 40;
      const pours = 3, each = Math.max(10, (total - bloom - 30) / pours);
      return [
        mk('Bloom', bloom, { targetWeightGrams: Math.round(r.doseGrams * 3), action: 'pour_swirl' }),
        ...Array.from({ length: pours }, (_, i) => mk(`Pour ${i + 2}`, each, { targetWeightGrams: Math.round(y * (i + 1) / pours), action: 'pour' })),
        mk('Drawdown', 30, { action: 'drawdown' }),
      ];
    }
  }
}

/** Steps the brew will run: the user's own if they made them, else the preset. */
export function stepsFor(recipe: Recipe, method?: CustomMethod): BrewStep[] {
  return recipe.customSteps && recipe.customSteps.length ? recipe.customSteps : presetSteps(recipe, method);
}

export const totalOf = (steps: BrewStep[]) => steps.reduce((a, s) => a + s.durationSeconds, 0);

export function startsOf(steps: BrewStep[]) {
  let t = 0;
  return steps.map((s) => { const at = t; t += s.durationSeconds; return at; });
}

/** Last pour-to weight in the schedule. */
export function finalWeight(steps: BrewStep[]) {
  for (let i = steps.length - 1; i >= 0; i--) if (steps[i].targetWeightGrams) return steps[i].targetWeightGrams!;
  return undefined;
}

export const ACTION_LABEL: Record<StepAction, string> = {
  pour: 'Pour', pour_swirl: 'Pour + swirl', swirl: 'Swirl', stir: 'Stir', wait: 'Wait', drawdown: 'Drawdown',
  press: 'Press', heat: 'Heat', dip: 'Dip', other: 'Other',
};

/** Step library offered by "+ From step library". */
export const STEP_LIBRARY: Omit<BrewStep, 'id'>[] = [
  { name: 'Bloom', durationSeconds: 40, action: 'pour_swirl' },
  { name: 'Rao spin', durationSeconds: 5, action: 'swirl' },
  { name: 'Stir', durationSeconds: 5, action: 'stir' },
  { name: 'Melodrip pour', durationSeconds: 25, action: 'pour' },
  { name: 'Drawdown', durationSeconds: 30, action: 'drawdown' },
  { name: 'Soak', durationSeconds: 5, control: 'pressure', target: 0, action: 'wait' },
  { name: 'Pre-infuse', durationSeconds: 8, control: 'pressure', target: 3, action: 'wait' },
  { name: 'Steep', durationSeconds: 60, action: 'wait' },
];

/** Default prep checklist built from the recipe's gear. */
export function defaultPrep(recipe: Recipe, gear?: GearProfile): PrepItem[] {
  const id = (n: string) => `prep-${n.toLowerCase().replace(/\W+/g, '-')}`;
  const item = (name: string, tool: string, setting = '', use = true): PrepItem => ({ id: id(name), name, tool, setting, use });
  const pp = gear?.puckPrep;
  switch (recipe.category) {
    case 'espresso':
    case 'manual_lever':
      return [
        item('Portafilter', recipe.portafilter || gear?.portafilter || 'Portafilter', 'Warm, dry'),
        ...(pp?.bottomPaperFilter ? [item('Bottom paper', 'Paper filter', '1 sheet, wet')] : []),
        item('RDT spray', 'Water spritz', '1 spray on beans', false),
        ...(pp?.wdt ? [item('WDT', pp.wdtNeedleSize || 'WDT tool', '20 s · to the floor')] : []),
        ...(pp?.distributor ? [item('Distributor', 'Leveller', 'Set depth')] : []),
        item('Tamp', tamperLabel(pp?.tamperType), 'Level, no polish'),
        ...(pp?.puckScreen ? [item('Puck screen', pp.puckScreenThickness || 'Puck screen', 'Flat on top')] : []),
        item('Lock in', gear?.machineModel?.split('/')[0].trim() || 'Machine', recipe.category === 'espresso' ? 'Flush 2 s first' : 'Preheat chamber'),
      ];
    case 'filter':
      return [
        item('Dripper', gear?.dripperModel || 'Dripper', 'On server'),
        item('Paper', gear?.filterPaperType || 'Filter paper', 'Seated flat'),
        item('Rinse + preheat', 'Kettle water', '150 g, discard'),
        ...(gear?.usesNegotiator ? [item('Negotiator', 'Orea Negotiator', 'Ring in')] : []),
        item('Grind + level', gear?.grinderModel?.split('(')[0].trim() || 'Grinder', 'Shake bed flat'),
        item('Tare + timer', 'Scale', 'Zero with coffee in'),
      ];
    case 'immersion':
      return [
        item('Brewer', gear?.machineModel || 'Brewer', 'Assembled, rinsed'),
        item('Grind', gear?.grinderModel || 'Grinder', 'Into brewer'),
        item('Tare + timer', 'Scale', 'Zero with coffee in'),
      ];
    case 'moka_stovetop':
      return [
        item('Fill boiler', 'Hot water', 'To the valve'),
        item('Basket', 'Moka basket', 'Level, no tamp'),
        item('Assemble', gear?.machineModel || 'Moka pot', 'Hand-tight'),
        item('Flame', 'Hob', 'Medium'),
      ];
    case 'other':
      return [
        item('Brewer', gear?.machineModel || 'Brewer', 'Ready, rinsed'),
        item('Grind', gear?.grinderModel?.split('(')[0].trim() || 'Grinder', recipe.grindSetting),
        item('Tare + timer', 'Scale', 'Zero with coffee in'),
      ];
    case 'singaporean_kopi':
      return [
        item('Sock', 'Flannel sock', 'Rinsed, hot'),
        item('Kettle', 'Long-spout kettle', 'Just off the boil'),
        item('Cup', 'Condensed / evaporated milk', 'Measured in'),
      ];
  }
}

function tamperLabel(t?: string) {
  switch (t) {
    case 'calibrated_30lb': return 'Calibrated 30 lb';
    case 'calibrated_25lb': return 'Calibrated 25 lb';
    case 'force_tamper': return 'Force Tamper';
    case 'electronic_puqpress': return 'Puqpress';
    default: return 'Flat tamper';
  }
}

/** Pull the numeric dial setting out of strings like "Fellow Ode Gen 2 #5.1 (Medium-Fine)". */
export function parseGrind(setting: string): { prefix: string; value: number; decimals: number; suffix: string } | null {
  // Prefer the number after '#' ("Gen 2 #5.1" -> 5.1); otherwise the first number in a plain setting.
  const hash = setting.lastIndexOf('#');
  const head = hash >= 0 ? setting.slice(0, hash + 1) : '';
  const m = (hash >= 0 ? setting.slice(hash + 1) : setting).match(/^(\D*?)(\d+(?:\.\d+)?)(?![.\d])(.*)$/);
  if (!m || (hash >= 0 && m[1].trim())) return null;
  const decimals = (m[2].split('.')[1] || '').length;
  return { prefix: head + m[1], value: parseFloat(m[2]), decimals, suffix: m[3] };
}

export function shiftGrind(setting: string, delta: number): string | null {
  const g = parseGrind(setting);
  if (!g) return null;
  const step = g.decimals ? 1 / 10 ** g.decimals : 1;
  const v = Math.max(0, g.value + delta * step);
  return `${g.prefix}${v.toFixed(g.decimals)}${g.suffix}`;
}

/** Short grind label for tight spaces: "#5.1". */
export function grindShort(setting: string): string {
  const g = parseGrind(setting);
  return g ? `#${g.value.toFixed(g.decimals)}` : setting;
}
