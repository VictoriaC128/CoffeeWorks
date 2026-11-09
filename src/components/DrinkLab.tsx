import React, { useState, useMemo } from 'react';
import {
  Coffee,
  Droplets,
  Flame,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  Timer,
  Sliders,
  Scale,
  Thermometer,
  Layers,
  GlassWater,
  CupSoda,
} from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeDrinkRecipe, DrinkFamily, CoffeeCategory } from '../types/coffee';
import { SmartDropdownWithOthers, DropdownOption } from './SmartDropdownWithOthers';

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950/20 to-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                World Coffee Encyclopedia & Ratios
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Water • Milk • Ice • Coffee Engine
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-3">
              <GlassWater className="w-8 h-8 text-amber-500" />
              <span>Coffee Drinks & Formulation Ratios</span>
            </h1>
            <p className="text-sm text-stone-400 max-w-3xl leading-relaxed">
              Every iconic coffee drink with precise liquid formulations. Scale any recipe across cup sizes (4 oz to 16 oz) with auto-recalculated exact amounts of <strong className="text-amber-400">Coffee</strong>, <strong className="text-cyan-400">Water</strong>, <strong className="text-stone-200">Milk / Microfoam</strong>, and <strong className="text-sky-300">Ice</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Drink</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800">
            <span className="text-[10px] font-mono text-stone-500 uppercase block">Total Drinks</span>
            <span className="text-xl font-bold font-mono text-amber-400">{coffeeDrinks.length}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Global Recipes</span>
          </div>
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800">
            <span className="text-[10px] font-mono text-stone-500 uppercase block">Milk & Latte Art</span>
            <span className="text-xl font-bold font-mono text-stone-200">
              {coffeeDrinks.filter(d => d.milk.amountMl > 0).length}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Microfoam & Creams</span>
          </div>
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800">
            <span className="text-[10px] font-mono text-stone-500 uppercase block">Iced & Cold Drinks</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {coffeeDrinks.filter(d => d.ice.amountGrams > 0 || d.servingTemp === 'iced').length}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Ice & Chilled Layers</span>
          </div>
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800">
            <span className="text-[10px] font-mono text-stone-500 uppercase block">Heritage & Regional</span>
            <span className="text-xl font-bold font-mono text-red-400">
              {coffeeDrinks.filter(d => d.family === 'traditional_heritage').length}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Kopi, Phin & Cezve</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Family Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Drinks' },
            { id: 'espresso_black', label: '☕ Espresso Black' },
            { id: 'espresso_milk', label: '🥛 Milk & Microfoam' },
            { id: 'iced_cold', label: '🧊 Iced & Chilled' },
            { id: 'traditional_heritage', label: '🇸🇬 Traditional Heritage' },
            { id: 'specialty_fusion', label: '✨ Specialty Fusion' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFamily(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFamily === tab.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drinks, milk, ice, water..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Drink Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDrinks.map(drink => {
          const scale = scaleMap[drink.id] ?? 1.0;

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

          return (
            <div
              key={drink.id}
              className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between hover:border-stone-700/80 transition-all group"
            >
              <div>
                {/* Header: Badges & Actions */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {drink.servingTemp === 'hot' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span>HOT SERVING</span>
                      </span>
                    )}
                    {drink.servingTemp === 'iced' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30 flex items-center space-x-1">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        <span>ICED / CHILLED</span>
                      </span>
                    )}
                    {drink.servingTemp === 'chilled_layered' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                        <Layers className="w-3 h-3 text-purple-400" />
                        <span>THERMAL LAYERED</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-400 bg-stone-950 border border-stone-800">
                      {drink.glassware}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => duplicateCoffeeDrink(drink.id)}
                      title="Clone Drink"
                      className="p-1.5 text-stone-500 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(drink)}
                      title="Edit Formulation"
                      className="p-1.5 text-stone-500 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete drink recipe "${drink.name}"?`)) deleteCoffeeDrink(drink.id);
                      }}
                      title="Delete"
                      className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Drink Titles */}
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {drink.name}
                  </h3>
                  {drink.italianOrAltName && (
                    <p className="text-xs font-mono text-amber-500/90 font-medium">
                      {drink.italianOrAltName}
                    </p>
                  )}
                  <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                    {drink.description}
                  </p>
                </div>

                {/* Cup Size & Serving Scaler */}
                <div className="mt-4 p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-stone-300 flex items-center space-x-1.5">
                      <Scale className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cup Size & Serving Scaler:</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {scaledOz} oz • {scaledServing} ml ({scale}x)
                    </span>
                  </div>

                  {/* Preset Quick Scaler Buttons */}
                  <div className="grid grid-cols-5 gap-1.5 text-[10px] font-mono">
                    {[
                      { label: '4 oz (120ml)', value: 120 / drink.defaultServingMl },
                      { label: '6 oz (180ml)', value: 180 / drink.defaultServingMl },
                      { label: '8 oz (240ml)', value: 240 / drink.defaultServingMl },
                      { label: '12 oz (360ml)', value: 360 / drink.defaultServingMl },
                      { label: '16 oz (480ml)', value: 480 / drink.defaultServingMl },
                    ].map((btn, idx) => {
                      const isCurrent = Math.abs(scale - btn.value) < 0.05;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSetScale(drink.id, Number(btn.value.toFixed(2)))}
                          className={`py-1 px-1.5 rounded-lg border text-center transition-all ${
                            isCurrent
                              ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 font-bold'
                              : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                          }`}
                        >
                          {btn.label.split(' ')[0]} oz
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exact Liquid Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
                  {/* Coffee Base Card */}
                  <div className="p-3 bg-stone-950 rounded-xl border border-amber-900/30 text-center">
                    <div className="flex items-center justify-center space-x-1 text-amber-400 mb-1">
                      <Coffee className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold uppercase">Coffee Base</span>
                    </div>
                    <span className="text-base font-black text-amber-300 font-mono block">
                      {scaledCoffeeYield} g
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block">
                      {scaledCoffeeDose}g dose • 1:{drink.coffeeBase.ratio}
                    </span>
                  </div>

                  {/* Water Card */}
                  <div className={`p-3 bg-stone-950 rounded-xl border text-center ${
                    scaledWater > 0 ? 'border-cyan-900/40' : 'border-stone-800/50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-center space-x-1 text-cyan-400 mb-1">
                      <Droplets className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold uppercase">Water to Use</span>
                    </div>
                    <span className="text-base font-black text-cyan-300 font-mono block">
                      {scaledWater > 0 ? `${scaledWater} ml` : '0 ml'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block truncate">
                      {drink.water.type !== 'none' ? drink.water.type.replace('_', ' ') : 'Zero bypass'}
                    </span>
                  </div>

                  {/* Milk Card */}
                  <div className={`p-3 bg-stone-950 rounded-xl border text-center ${
                    scaledMilk > 0 ? 'border-amber-500/30' : 'border-stone-800/50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-center space-x-1 text-stone-200 mb-1">
                      <CupSoda className="w-3.5 h-3.5 text-stone-300" />
                      <span className="text-[10px] font-mono font-bold uppercase">Milk to Use</span>
                    </div>
                    <span className="text-base font-black text-white font-mono block">
                      {scaledMilk > 0 ? `${scaledMilk} ml` : '0 ml'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block truncate">
                      {drink.milk.type !== 'none' ? drink.milk.type.replace('_', ' ') : 'No milk'}
                    </span>
                  </div>

                  {/* Ice Card */}
                  <div className={`p-3 bg-stone-950 rounded-xl border text-center ${
                    scaledIce > 0 ? 'border-sky-500/30' : 'border-stone-800/50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-center space-x-1 text-sky-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold uppercase">Ice to Use</span>
                    </div>
                    <span className="text-base font-black text-sky-300 font-mono block">
                      {scaledIce > 0 ? `${scaledIce} g` : '0 g'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block truncate">
                      {scaledIce > 0
                        ? drink.ice.cubesCount
                          ? `~${Math.round((drink.ice.cubesCount || 4) * scale)} cubes`
                          : drink.ice.type
                        : 'Hot drink'}
                    </span>
                  </div>
                </div>

                {/* Visual Proportion Bar Stack */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-1.5">
                    <span>Drink Composition Layers:</span>
                    <span>100% Total Volume</span>
                  </div>
                  <div className="h-4 w-full bg-stone-950 rounded-lg overflow-hidden flex border border-stone-800">
                    {icePct > 0 && (
                      <div
                        style={{ width: `${icePct}%` }}
                        title={`Ice: ${scaledIce}g (${icePct}%)`}
                        className="bg-sky-400/80 hover:bg-sky-300 transition-colors flex items-center justify-center text-[9px] font-mono text-stone-950 font-bold overflow-hidden"
                      >
                        {icePct > 12 && `Ice ${icePct}%`}
                      </div>
                    )}
                    {milkPct > 0 && (
                      <div
                        style={{ width: `${milkPct}%` }}
                        title={`Milk: ${scaledMilk}ml (${milkPct}%)`}
                        className="bg-stone-200 hover:bg-white transition-colors flex items-center justify-center text-[9px] font-mono text-stone-950 font-bold overflow-hidden"
                      >
                        {milkPct > 12 && `Milk ${milkPct}%`}
                      </div>
                    )}
                    {waterPct > 0 && (
                      <div
                        style={{ width: `${waterPct}%` }}
                        title={`Water: ${scaledWater}ml (${waterPct}%)`}
                        className="bg-cyan-500/80 hover:bg-cyan-400 transition-colors flex items-center justify-center text-[9px] font-mono text-stone-950 font-bold overflow-hidden"
                      >
                        {waterPct > 12 && `Water ${waterPct}%`}
                      </div>
                    )}
                    {coffeePct > 0 && (
                      <div
                        style={{ width: `${coffeePct}%` }}
                        title={`Coffee: ${scaledCoffeeYield}g (${coffeePct}%)`}
                        className="bg-amber-600 hover:bg-amber-500 transition-colors flex items-center justify-center text-[9px] font-mono text-white font-bold overflow-hidden"
                      >
                        {coffeePct > 10 && `Coffee ${coffeePct}%`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additions & Sweeteners if present */}
                {drink.additions && drink.additions.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-mono">
                    <span className="text-[10px] text-stone-400">Sweeteners / Extras:</span>
                    {drink.additions.map((add, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]"
                      >
                        {add.name} ({Math.round(add.amount * scale)} {add.unit})
                      </span>
                    ))}
                  </div>
                )}

                {/* Expandable Barista Instructions & Science */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-800/80 space-y-3.5 text-xs">
                    <div>
                      <h4 className="font-bold text-stone-200 mb-2 flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Step-by-Step Barista Assembly:</span>
                      </h4>
                      <ol className="space-y-1.5 pl-4 list-decimal text-stone-300 leading-relaxed font-sans">
                        {drink.assemblySteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {drink.baristaTips && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 leading-relaxed">
                        <strong className="text-amber-400 block font-mono text-[11px] mb-0.5">
                          💡 Barista Craft & Extraction Note:
                        </strong>
                        {drink.baristaTips}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setExpandedDrinkId(isExpanded ? null : drink.id)}
                  className="text-xs font-mono text-stone-400 hover:text-white flex items-center space-x-1"
                >
                  <span>{isExpanded ? 'Hide Steps' : 'View Barista Steps'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleLaunchBrewForDrink(drink, scale)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
                >
                  <Timer className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                  <span>Pull {scaledCoffeeYield}g Base</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Drink Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <GlassWater className="w-5 h-5 text-amber-500" />
                <span>{editingDrink ? `Edit ${editingDrink.name}` : 'Create New Coffee Drink'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="mt-5 space-y-4 text-xs">
              {/* Name & Alt Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-stone-300 mb-1">Drink Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honey Cinnamon Cortado"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-stone-300 mb-1">Italian / Alt Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Cortado con Miel"
                    value={formAltName}
                    onChange={e => setFormAltName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Family & Serving Temp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-stone-300 mb-1">Drink Category:</label>
                  <select
                    value={formFamily}
                    onChange={e => setFormFamily(e.target.value as DrinkFamily)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="espresso_black">Espresso Black</option>
                    <option value="espresso_milk">Espresso & Milk</option>
                    <option value="iced_cold">Iced & Cold Drinks</option>
                    <option value="traditional_heritage">Traditional Heritage</option>
                    <option value="specialty_fusion">Specialty Fusion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-stone-300 mb-1">Serving Temp:</label>
                  <select
                    value={formServingTemp}
                    onChange={e => setFormServingTemp(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="hot">Hot Serving 🔥</option>
                    <option value="iced">Iced / Chilled 🧊</option>
                    <option value="chilled_layered">Thermal Layered ❄️</option>
                    <option value="room_temp">Room Temp</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-stone-300 mb-1">Glassware / Cup:</label>
                  <input
                    type="text"
                    value={formGlassware}
                    onChange={e => setFormGlassware(e.target.value)}
                    placeholder="e.g. 150ml Gibraltar Glass"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Serving Size defaults */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-stone-300 mb-1">Default Serving Volume (ml):</label>
                  <input
                    type="number"
                    value={formDefaultServingMl}
                    onChange={e => setFormDefaultServingMl(parseInt(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-stone-300 mb-1">Default Cup Size (oz):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formDefaultCupOz}
                    onChange={e => setFormDefaultCupOz(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-stone-300 mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Describe the drink's flavor profile, texture, and origin..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* SECTION: Coffee Base */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-mono font-bold text-amber-400 block">☕ 1. Coffee Base Extraction:</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Coffee Dose (g):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formCoffeeDose}
                      onChange={e => setFormCoffeeDose(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Yield / Extracted (g):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formCoffeeYield}
                      onChange={e => setFormCoffeeYield(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Brew Discipline:</label>
                    <select
                      value={formCoffeeBrewType}
                      onChange={e => setFormCoffeeBrewType(e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-2 py-1.5 text-white font-mono"
                    >
                      <option value="espresso">Espresso</option>
                      <option value="filter">Filter / Drip</option>
                      <option value="immersion">Immersion / Cold Brew</option>
                      <option value="singaporean_kopi">Kopi Sock</option>
                      <option value="moka_stovetop">Moka Pot</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: Water */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-mono font-bold text-cyan-400 block">💧 2. Amount of Water to Use:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Water Amount (ml):</label>
                    <input
                      type="number"
                      value={formWaterMl}
                      onChange={e => setFormWaterMl(parseInt(e.target.value) || 0)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-cyan-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Water Type:</label>
                    <SmartDropdownWithOthers
                      options={WATER_TYPE_OPTIONS}
                      value={formWaterType}
                      onChange={val => setFormWaterType(val)}
                      customVariableGroup="drink_water_types"
                      placeholder="Select water type..."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Milk */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-mono font-bold text-stone-200 block">🥛 3. Amount of Milk / Cream to Use:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Milk Amount (ml / g):</label>
                    <input
                      type="number"
                      value={formMilkMl}
                      onChange={e => setFormMilkMl(parseInt(e.target.value) || 0)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Milk / Dairy Type:</label>
                    <SmartDropdownWithOthers
                      options={MILK_OPTIONS}
                      value={formMilkType}
                      onChange={val => setFormMilkType(val)}
                      customVariableGroup="drink_milk_types"
                      placeholder="Select milk or plant type..."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Ice */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-mono font-bold text-sky-400 block">🧊 4. Amount of Ice to Use:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Ice Amount (grams):</label>
                    <input
                      type="number"
                      value={formIceGrams}
                      onChange={e => setFormIceGrams(parseInt(e.target.value) || 0)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-sky-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-400 mb-1">Ice Type:</label>
                    <SmartDropdownWithOthers
                      options={ICE_TYPE_OPTIONS}
                      value={formIceType}
                      onChange={val => setFormIceType(val)}
                      customVariableGroup="drink_ice_types"
                      placeholder="Select ice type..."
                    />
                  </div>
                </div>
              </div>

              {/* Steps & Tips */}
              <div>
                <label className="block font-mono text-stone-300 mb-1">
                  Assembly Steps (one instruction per line):
                </label>
                <textarea
                  rows={3}
                  value={formSteps}
                  onChange={e => setFormSteps(e.target.value)}
                  placeholder="Step 1...&#10;Step 2...&#10;Step 3..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-stone-300 mb-1">Barista Craft Tip:</label>
                <input
                  type="text"
                  value={formTips}
                  onChange={e => setFormTips(e.target.value)}
                  placeholder="e.g. Swirl espresso before pouring milk..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-950/40"
                >
                  Save Drink Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
