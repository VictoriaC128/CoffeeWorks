import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  Timer,
  Flame,
  Snowflake,
  Layers,
  Thermometer,
  LucideIcon,
} from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeDrinkRecipe, DrinkFamily, CoffeeCategory } from '../types/coffee';
import { SmartDropdownWithOthers, DropdownOption } from './SmartDropdownWithOthers';
import { Btn, Caps, Segmented, Sheet } from '../brew/ui';
import { InfoTip } from '../brew/InfoTip';
import { MODES } from '../brew/modes';
import { useSettings } from '../settings/SettingsContext';
import { useLayout } from '../shell/LayoutContext';
import * as F from '../settings/format';

const FAMILY_TABS: { id: DrinkFamily | 'all'; label: string }[] = [
  { id: 'all', label: 'All drinks' },
  { id: 'espresso_black', label: 'Espresso black' },
  { id: 'espresso_milk', label: 'Milk & microfoam' },
  { id: 'iced_cold', label: 'Iced & chilled' },
  { id: 'traditional_heritage', label: 'Traditional heritage' },
  { id: 'specialty_fusion', label: 'Specialty fusion' },
];

const SERVING_TEMP: Record<CoffeeDrinkRecipe['servingTemp'], { label: string; Icon: LucideIcon }> = {
  hot: { label: 'Hot', Icon: Flame },
  iced: { label: 'Iced / chilled', Icon: Snowflake },
  chilled_layered: { label: 'Thermal layered', Icon: Layers },
  room_temp: { label: 'Room temp', Icon: Thermometer },
};

const BREW_TYPES: { value: CoffeeCategory; label: string }[] = [
  { value: 'espresso', label: 'Espresso' },
  { value: 'filter', label: 'Filter / drip' },
  { value: 'immersion', label: 'Immersion / cold brew' },
  { value: 'singaporean_kopi', label: 'Kopi sock' },
  { value: 'moka_stovetop', label: 'Moka pot' },
];

const CUP_PRESETS_ML = [120, 180, 240, 360, 480];

// Cup build-up swatches: the coffee base takes its brew-mode colour; the rest are ink tints.
const WATER_SWATCH = 'bg-ink/30';
const MILK_SWATCH = 'bg-ink/10';
const ICE_SWATCH = 'bg-paper';

const FIELD = 'w-full h-12 border border-ink bg-paper px-3 text-[16px]';
const NUM_FIELD = `${FIELD} num font-bold text-[18px]`;
const AREA = 'w-full border border-ink bg-paper p-3 text-[15px] leading-snug';

const modeFor = (c: CoffeeCategory) => MODES[c] ?? MODES.espresso;

const MILK_OPTIONS: DropdownOption[] = [
  { label: 'Whole Milk (Steamed Microfoam 60-65°C)', value: 'microfoam', group: 'Dairy Steamed' },
  { label: 'Whole Milk (Standard Steamed 65°C)', value: 'whole_steamed', group: 'Dairy Steamed' },
  { label: 'Cold Whole Milk (Chilled 4°C)', value: 'cold_whole', group: 'Cold Dairy' },
  { label: 'Heavy Whipping Cream (Chilled 35-40% fat)', value: 'heavy_cream', group: 'Rich Creams' },
  { label: 'Sweetened Condensed Milk (Thick Caramel Sweet)', value: 'condensed_milk', group: 'Heritage & Sweet' },
  { label: 'Evaporated Milk (Carnation / Unsweetened Rich)', value: 'evaporated_milk', group: 'Heritage & Sweet' },
  { label: 'Oat Milk Barista Edition (Steamed 58-60°C)', value: 'oat_steamed', group: 'Plant-Based' },
  { label: 'Cold Frothed Milk Foam (Afrogala / Sweet Cold Foam)', value: 'frothed_cold_foam', group: 'Cold Foams' },
  { label: 'None (Black Coffee / Zero Dairy)', value: 'none', group: 'Zero Dairy' },
];

const WATER_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Hot Filtered Water (90°C – 94°C)', value: 'hot_water', group: 'Hot Water' },
  { label: 'Cold Filtered Water (Chilled 4°C)', value: 'cold_water', group: 'Cold Water' },
  { label: 'Premium Tonic Water (Fever-Tree / Thomas Henry)', value: 'tonic_water', group: 'Effervescent & Botanical' },
  { label: 'Sparkling Mineral Water (San Pellegrino / Soda)', value: 'soda_water', group: 'Effervescent & Botanical' },
  { label: 'None (Pure Extraction / Zero Bypass)', value: 'none', group: 'None' },
];

