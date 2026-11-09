import React, { useState } from 'react';
import { Coffee, Droplets, Sparkles, Plus, Timer, Check, Award } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { KopiCustomization } from '../types/coffee';

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

export const KopiCalculator: React.FC = () => {
  const { addRecipe, setSelectedRecipeForBrew } = useCoffee();

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">🇸🇬</span>
          <span className="bg-red-500/10 text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-500/20 uppercase tracking-wide">
            Singapore Heritage Coffee Engine
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Nanyang Kopi Dial-in & Formulation Matrix
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-3xl leading-relaxed">
          Traditional Singaporean Kopi is crafted from highland Robusta wok-roasted with Planta butter/margarine and sugar. Brewed through a long flannel cloth sock strainer (*kopi bag*), it yields a heavy, syrupy concentrate tailored through traditional dialect terminology.
        </p>
      </div>

      {/* Preset Buttons Grid */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-stone-200 mb-3 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Select Traditional Dialect Order:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {KOPI_PRESETS.map(preset => {
            const isSelected = selectedPreset.title === preset.title;
            return (
              <button
                key={preset.title}
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-950/50'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                }`}
              >
                <div className="font-bold text-sm">{preset.title}</div>
                <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                  {preset.transliteration}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customizer Sliders & Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-base font-bold text-white">{selectedPreset.title} Formulation</h3>
              <p className="text-xs text-stone-400 mt-0.5">{selectedPreset.description}</p>
            </div>
            {isIced && (
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 font-medium">
                ❄️ Served Iced (Peng)
              </span>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Coffee Grounds */}
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  <span>Coffee Powder (Nanyang Wok Roast):</span>
                </span>
                <span className="text-amber-400 font-bold">{coffeeGrams} g</span>
              </div>
              <input
                type="range"
                min="15"
                max="35"
                step="1"
                value={coffeeGrams}
                onChange={e => setCoffeeGrams(parseInt(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-stone-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Boiling Water */}
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Boiling Brew Water (100°C):</span>
                </span>
                <span className="text-cyan-400 font-bold">{waterMl} ml</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={waterMl}
                onChange={e => setWaterMl(parseInt(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-stone-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Condensed Milk */}
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>Condensed Milk (Sweetened Creamer):</span>
                <span className="text-amber-300 font-bold">
                  {condensedMilk} g (~{(condensedMilk / 15).toFixed(1)} tbsp)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={condensedMilk}
                onChange={e => setCondensedMilk(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-stone-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Evaporated Milk */}
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>Evaporated Milk (Carnation / Creamy):</span>
                <span className="text-purple-300 font-bold">
                  {evaporatedMilk} g (~{(evaporatedMilk / 15).toFixed(1)} tbsp)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={evaporatedMilk}
                onChange={e => setEvaporatedMilk(parseInt(e.target.value))}
                className="w-full accent-purple-400 h-2 bg-stone-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Granulated Sugar */}
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-300 mb-1">
                <span>Sugar:</span>
                <span className="text-rose-300 font-bold">
                  {sugar} g (~{(sugar / 4).toFixed(1)} tsp)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={sugar}
                onChange={e => setSugar(parseInt(e.target.value))}
                className="w-full accent-rose-400 h-2 bg-stone-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveAsCustomRecipe}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/50 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Recipe Vault!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save as Custom Kopi Recipe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Authentic Barista Step-by-Step Sock Brew Protocol */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Traditional Sock Pull Protocol</span>
          </h4>

          <ol className="space-y-3 text-xs text-stone-300">
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white block font-semibold">Pre-warm the Ceramic Cup:</strong>
                Swirl boiling water inside the thick floral porcelain cup to preserve beverage temperature and emulsify milk.
              </div>
            </li>

            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white block font-semibold">Load the Flannel Sock:</strong>
                Add {coffeeGrams}g of coarse wok-roast grounds into the traditional cloth sock strainer.
              </div>
            </li>

            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-white block font-semibold">Pour & Agitate (The Pull):</strong>
                Pour {waterMl}ml boiling water through. Lift and dip the sock 4 to 5 times to aerate and extract deep caramelized malt body.
              </div>
            </li>

            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-white block font-semibold">Pour From Height:</strong>
                Place condensed/evaporated milk at the bottom of cup, pour the hot coffee essence from a 30cm height to froth the surface, then stir.
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
