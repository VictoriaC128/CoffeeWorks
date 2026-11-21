// Display formatting. Recipes and sessions always store grams, °C, ppm and
// seconds; only what is shown changes, so switching units never rounds data.
import { Units } from './SettingsContext';

export interface Reading { value: string; unit: string }
const r = (value: string, unit: string): Reading => ({ value, unit });
const fixed = (n: number, d: number) => (Number.isFinite(n) ? n.toFixed(d) : '–');
const join = (x: Reading) => (x.unit ? `${x.value} ${x.unit}` : x.value);

export const G_PER_OZ = 28.3495;
export const ML_PER_FLOZ = 29.5735;

export function coffee(grams: number, u: Units, digits = 1): Reading {
  return u.coffee === 'oz' ? r(fixed(grams / G_PER_OZ, 2), 'oz') : r(fixed(grams, digits), 'g');
}
export function water(grams: number, u: Units): Reading {
  if (u.water === 'oz') return r(fixed(grams / ML_PER_FLOZ, 1), 'fl oz');
  return r(fixed(grams, 0), u.water);
}
/** Weight shown on the scale: espresso yields use the coffee unit, kettle water the water unit. */
export function scale(grams: number, u: Units, isWater: boolean): Reading {
  return isWater ? water(grams, u) : coffee(grams, u, grams >= 100 ? 0 : 1);
}
export function temp(c: number, u: Units): Reading {
  return u.temp === 'f' ? r(fixed(c * 9 / 5 + 32, 0), '°F') : r(fixed(c, 0), '°C');
}
export function hardness(ppm: number, u: Units): Reading {
  if (u.hardness === 'dh') return r(fixed(ppm / 17.848, 1), '°dH');
  if (u.hardness === 'gpg') return r(fixed(ppm / 17.118, 1), 'gpg');
  return r(fixed(ppm, 0), 'ppm');
}
export function flow(gs: number, u: Units): Reading {
  return r(fixed(gs, 1), u.flow === 'mls' ? 'ml/s' : 'g/s');
}
export function grind(setting: string, microns: number | undefined, u: Units): string {
  if (u.grind === 'um' && microns) return `≈ ${microns} µm`;
  return setting;
}
export function clock(totalSeconds: number, u?: Units): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (u?.time === 's') return `${s} s`;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
/** Countdown that never shows a negative; ceil so 0:01 stays until the step ends. */
export function countdown(secondsLeft: number, u?: Units): string {
  return clock(Math.max(0, Math.ceil(secondsLeft - 1e-6)), u);
}
export const text = join;