const ICE_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'Dense Solid Ice Cubes (Standard ~25g each)', value: 'cubes', group: 'Ice Formats' },
  { label: 'Crushed Ice / Shaved Ice (Kopitiam & Phin style)', value: 'crushed', group: 'Ice Formats' },
  { label: 'Flash Brew Bed (Melting in Carafe)', value: 'flash_brew_bed', group: 'Flash Brew' },
  { label: 'Clear Hand-Carved Ice Sphere', value: 'large_clear_sphere', group: 'Artisan Bar' },
  { label: 'None (Hot or Purely Chilled Liquid)', value: 'none', group: 'Zero Ice' },
];

interface Props {
  onLaunchBrew?: (recipeCategory: CoffeeCategory, dose: number, yieldGrams: number, title: string) => void;
}

export const DrinkLab: React.FC<Props> = ({ onLaunchBrew }) => {
  const {
    coffeeDrinks,
    addCoffeeDrink,
    updateCoffeeDrink,
    deleteCoffeeDrink,
    duplicateCoffeeDrink,
    setSelectedRecipeForBrew,
    recipes,
  } = useCoffee();

  // Search and Filter states
  const [selectedFamily, setSelectedFamily] = useState<DrinkFamily | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedDrinkId, setExpandedDrinkId] = useState<string | null>(null);

  // Cup Size / Serving Scaler per drink (map of drinkId -> multiplier)
  const [scaleMap, setScaleMap] = useState<Record<string, number>>({});

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDrink, setEditingDrink] = useState<CoffeeDrinkRecipe | null>(null);

  // Modal Form States
  const [formName, setFormName] = useState('');
  const [formAltName, setFormAltName] = useState('');
  const [formFamily, setFormFamily] = useState<DrinkFamily>('espresso_milk');
  const [formDescription, setFormDescription] = useState('');
  const [formDefaultServingMl, setFormDefaultServingMl] = useState<number>(200);
  const [formDefaultCupOz, setFormDefaultCupOz] = useState<number>(7);
  const [formGlassware, setFormGlassware] = useState('220ml Ceramic Tulip Cup');
  const [formServingTemp, setFormServingTemp] = useState<'hot' | 'iced' | 'chilled_layered' | 'room_temp'>('hot');

  // Coffee Base Form
  const [formCoffeeName, setFormCoffeeName] = useState('Double Espresso');
  const [formCoffeeDose, setFormCoffeeDose] = useState<number>(18.0);
  const [formCoffeeYield, setFormCoffeeYield] = useState<number>(36.0);
  const [formCoffeeBrewType, setFormCoffeeBrewType] = useState<CoffeeCategory>('espresso');

  // Water Form
  const [formWaterMl, setFormWaterMl] = useState<number>(0);
  const [formWaterType, setFormWaterType] = useState<string>('none');
  const [formWaterDesc, setFormWaterDesc] = useState('');

  // Milk Form
  const [formMilkMl, setFormMilkMl] = useState<number>(120);
  const [formMilkType, setFormMilkType] = useState<string>('microfoam');
  const [formFoamMm, setFormFoamMm] = useState<number>(3);
  const [formSteamTemp, setFormSteamTemp] = useState<number>(62);
  const [formMilkDesc, setFormMilkDesc] = useState('');

  // Ice Form
  const [formIceGrams, setFormIceGrams] = useState<number>(0);
  const [formIceCubes, setFormIceCubes] = useState<number>(0);
  const [formIceType, setFormIceType] = useState<string>('none');
  const [formIceDesc, setFormIceDesc] = useState('');

  // Steps & Tips Form
  const [formSteps, setFormSteps] = useState('');
  const [formTips, setFormTips] = useState('');
  const [formTags, setFormTags] = useState('');

  // Filtered Drinks
  const filteredDrinks = useMemo(() => {
    return coffeeDrinks.filter(drink => {
      const matchesFamily = selectedFamily === 'all' || drink.family === selectedFamily;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        drink.name.toLowerCase().includes(q) ||
        (drink.italianOrAltName && drink.italianOrAltName.toLowerCase().includes(q)) ||
        drink.description.toLowerCase().includes(q) ||
        drink.glassware.toLowerCase().includes(q) ||
        drink.tags.some(t => t.toLowerCase().includes(q)) ||
        (drink.milk.type && drink.milk.type.toLowerCase().includes(q)) ||
        (drink.water.type && drink.water.type.toLowerCase().includes(q));

      return matchesFamily && matchesSearch;
    });
  }, [coffeeDrinks, selectedFamily, searchQuery]);

  // Handle drink scale change
  const handleSetScale = (drinkId: string, scale: number) => {
    setScaleMap(prev => ({ ...prev, [drinkId]: Math.max(0.2, Math.min(4.0, scale)) }));
  };

  const handleOpenAdd = () => {
    setEditingDrink(null);
    setFormName('');
    setFormAltName('');
    setFormFamily('espresso_milk');
    setFormDescription('');
    setFormDefaultServingMl(200);
    setFormDefaultCupOz(7);
    setFormGlassware('220ml Ceramic Tulip Cup');
    setFormServingTemp('hot');

    setFormCoffeeName('Double Espresso');
    setFormCoffeeDose(18.0);
    setFormCoffeeYield(36.0);
    setFormCoffeeBrewType('espresso');

    setFormWaterMl(0);
    setFormWaterType('none');
    setFormWaterDesc('');

    setFormMilkMl(120);
    setFormMilkType('microfoam');
    setFormFoamMm(3);
    setFormSteamTemp(62);
    setFormMilkDesc('');

    setFormIceGrams(0);
    setFormIceCubes(0);
    setFormIceType('none');
    setFormIceDesc('');

    setFormSteps('Pull espresso shot.\nSteam milk to microfoam.\nPour and serve.');
    setFormTips('Pour milk with pitcher close to cup surface for delicate art.');
    setFormTags('Custom, Espresso, Milk');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (drink: CoffeeDrinkRecipe) => {
    setEditingDrink(drink);
    setFormName(drink.name);
    setFormAltName(drink.italianOrAltName || '');
    setFormFamily(drink.family);
    setFormDescription(drink.description);
    setFormDefaultServingMl(drink.defaultServingMl);
    setFormDefaultCupOz(drink.defaultCupOz);
    setFormGlassware(drink.glassware);
    setFormServingTemp(drink.servingTemp);

    setFormCoffeeName(drink.coffeeBase.name);
    setFormCoffeeDose(drink.coffeeBase.doseGrams);
    setFormCoffeeYield(drink.coffeeBase.yieldGrams);
    setFormCoffeeBrewType(drink.coffeeBase.brewType);

    setFormWaterMl(drink.water.amountMl);
    setFormWaterType(drink.water.type || 'none');
    setFormWaterDesc(drink.water.description || '');

    setFormMilkMl(drink.milk.amountMl);
    setFormMilkType(drink.milk.type || 'none');
    setFormFoamMm(drink.milk.foamThicknessMm || 0);
    setFormSteamTemp(drink.milk.steamingTempC || 60);
    setFormMilkDesc(drink.milk.description || '');

    setFormIceGrams(drink.ice.amountGrams);
    setFormIceCubes(drink.ice.cubesCount || 0);
    setFormIceType(drink.ice.type || 'none');
    setFormIceDesc(drink.ice.description || '');

    setFormSteps(drink.assemblySteps.join('\n'));
    setFormTips(drink.baristaTips);
    setFormTags(drink.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const stepsArray = formSteps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const drinkData: Omit<CoffeeDrinkRecipe, 'id'> = {
      name: formName,
      italianOrAltName: formAltName || undefined,
      family: formFamily,
      description: formDescription,
      defaultServingMl: formDefaultServingMl,
      defaultCupOz: formDefaultCupOz,
      glassware: formGlassware,
      servingTemp: formServingTemp,
      coffeeBase: {
        name: formCoffeeName,
        doseGrams: formCoffeeDose,
        yieldGrams: formCoffeeYield,
        ratio: Number((formCoffeeYield / (formCoffeeDose || 1)).toFixed(2)),
        brewType: formCoffeeBrewType,
      },
      water: {
        amountMl: formWaterMl,
        type: formWaterType,
        description: formWaterDesc || undefined,
      },
      milk: {
        amountMl: formMilkMl,
        type: formMilkType,
        foamThicknessMm: formFoamMm || undefined,
        steamingTempC: formSteamTemp || undefined,
        description: formMilkDesc || undefined,
      },
      ice: {
        amountGrams: formIceGrams,
        cubesCount: formIceCubes || undefined,
        type: formIceType as any,
        description: formIceDesc || undefined,
      },
      assemblySteps: stepsArray.length > 0 ? stepsArray : ['Prepare ingredients and serve.'],
      baristaTips: formTips,
      tags: tagsArray,
    };

    if (editingDrink) {
      updateCoffeeDrink(editingDrink.id, drinkData);
    } else {
      addCoffeeDrink(drinkData);
    }

    setIsModalOpen(false);
  };

  const handleLaunchBrewForDrink = (drink: CoffeeDrinkRecipe, scale: number) => {
    const scaledYield = Math.round(drink.coffeeBase.yieldGrams * scale);
    const scaledDose = Math.round(drink.coffeeBase.doseGrams * scale * 10) / 10;

    // Match with existing recipe or pass callback
    const match = recipes.find(r => r.category === drink.coffeeBase.brewType);
    if (match) {
      setSelectedRecipeForBrew({
        ...match,
        title: `${drink.name} Base (${scaledYield}g yield)`,
        doseGrams: scaledDose,
        yieldGrams: scaledYield,
      });
    }

    if (onLaunchBrew) {
      onLaunchBrew(drink.coffeeBase.brewType, scaledDose, scaledYield, drink.name);
    }
  };

  const { settings } = useSettings();
  const u = settings.units;
  const { mode: layoutMode } = useLayout();
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const stats: [string, number][] = [
    ['Drinks', coffeeDrinks.length],
    ['With milk', coffeeDrinks.filter(d => d.milk.amountMl > 0).length],
    ['Iced', coffeeDrinks.filter(d => d.ice.amountGrams > 0 || d.servingTemp === 'iced').length],
    ['Heritage', coffeeDrinks.filter(d => d.family === 'traditional_heritage').length],
  ];

  const formSection = (title: string, swatch: string, children: React.ReactNode) => (
    <section className="mt-6">
      <h3 className="flex items-center gap-2 border-b border-ink pb-1.5 text-[16px] font-extrabold">
        <span className={`w-3.5 h-3.5 border border-ink ${swatch}`} aria-hidden />
        {title}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3">{children}</div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 text-ink">
      {/* Header band */}
      <header className="bg-ink text-paper px-5 sm:px-7 py-4 flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-black tracking-[-0.02em] leading-tight">Coffee drinks</h1>
          <p className="text-[13.5px] opacity-80 mt-1 max-w-2xl leading-snug flex items-center gap-2">
            Exact amounts for every drink.
            <InfoTip title="How drink recipes work" className="!text-paper hover:!text-paper">
              Each drink lists the exact coffee, water, milk and ice that go into the cup. Pick a cup size and every
              amount recalculates, and the cup build-up bar shows how much of the drink each part makes up.
            </InfoTip>
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[48px] px-4 bg-paper text-ink border border-paper text-[15px] font-bold inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Add drink
        </button>
      </header>

      {/* Catalogue totals */}
      <section className="grid grid-cols-4 border-b border-ink" aria-label="Catalogue totals">
        {stats.map(([k, v], i) => (
          <div key={k} className={`px-3 sm:px-5 py-2.5 min-w-0 ${i < 3 ? 'border-r border-rule' : ''}`}>
            <Caps className="!text-[10.5px] truncate">{k}</Caps>
            <div className="text-[26px] font-bold num leading-tight">{v}</div>
          </div>
        ))}
      </section>

      {/* Filters and search */}
      <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1 lg:pb-0 flex-1" role="radiogroup" aria-label="Drink family">
          {FAMILY_TABS.map(tab => {
            const on = selectedFamily === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setSelectedFamily(tab.id)}
                className={`min-h-[44px] px-3.5 text-[14px] font-semibold whitespace-nowrap border ${
                  on ? 'bg-ink text-paper border-ink' : 'border-rule hover:border-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="w-5 h-5 text-mute absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="Search drinks, milk, ice, water"
            aria-label="Search drinks"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 border border-ink bg-paper pl-10 pr-12 text-[16px] placeholder:text-mute"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-mute"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Drink list */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-x-8">
        {filteredDrinks.length === 0 && (
          <p className="border-t-2 border-ink py-6 text-[15px] text-mute lg:col-span-2">No drinks match this filter.</p>
        )}
        {filteredDrinks.map(drink => {
          const scale = scaleMap[drink.id] ?? 1.0;
          const mode = modeFor(drink.coffeeBase.brewType);

          // Scaled Calculations
          const scaledCoffeeYield = Math.round(drink.coffeeBase.yieldGrams * scale);
          const scaledCoffeeDose = Math.round(drink.coffeeBase.doseGrams * scale * 10) / 10;
          const scaledWater = Math.round(drink.water.amountMl * scale);
          const scaledMilk = Math.round(drink.milk.amountMl * scale);
          const scaledIce = Math.round(drink.ice.amountGrams * scale);
          const scaledServing = Math.round(drink.defaultServingMl * scale);
          const scaledOz = Number((drink.defaultCupOz * scale).toFixed(1));

          // Calculate proportional percentages for the visual stack
          const totalVolume =
            (scaledCoffeeYield || 0) + (scaledWater || 0) + (scaledMilk || 0) + (scaledIce || 0) || 1;
          const coffeePct = Math.round(((scaledCoffeeYield || 0) / totalVolume) * 100);
          const waterPct = Math.round(((scaledWater || 0) / totalVolume) * 100);
          const milkPct = Math.round(((scaledMilk || 0) / totalVolume) * 100);
          const icePct = Math.round(((scaledIce || 0) / totalVolume) * 100);

          const isExpanded = expandedDrinkId === drink.id;
          const temp = SERVING_TEMP[drink.servingTemp];

          const coffeeR = F.coffee(scaledCoffeeYield, u, 0);
          const waterR = F.water(scaledWater, u);
          const milkR = F.water(scaledMilk, u);
          const iceR = F.coffee(scaledIce, u, 0);

          const layers = [
            { key: 'coffee', name: 'Coffee', pct: coffeePct, amount: scaledCoffeeYield, cls: `${mode.bg} ${mode.on}`, text: F.text(coffeeR) },
            { key: 'water', name: 'Water', pct: waterPct, amount: scaledWater, cls: `${WATER_SWATCH} text-ink`, text: F.text(waterR) },
            { key: 'milk', name: 'Milk', pct: milkPct, amount: scaledMilk, cls: `${MILK_SWATCH} text-ink`, text: F.text(milkR) },
            { key: 'ice', name: 'Ice', pct: icePct, amount: scaledIce, cls: `${ICE_SWATCH} text-ink`, text: F.text(iceR) },
          ].filter(l => l.amount > 0);

          const cells: { key: string; label: string; swatch: string; value: F.Reading; sub: string; empty: boolean }[] = [
            {
              key: 'coffee',
              label: 'Coffee base',
              swatch: mode.bg,
              value: coffeeR,
              sub: `${F.text(F.coffee(scaledCoffeeDose, u))} dose · 1:${drink.coffeeBase.ratio}`,
              empty: false,
            },
            {
              key: 'water',
              label: 'Water',
              swatch: WATER_SWATCH,
              value: waterR,
              sub: drink.water.type !== 'none' ? drink.water.type.replace('_', ' ') : 'Zero bypass',
              empty: scaledWater <= 0,
            },
            {
              key: 'milk',
              label: 'Milk',
              swatch: MILK_SWATCH,
              value: milkR,
              sub: drink.milk.type !== 'none' ? drink.milk.type.replace('_', ' ') : 'No milk',
              empty: scaledMilk <= 0,
            },
            {
              key: 'ice',
              label: 'Ice',
              swatch: ICE_SWATCH,
              value: iceR,
              sub:
                scaledIce > 0
                  ? drink.ice.cubesCount
                    ? `~${Math.round((drink.ice.cubesCount || 4) * scale)} cubes`
                    : drink.ice.type
                  : 'Hot drink',
              empty: scaledIce <= 0,
            },
          ];

          return (
            <article key={drink.id} className="border-t-2 border-ink pt-3 pb-6 flex flex-col min-w-0">
              {/* Title row and actions */}
              <div className="flex items-start gap-3">
                <span className={`mt-[7px] w-4 h-4 shrink-0 ${mode.bg}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[21px] font-extrabold leading-tight">{drink.name}</h3>
                  {drink.italianOrAltName && (
                    <p className="text-[13.5px] text-mute font-semibold mt-0.5">{drink.italianOrAltName}</p>
                  )}
                </div>
                <div className="flex gap-2 -mr-1.5 -mt-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => duplicateCoffeeDrink(drink.id)}
                    aria-label={`Duplicate ${drink.name}`}
                    className="w-11 h-11 flex items-center justify-center hover:bg-tint"
                  >
                    <Copy className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(drink)}
                    aria-label={`Edit ${drink.name}`}
                    className="w-11 h-11 flex items-center justify-center hover:bg-tint"
                  >
                    <Edit2 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete drink recipe "${drink.name}"?`)) deleteCoffeeDrink(drink.id);
                    }}
                    aria-label={`Delete ${drink.name}`}
                    className="w-11 h-11 flex items-center justify-center text-bad hover:bg-tint"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>

              {/* Serving meta */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mute">
                {temp && (
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <temp.Icon className="w-4 h-4" />
                    {temp.label}
                  </span>
                )}
                <span>{drink.glassware}</span>
                <span>{mode.label} base</span>
              </div>

              {drink.description && (
                <div className="mt-2 flex items-center gap-2 min-w-0">
                  <p className="min-w-0 flex-1 truncate text-[14.5px] leading-snug">{drink.description}</p>
                  <InfoTip title={drink.name}>{drink.description}</InfoTip>
                </div>
              )}

              {/* Cup size scaler */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <Caps>Cup size</Caps>
                  <span className="text-[13px] text-mute">
                    <b className="num font-bold text-[18px] text-ink">{scaledOz} oz</b>
                    <span className="num"> · {scaledServing} ml · ×{Number(scale.toFixed(2))}</span>
                  </span>
                </div>
                <div role="radiogroup" aria-label={`Cup size for ${drink.name}`} className="mt-1.5 grid grid-cols-5 border border-ink">
                  {CUP_PRESETS_ML.map((ml, idx) => {
                    const value = ml / drink.defaultServingMl;
                    const isCurrent = Math.abs(scale - value) < 0.05;
                    return (
                      <button
                        key={ml}
                        type="button"
                        role="radio"
                        aria-checked={isCurrent}
                        aria-label={`${ml / 30} oz, ${ml} ml`}
                        onClick={() => handleSetScale(drink.id, Number(value.toFixed(2)))}
                        className={`min-h-[48px] flex flex-col items-center justify-center leading-none ${idx ? 'border-l border-ink' : ''} ${
                          isCurrent ? 'bg-ink text-paper' : 'hover:bg-tint'
                        }`}
                      >
                        <span className="num font-bold text-[16px]">{ml / 30} oz</span>
                        <span className={`num text-[11px] mt-1 ${isCurrent ? 'opacity-80' : 'text-mute'}`}>{ml} ml</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cup build-up */}
              <div className="mt-4">
                <Caps className="mb-1.5">Cup build-up</Caps>
                <div
                  className="h-11 flex border border-ink"
                  role="img"
                  aria-label={layers.map(l => `${l.name} ${l.text}, ${l.pct}%`).join('; ')}
                >
                  {layers.map((l, i) => (
                    <div
                      key={l.key}
                      style={{ flex: `${l.amount} 1 0%` }}
                      className={`${l.cls} ${i ? 'border-l border-ink' : ''} min-w-0 flex items-center justify-center overflow-hidden num font-bold text-[13px]`}
                    >
                      {l.pct >= 10 && `${l.pct}%`}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 border-l border-rule">
                  {cells.map(c => (
                    <div key={c.key} className="px-3 py-2.5 border-r border-b border-rule min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 shrink-0 border border-ink ${c.swatch}`} aria-hidden />
                        <Caps className="!text-[10.5px] truncate">{c.label}</Caps>
                      </div>
                      <div className={`mt-0.5 num font-bold text-[24px] leading-tight ${c.empty ? 'text-mute' : ''}`}>
                        {c.value.value}
                        <span className="text-[14px] font-semibold ml-1">{c.value.unit}</span>
                      </div>
                      <div className="text-[12px] text-mute truncate">{c.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additions & sweeteners */}
              {drink.additions && drink.additions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Caps>Extras</Caps>
                  {drink.additions.map((add, idx) => (
                    <span key={idx} className="text-[14px]">
                      {add.name} <b className="num font-bold">{Math.round(add.amount * scale)} {add.unit}</b>
                    </span>
                  ))}
                </div>
              )}

              {/* Barista tip */}
              {drink.baristaTips && (
                <div className="mt-2">
                  <InfoTip title="Barista tip" label="Barista tip" className="text-[14px] font-bold">
                    {drink.baristaTips}
                  </InfoTip>
                </div>
              )}

              {/* Barista steps */}
              {isExpanded && (
                <div className="mt-4 border-t border-rule pt-3">
                  <h4 className="text-[15px] font-extrabold mb-1.5">Assembly</h4>
                  <ol className="space-y-1.5 pl-5 list-decimal text-[14.5px] leading-snug">
                    {drink.assemblySteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Row actions */}
              <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedDrinkId(isExpanded ? null : drink.id)}
                  className="min-h-[44px] -ml-1 px-1 text-[14px] font-bold underline underline-offset-4 inline-flex items-center gap-1"
                >
                  {isExpanded ? 'Hide steps' : 'Barista steps'}
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <Btn size="md" onClick={() => handleLaunchBrewForDrink(drink, scale)}>
                  <Timer className="w-[18px] h-[18px]" />
                  Brew {F.text(coffeeR)} base
                </Btn>
              </div>
            </article>
          );
        })}
      </div>

      {/* Add / Edit drink sheet */}
      {isModalOpen && (
        <Sheet
          title={editingDrink ? `Edit ${editingDrink.name}` : 'New drink'}
          sub="Amounts for the default cup. The cup size scaler works out the rest."
          onClose={closeModal}
          side={layoutMode !== 'simple'}
          footer={
            <>
              <Btn size="md" onClick={closeModal}>Cancel</Btn>
              <Btn size="md" variant="primary" type="submit" form="drink-form" className="flex-1">
                Save drink
              </Btn>
            </>
          }
        >
          <form id="drink-form" onSubmit={handleSubmitModal} className="pb-2">
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <Caps className="mb-1">Drink name</Caps>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honey Cinnamon Cortado"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className={FIELD}
                />
              </label>
              <label className="block">
                <Caps className="mb-1">Italian / alt name</Caps>
                <input
                  type="text"
                  placeholder="e.g. Cortado con Miel"
                  value={formAltName}
                  onChange={e => setFormAltName(e.target.value)}
                  className={FIELD}
                />
              </label>
              <label className="block">
                <Caps className="mb-1">Drink category</Caps>
                <select
                  value={formFamily}
                  onChange={e => setFormFamily(e.target.value as DrinkFamily)}
                  className={FIELD}
                >
                  <option value="espresso_black">Espresso Black</option>
                  <option value="espresso_milk">Espresso & Milk</option>
                  <option value="iced_cold">Iced & Cold Drinks</option>
                  <option value="traditional_heritage">Traditional Heritage</option>
                  <option value="specialty_fusion">Specialty Fusion</option>
                </select>
              </label>
              <div>
                <Caps className="mb-1">Serving temp</Caps>
                <Segmented
                  label="Serving temp"
                  value={formServingTemp}
                  onChange={setFormServingTemp}
                  className="w-full"
                  options={[
                    { value: 'hot', label: 'Hot' },
                    { value: 'iced', label: 'Iced' },
                    { value: 'chilled_layered', label: 'Layered' },
                    { value: 'room_temp', label: 'Room' },
                  ]}
                />
              </div>
              <label className="block">
                <Caps className="mb-1">Glassware / cup</Caps>
                <input
                  type="text"
                  value={formGlassware}
                  onChange={e => setFormGlassware(e.target.value)}
                  placeholder="e.g. 150ml Gibraltar Glass"
                  className={FIELD}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <Caps className="mb-1">Default serving (ml)</Caps>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formDefaultServingMl}
                    onChange={e => setFormDefaultServingMl(parseInt(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
                <label className="block">
                  <Caps className="mb-1">Default cup (oz)</Caps>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={formDefaultCupOz}
                    onChange={e => setFormDefaultCupOz(parseFloat(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
              </div>
              <label className="block">
                <Caps className="mb-1">Description</Caps>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Flavour, texture and where the drink comes from"
                  className={AREA}
                />
              </label>
            </div>

            {formSection(
              'Coffee base',
              modeFor(formCoffeeBrewType).bg,
              <>
                <label className="block">
                  <Caps className="mb-1">Dose (g)</Caps>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={formCoffeeDose}
                    onChange={e => setFormCoffeeDose(parseFloat(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
                <label className="block">
                  <Caps className="mb-1">Yield (g)</Caps>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={formCoffeeYield}
                    onChange={e => setFormCoffeeYield(parseFloat(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
                <div className="col-span-2">
                  <Caps className="mb-1">Brewed as</Caps>
                  <div role="radiogroup" aria-label="Brewed as" className="grid grid-cols-2 gap-2">
                    {BREW_TYPES.map(b => {
                      const on = formCoffeeBrewType === b.value;
                      return (
                        <button
                          key={b.value}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setFormCoffeeBrewType(b.value)}
                          className={`min-h-[48px] px-3 flex items-center gap-2 text-left text-[14px] font-semibold border ${
                            on ? 'bg-ink text-paper border-ink' : 'border-rule hover:border-ink'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 shrink-0 ${modeFor(b.value).bg}`} aria-hidden />
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {formSection(
              'Water',
              WATER_SWATCH,
              <>
                <label className="block">
                  <Caps className="mb-1">Amount (ml)</Caps>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formWaterMl}
                    onChange={e => setFormWaterMl(parseInt(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
                <div className="min-w-0">
                  <Caps className="mb-1">Type</Caps>
                  <SmartDropdownWithOthers
                    options={WATER_TYPE_OPTIONS}
                    value={formWaterType}
                    onChange={val => setFormWaterType(val)}
                    customVariableGroup="drink_water_types"
                    placeholder="Select water type..."
                  />
                </div>
              </>
            )}

            {formSection(
              'Milk / cream',
              MILK_SWATCH,
              <>
                <label className="block">
                  <Caps className="mb-1">Amount (ml / g)</Caps>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formMilkMl}
                    onChange={e => setFormMilkMl(parseInt(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
                <div className="min-w-0">
                  <Caps className="mb-1">Type</Caps>
                  <SmartDropdownWithOthers
                    options={MILK_OPTIONS}
                    value={formMilkType}
                    onChange={val => setFormMilkType(val)}
                    customVariableGroup="drink_milk_types"
                    placeholder="Select milk or plant type..."
                  />
                </div>
              </>
            )}

            {formSection(
              'Ice',
              ICE_SWATCH,
              <>
                <label className="block">
                  <Caps className="mb-1">Amount (g)</Caps>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formIceGrams}
                    onChange={e => setFormIceGrams(parseInt(e.target.value) || 0)}
                    className={NUM_FIELD}
                  />
                </label>
                <div className="min-w-0">
                  <Caps className="mb-1">Type</Caps>
                  <SmartDropdownWithOthers
                    options={ICE_TYPE_OPTIONS}
                    value={formIceType}
                    onChange={val => setFormIceType(val)}
                    customVariableGroup="drink_ice_types"
                    placeholder="Select ice type..."
                  />
                </div>
              </>
            )}

            <section className="mt-6">
              <h3 className="border-b border-ink pb-1.5 text-[16px] font-extrabold">Steps & tips</h3>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <label className="block">
                  <Caps className="mb-1">Assembly steps, one per line</Caps>
                  <textarea
                    rows={4}
                    value={formSteps}
                    onChange={e => setFormSteps(e.target.value)}
                    placeholder={'Step 1...\nStep 2...\nStep 3...'}
                    className={AREA}
                  />
                </label>
                <label className="block">
                  <Caps className="mb-1">Barista tip</Caps>
                  <input
                    type="text"
                    value={formTips}
                    onChange={e => setFormTips(e.target.value)}
                    placeholder="e.g. Swirl espresso before pouring milk"
                    className={FIELD}
                  />
                </label>
              </div>
            </section>
          </form>
        </Sheet>
      )}
    </div>
  );
};
