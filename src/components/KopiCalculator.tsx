import React, { useState } from 'react';
import { Coffee, Droplets, Plus, Check, Snowflake } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { MODES } from '../brew/modes';
import { Btn, Caps, Stepper } from '../brew/ui';
import { InfoTip } from '../brew/InfoTip';

interface PresetOption {
  title: string;
  transliteration: string;
  description: string;
  condensedMilk: number;
  evaporatedMilk: number;
  sugar: number;
  waterMl: number;
  coffeeGrams: number;
  isIced?: boolean;
}

const KOPI_PRESETS: PresetOption[] = [
  {
    title: 'Kopi',
    transliteration: 'Coffee with condensed milk',
    description: 'The national classic. Sweet, creamy, velvety mouthfeel with dark chocolate notes.',
    condensedMilk: 25,
    evaporatedMilk: 10,
    sugar: 0,
    waterMl: 180,
    coffeeGrams: 22,
  },
  {
    title: 'Kopi-O',
    transliteration: 'Black coffee with sugar',
    description: 'Aromatic, bold, bittersweet caramel kick without milk.',
    condensedMilk: 0,
    evaporatedMilk: 0,
    sugar: 12,
    waterMl: 200,
    coffeeGrams: 22,
  },
  {
    title: 'Kopi-O Kosong',
    transliteration: 'Pure black coffee, zero sugar',
    description: 'The purest robusta essence. Dark roasted malt, smoky butter, and zero sweetness.',
    condensedMilk: 0,
    evaporatedMilk: 0,
    sugar: 0,
    waterMl: 200,
    coffeeGrams: 22,
  },
  {
    title: 'Kopi-C',
    transliteration: 'Coffee with evaporated milk & sugar',
    description: 'Smoother and lighter than condensed milk. Creamy and nutty balance.',
    condensedMilk: 0,
    evaporatedMilk: 30,
    sugar: 10,
    waterMl: 180,
    coffeeGrams: 22,
  },
  {
    title: 'Kopi-C Kosong',
    transliteration: 'Coffee with evaporated milk, no sugar',
    description: 'Creamy and unsweetened. Accentuates the toasted butter wok aroma.',
    condensedMilk: 0,
    evaporatedMilk: 35,
    sugar: 0,
    waterMl: 180,
    coffeeGrams: 22,
  },
  {
    title: 'Kopi Gao',
    transliteration: 'Extra thick & concentrated coffee',
    description: 'Heavy body with higher coffee-to-water ratio. Maximum caffeine kick.',
    condensedMilk: 30,
    evaporatedMilk: 15,
    sugar: 0,
    waterMl: 140,
    coffeeGrams: 28,
  },
  {
    title: 'Kopi Di-Lo',
    transliteration: 'Pure undiluted coffee essence',
    description: 'Zero hot water bypass added. Only the pure extraction dripping straight from the sock.',
    condensedMilk: 25,
    evaporatedMilk: 10,
    sugar: 0,
    waterMl: 110,
    coffeeGrams: 28,
  },
  {
    title: 'Kopi Peng',
    transliteration: 'Iced Singaporean Kopi',
    description: 'Double strength hot extraction poured over a full glass of crushed ice.',
    condensedMilk: 35,
    evaporatedMilk: 15,
    sugar: 0,
    waterMl: 140,
    coffeeGrams: 26,
    isIced: true,
  },
];

const DIALECT: [string, string][] = [
  ['O', 'No milk (black)'],
  ['C', 'Evaporated milk'],
  ['Kosong', 'No sugar'],
  ['Gao', 'Thick, extra strong'],
  ['Po', 'Thin, lighter'],
  ['Di-lo', 'Undiluted, no added water'],
  ['Peng', 'Iced'],
];

