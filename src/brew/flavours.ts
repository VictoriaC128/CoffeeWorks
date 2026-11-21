import { Bean, BrewSession } from '../types/coffee';

/** The ten base notes, with the longer description shown on tap. */
export const BASE_NOTES: { name: string; about: string }[] = [
  { name: 'Dark chocolate', about: 'A classic base note in medium and medium-dark roasts, often prominent in South American beans.' },
  { name: 'Milk chocolate', about: 'Smooth, sweet chocolate and cocoa tones common in balanced blends and milk-friendly roasts.' },
  { name: 'Caramel', about: 'Sweet, toasted sugar notes frequently paired with nutty or chocolate profiles in medium-dark espresso.' },
  { name: 'Nutty', about: 'Rich, roasted nut flavours (hazelnut, almond, pistachio) that add warmth and pair well with milk drinks.' },
  { name: 'Citrus', about: 'Bright notes like orange, tangerine or marmalade, often found in lighter roasts or East African and washed coffees.' },
  { name: 'Stone fruit', about: 'Juicy, sweet fruit notes (plum, peach) typical of well-extracted medium and light-medium roasts.' },
  { name: 'Berry', about: 'Sweet or jammy berry and dried-fruit notes (raisin) that bring complexity to single-origin or natural-process espresso.' },
  { name: 'Brown sugar', about: 'Deep, syrupy brown sugar and molasses sweetness that enhances a heavy espresso body.' },
  { name: 'Malt', about: 'Grainy, malted sweetness often noticed in balanced classic blends.' },
  { name: 'Floral', about: 'Delicate, aromatic blossom notes that appear mainly in lighter specialty roasts.' },
];

export const aboutNote = (name: string) => BASE_NOTES.find((n) => n.name.toLowerCase() === name.toLowerCase())?.about;

const EAST_AFRICA = ['ethiopia', 'kenya', 'rwanda', 'burundi', 'uganda', 'tanzania', 'yemen'];
const LATIN = ['colombia', 'brazil', 'guatemala', 'honduras', 'peru', 'costa rica', 'el salvador', 'nicaragua', 'mexico', 'bolivia', 'ecuador', 'panama'];
const ASIA = ['indonesia', 'sumatra', 'java', 'sulawesi', 'vietnam', 'india', 'papua', 'myanmar', 'thailand', 'laos', 'china', 'philippines'];

/** Score the base notes against what the user recorded about the bean. */
function fromProfile(bean: Bean): string[] {
  const score = new Map<string, number>(BASE_NOTES.map((n) => [n.name, 0]));
  const add = (name: string, n: number) => score.set(name, (score.get(name) || 0) + n);
  const origin = `${bean.origin} ${bean.region ?? ''}`.toLowerCase();
  if (EAST_AFRICA.some((x) => origin.includes(x))) { add('Floral', 3); add('Citrus', 3); add('Stone fruit', 2); add('Berry', 2); }
  if (LATIN.some((x) => origin.includes(x))) { add('Milk chocolate', 2); add('Caramel', 2); add('Nutty', 2); }
  if (origin.includes('brazil')) { add('Nutty', 1); add('Dark chocolate', 2); }
  if (ASIA.some((x) => origin.includes(x))) { add('Dark chocolate', 3); add('Brown sugar', 2); add('Malt', 2); }

  switch (bean.roastLevel) {
    case 'light': case 'med_light': add('Floral', 2); add('Citrus', 2); add('Stone fruit', 1); break;
    case 'medium': add('Milk chocolate', 2); add('Caramel', 2); add('Stone fruit', 1); break;
    case 'med_dark': case 'dark': add('Dark chocolate', 3); add('Brown sugar', 2); add('Malt', 1); break;
    case 'nanyang_wok': add('Dark chocolate', 3); add('Brown sugar', 3); add('Malt', 2); add('Caramel', 1); break;
  }
  switch (bean.processMethod) {
    case 'washed': add('Citrus', 2); add('Floral', 1); break;
    case 'natural': case 'anaerobic_fermentation': case 'carbonic_maceration': case 'co_fermented': case 'thermal_shock':
      add('Berry', 3); add('Stone fruit', 1); break;
    case 'honey': add('Caramel', 2); add('Brown sugar', 1); add('Stone fruit', 1); break;
    case 'traditional_butter_sugar_roast': add('Caramel', 2); add('Brown sugar', 2); break;
  }
  const ranked = [...score.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  // Fill up to five from the base order when the profile says little
  for (const n of BASE_NOTES) if (ranked.length < 5 && !ranked.includes(n.name)) ranked.push(n.name);
  return ranked.slice(0, 5);
}

export interface FlavourSuggestions {
  notes: string[];
  /** Where the suggestions came from, for the caption */
  source: 'recorded' | 'profile' | 'base';
}

/**
 * Notes to offer on the taste screen:
 * 1. what the user (or the seller's bag) recorded for this bean, plus notes picked in past brews of it;
 * 2. otherwise the top 5 base notes that fit the bean's origin, roast and process;
 * 3. otherwise the ten base notes.
 */
export function suggestFlavours(bean: Bean | undefined, sessions: BrewSession[]): FlavourSuggestions {
  if (bean) {
    const past = new Map<string, number>();
    sessions
      .filter((s) => s.beanId === bean.id || s.beanName === bean.name)
      .forEach((s) => (s.flavourTags || []).forEach((t) => past.set(t, (past.get(t) || 0) + 1)));
    const pastRanked = [...past.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
    const recorded = Array.from(new Set([...(bean.tastingNotes || []).map((t) => t.trim()).filter(Boolean), ...pastRanked]));
    if (recorded.length) return { notes: recorded, source: 'recorded' };
    const hasProfile = !!(bean.origin || bean.region || bean.roastLevel || bean.processMethod);
    if (hasProfile) return { notes: fromProfile(bean), source: 'profile' };
  }
  return { notes: BASE_NOTES.map((n) => n.name), source: 'base' };
}