const KOPI = MODES.singaporean_kopi;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const KopiCalculator: React.FC = () => {
  const { addRecipe, setSelectedRecipeForBrew } = useCoffee();
  const { settings } = useSettings();
  const u = settings.units;

  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(KOPI_PRESETS[0]);
  const [coffeeGrams, setCoffeeGrams] = useState<number>(selectedPreset.coffeeGrams);
  const [waterMl, setWaterMl] = useState<number>(selectedPreset.waterMl);
  const [condensedMilk, setCondensedMilk] = useState<number>(selectedPreset.condensedMilk);
  const [evaporatedMilk, setEvaporatedMilk] = useState<number>(selectedPreset.evaporatedMilk);
  const [sugar, setSugar] = useState<number>(selectedPreset.sugar);
  const [isIced, setIsIced] = useState<boolean>(selectedPreset.isIced || false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const applyPreset = (preset: PresetOption) => {
    setSelectedPreset(preset);
    setCoffeeGrams(preset.coffeeGrams);
    setWaterMl(preset.waterMl);
    setCondensedMilk(preset.condensedMilk);
    setEvaporatedMilk(preset.evaporatedMilk);
    setSugar(preset.sugar);
    setIsIced(preset.isIced || false);
  };

  const handleSaveAsCustomRecipe = () => {
    const newRecipe = addRecipe({
      title: `Custom ${selectedPreset.title} formulation`,
      category: 'singaporean_kopi',
      doseGrams: coffeeGrams,
      yieldGrams: waterMl * 0.85,
      ratio: Number(((waterMl * 0.85) / coffeeGrams).toFixed(2)),
      waterTempC: 100,
      grindSetting: 'Coarse Sand Nanyang Grind',
      grindMicrons: 1100,
      targetTotalTimeSeconds: 180,
      targetFlowRateGs: 0.95,
      kopiSpecs: {
        style: 'kopi',
        strength: coffeeGrams >= 26 ? 'gao' : 'standard',
        isIced,
        condensedMilkGrams: condensedMilk,
        evaporatedMilkGrams: evaporatedMilk,
        sugarGrams: sugar,
        hotWaterMl: waterMl,
        coffeeEssenceMl: waterMl * 0.75,
      },
      notes: `Custom Singaporean formulation: ${condensedMilk}g condensed milk, ${evaporatedMilk}g evaporated milk, ${sugar}g sugar. Steeped through cloth sock strainer.`,
      tags: ['Singapore Heritage', 'Nanyang Kopi', 'Sock Filter', selectedPreset.title],
    });
    setSelectedRecipeForBrew(newRecipe);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const powder = F.coffee(coffeeGrams, u, 0);
  const water = F.water(waterMl, u);
  const boil = F.text(F.temp(100, u));
  const ratio = waterMl / (coffeeGrams || 1);

  const dial = (key: string, label: React.ReactNode, value: string, unit: string, sub: React.ReactNode, onMinus: () => void, onPlus: () => void) => (
    <div key={key} className="px-4 sm:px-5 py-3 border-r border-b border-rule min-w-0 flex flex-col">
      <Caps className="flex items-center gap-1.5">{label}</Caps>
      <div className="num font-extrabold leading-none mt-2 mb-1 whitespace-nowrap text-[44px] sm:text-[48px]">
        {value}<span className="text-[18px] font-semibold text-mute ml-1 tracking-normal" style={{ fontStretch: '100%' }}>{unit}</span>
      </div>
      <div className="text-[13px] text-mute leading-snug min-h-[34px]">{sub}</div>
      <div className="mt-2"><Stepper label={typeof label === 'string' ? label : key} onMinus={onMinus} onPlus={onPlus} /></div>
    </div>
  );

  const steps: [string, React.ReactNode][] = [
    ['Pre-warm the cup', 'Swirl boiling water inside the thick porcelain cup to hold the temperature and help the milk emulsify.'],
    ['Load the flannel sock', <>Add <b className="num text-ink">{F.text(powder)}</b> of coarse wok-roast grounds to the cloth sock strainer.</>],
    ['Pour and pull', <>Pour <b className="num text-ink">{F.text(water)}</b> of boiling water through. Lift and dip the sock 4 to 5 times to aerate and pull out the caramelised malt body.</>],
    ['Pour from height', 'Put the condensed or evaporated milk in the bottom of the cup, pour the hot essence from about 30 cm to froth the top, then stir.'],
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Label band in the kopi colour */}
      <header className={`${KOPI.bg} ${KOPI.on} px-5 sm:px-7 py-4 grid gap-4 lg:grid-cols-[1fr_330px] lg:items-end`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-6 h-6 shrink-0" aria-hidden />
            <h1 className="font-black text-[26px] sm:text-[29px] leading-tight tracking-[-0.02em]" style={{ fontStretch: '106%' }}>Kopi · {selectedPreset.title}</h1>
          </div>
          <p className="text-[13px] opacity-85 mt-1">{selectedPreset.transliteration}</p>
        </div>
        <dl className="grid grid-cols-[72px_1fr] text-[12.5px] border-t rule-on">
          <dt className="uppercase text-[10.5px] tracking-[0.1em] opacity-80 pt-1.5 pb-1 border-b rule-on">Sock</dt>
          <dd className="font-semibold py-1 border-b rule-on num">{F.text(powder)} · {F.text(water)} · {boil}</dd>
          <dt className="uppercase text-[10.5px] tracking-[0.1em] opacity-80 pt-1.5 pb-1 border-b rule-on">Cup</dt>
          <dd className="font-semibold py-1 border-b rule-on num">Condensed {condensedMilk} g · evap {evaporatedMilk} g · sugar {sugar} g</dd>
          <dt className="uppercase text-[10.5px] tracking-[0.1em] opacity-80 pt-1.5 pb-1 border-b rule-on">Order</dt>
          <dd className="font-semibold py-1 border-b rule-on">{selectedPreset.title} · {isIced ? 'iced' : 'hot'}</dd>
        </dl>
      </header>

      <div className="px-5 sm:px-7 py-2.5 text-[14px] leading-snug border-b border-rule">
        <p className="text-mute">Wok-roasted Robusta, pulled through a cloth sock and ordered in dialect.</p>
        <InfoTip title="Ordering kopi" label="What do O, C, Kosong, Gao, Po, Di-lo, Peng mean?" className="text-[14px] font-semibold">
          <p>
            Traditional Singapore kopi is highland Robusta wok-roasted with butter or margarine and sugar, brewed through
            a long flannel sock strainer into a heavy, syrupy concentrate. You order it in dialect:
          </p>
          <dl className="mt-2 grid grid-cols-[64px_1fr] gap-x-3 gap-y-1">
            {DIALECT.map(([term, meaning]) => (
              <React.Fragment key={term}>
                <dt className="font-bold">{term}</dt>
                <dd>{meaning}</dd>
              </React.Fragment>
            ))}
          </dl>
        </InfoTip>
      </div>

      {/* Dialect order picker */}
      <section className="pt-4">
        <Caps className="px-5 sm:px-7 mb-2">Order</Caps>
        <div role="radiogroup" aria-label="Kopi order" className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-ink">
          {KOPI_PRESETS.map((preset) => {
            const on = selectedPreset.title === preset.title;
            return (
              <button
                key={preset.title}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => applyPreset(preset)}
                className={`min-h-[64px] px-3.5 py-2.5 text-left border-r border-b border-ink min-w-0 ${on ? `${KOPI.bg} ${KOPI.on}` : 'hover:bg-tint'}`}
              >
                <div className="font-bold text-[15px] leading-tight">{preset.title}</div>
                <div className={`text-[12px] leading-snug mt-0.5 line-clamp-2 ${on ? 'opacity-85' : 'text-mute'}`}>{preset.transliteration}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] border-b border-ink">
        {/* Formulation */}
        <section className="min-w-0">
          <div className="px-5 sm:px-7 pt-4 pb-3 flex flex-wrap items-start justify-between gap-3 border-b border-ink">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-extrabold">{selectedPreset.title} formulation</h2>
                <InfoTip title={selectedPreset.title}>
                  <p className="font-semibold">{selectedPreset.transliteration}</p>
                  <p className="mt-1">{selectedPreset.description}</p>
                </InfoTip>
              </div>
            </div>
            {isIced && (
              <span className="inline-flex items-center gap-1.5 border border-ink px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.08em]">
                <Snowflake className="w-3.5 h-3.5" aria-hidden />
                Served iced (Peng)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3">
            {dial('coffee', <><Coffee className="w-3.5 h-3.5" aria-hidden />Coffee powder</>, powder.value, powder.unit,
              <>Nanyang wok roast · ratio <b className="text-ink num">1:{ratio.toFixed(1)}</b></>,
              () => setCoffeeGrams((g) => clamp(g - 1, 15, 35)), () => setCoffeeGrams((g) => clamp(g + 1, 15, 35)))}
            {dial('water', <><Droplets className="w-3.5 h-3.5" aria-hidden />Boiling water</>, water.value, water.unit,
              <>At {boil} through the sock</>,
              () => setWaterMl((w) => clamp(w - 10, 100, 300)), () => setWaterMl((w) => clamp(w + 10, 100, 300)))}
            {dial('condensed', 'Condensed milk', String(condensedMilk), 'g',
              <>About <span className="num">{(condensedMilk / 15).toFixed(1)}</span> tbsp · sweetened</>,
              () => setCondensedMilk((g) => clamp(g - 5, 0, 50)), () => setCondensedMilk((g) => clamp(g + 5, 0, 50)))}
            {dial('evaporated', 'Evaporated milk', String(evaporatedMilk), 'g',
              <>About <span className="num">{(evaporatedMilk / 15).toFixed(1)}</span> tbsp · creamy, unsweetened</>,
              () => setEvaporatedMilk((g) => clamp(g - 5, 0, 50)), () => setEvaporatedMilk((g) => clamp(g + 5, 0, 50)))}
            {dial('sugar', 'Sugar', String(sugar), 'g',
              <>About <span className="num">{(sugar / 4).toFixed(1)}</span> tsp</>,
              () => setSugar((g) => clamp(g - 1, 0, 25)), () => setSugar((g) => clamp(g + 1, 0, 25)))}
          </div>

          <div className="px-5 sm:px-7 py-3 flex flex-wrap items-center gap-3">
            <Btn variant="primary" onClick={handleSaveAsCustomRecipe} className="w-full sm:w-auto px-8">
              {savedSuccess ? <><Check className="w-5 h-5" aria-hidden />Added to Recipes</> : <><Plus className="w-5 h-5" aria-hidden />Save as kopi recipe</>}
            </Btn>
            <span className="text-[12.5px] text-mute" aria-live="polite">
              {savedSuccess ? 'Saved and loaded on the brew screen.' : 'Saves to Recipes and loads it on the brew screen.'}
            </span>
          </div>
        </section>

        {/* Sock pull protocol */}
        <aside className="border-t lg:border-t-0 lg:border-l border-ink px-5 py-4">
          <h2 className="text-[17px] font-extrabold border-b border-ink pb-1.5">Sock pull, step by step</h2>
          <ol>
            {steps.map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[32px_1fr] gap-2 py-3 border-b border-rule">
                <span className="text-[13px] font-extrabold num pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="text-[15px] font-bold">{title}</div>
                  <p className="text-[13.5px] text-mute leading-snug mt-0.5">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
};
