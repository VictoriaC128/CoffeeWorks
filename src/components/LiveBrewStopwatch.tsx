import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Thermometer,
  Scale,
  Gauge,
  Droplets,
  Lightbulb,
  Award,
  Star,
  Bookmark,
  Save,
  X,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCoffee } from '../context/CoffeeContext';
import { Recipe, PourStage, SensoryRating, CoffeeCategory } from '../types/coffee';

const CATEGORY_FILTER_TABS: { id: CoffeeCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Profiles', icon: '📋' },
  { id: 'espresso', label: 'Espresso', icon: '⚡' },
  { id: 'filter', label: 'Filter', icon: '💧' },
  { id: 'manual_lever', label: 'Lever', icon: '🦾' },
  { id: 'moka_stovetop', label: 'Moka', icon: '🔥' },
  { id: 'singaporean_kopi', label: 'Kopi', icon: '🇸🇬' },
  { id: 'immersion', label: 'Immersion', icon: '⏳' },
];

export const LiveBrewStopwatch: React.FC = () => {
  const {
    recipes,
    selectedRecipeForBrew,
    setSelectedRecipeForBrew,
    userPreferences,
    setDefaultRecipeForCategory,
    addRecipe,
    beans,
    gearProfiles,
    waterProfiles,
    calculateExtractionYield,
    calculateFlowRate,
    getDialInAdvice,
    logBrewSession,
  } = useCoffee();

  // Category filter state for profile switcher
  const [profileCategoryFilter, setProfileCategoryFilter] = useState<CoffeeCategory | 'all'>('all');

  // Modal to save adjusted live dial-in numbers as new profile
  const [isSaveProfileModalOpen, setIsSaveProfileModalOpen] = useState(false);
  const [newProfileTitle, setNewProfileTitle] = useState('');

  // Selected Recipe
  const activeRecipe: Recipe = selectedRecipeForBrew || recipes[0];

  // Live Preparation Adjustments for THIS specific cup
  const [actualDose, setActualDose] = useState<number>(activeRecipe.doseGrams);
  const [actualYield, setActualYield] = useState<number>(activeRecipe.yieldGrams);
  const [actualTemp, setActualTemp] = useState<number>(activeRecipe.waterTempC);

  // Sync when recipe changes
  useEffect(() => {
    if (activeRecipe) {
      setActualDose(activeRecipe.doseGrams);
      setActualYield(activeRecipe.yieldGrams);
      setActualTemp(activeRecipe.waterTempC);
    }
  }, [activeRecipe.id]);

  // Stopwatch state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Refractometer TDS & Sensory Feedback
  const [refractometerTds, setRefractometerTds] = useState<string>('');
  const [sensoryRating, setSensoryRating] = useState<SensoryRating>({
    overall: 4,
    acidity: 3,
    sweetness: 4,
    bitterness: 2,
    body: 3,
    verdict: 'balanced',
  });
  const [sensoryNotes, setSensoryNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // High-precision timer using requestAnimationFrame / interval
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - accumulatedMsRef.current;
      const tick = () => {
        const now = performance.now();
        const currentElapsed = now - startTimeRef.current;
        accumulatedMsRef.current = currentElapsed;
        setElapsedMs(currentElapsed);
        timerRef.current = requestAnimationFrame(tick);
      };
      timerRef.current = requestAnimationFrame(tick);
    } else {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isRunning]);

  // Derived time calculations
  const totalSeconds = elapsedMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((elapsedMs % 1000) / 100);

  // Live Flow Rate Calculation (g/s)
  const currentFlowRateGs = calculateFlowRate(actualYield, totalSeconds);
  const targetFlowRate = activeRecipe.targetFlowRateGs || calculateFlowRate(activeRecipe.yieldGrams, activeRecipe.targetTotalTimeSeconds);

  // Extraction Yield Calculation
  const tdsNumber = parseFloat(refractometerTds) || 0;
  const calculatedEy = tdsNumber > 0 ? calculateExtractionYield(actualDose, actualYield, tdsNumber) : undefined;

  // Active stage for filter pours
  const pourStages: PourStage[] = activeRecipe.pourStages || [];
  const currentStage = pourStages[currentStageIndex];

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
    setCurrentStageIndex(0);
    setIsCompleted(false);
    setSaveSuccess(false);
  };

  const handleNextStage = () => {
    if (currentStageIndex < pourStages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleFinishBrew = () => {
    setIsRunning(false);
    setIsCompleted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
  };

  // Associated Beans, Gear, Water
  const selectedBean = beans.find(b => b.id === activeRecipe.beanId);
  const selectedGear = gearProfiles.find(g => g.id === activeRecipe.gearId);
  const selectedWater = waterProfiles.find(w => w.id === activeRecipe.waterProfileId);

  // Dynamic Dial-in Advice
  const adviceList = getDialInAdvice(
    activeRecipe.category,
    Math.round(totalSeconds),
    activeRecipe.targetTotalTimeSeconds,
    currentFlowRateGs,
    targetFlowRate,
    calculatedEy,
    sensoryRating.verdict
  );

  const handleSaveBrewSession = () => {
    logBrewSession({
      recipeId: activeRecipe.id,
      recipeTitle: activeRecipe.title,
      category: activeRecipe.category,
      beanName: selectedBean ? selectedBean.name : 'Unknown Bean',
      actualDoseGrams: actualDose,
      actualYieldGrams: actualYield,
      actualRatio: Number((actualYield / actualDose).toFixed(2)),
      actualPreInfusionSeconds: activeRecipe.preInfusionSeconds,
      actualTotalTimeSeconds: Number(totalSeconds.toFixed(1)),
      actualFlowRateGs: currentFlowRateGs,
      refractometerTdsPercent: tdsNumber > 0 ? tdsNumber : undefined,
      calculatedExtractionYieldPercent: calculatedEy,
      sensory: sensoryRating,
      sensoryNotes: sensoryNotes.trim() || 'Brew session completed cleanly.',
      dialInAdvice: adviceList,
    });
    setSaveSuccess(true);
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Profile selection and default rig helpers
  const isCurrentCategoryDefault =
    userPreferences.defaultRecipePerCategory[activeRecipe.category] === activeRecipe.id;

  const filteredRecipes = profileCategoryFilter === 'all'
    ? recipes
    : recipes.filter(r => r.category === profileCategoryFilter);

  const defaultProfilesList = (['espresso', 'filter', 'manual_lever', 'moka_stovetop', 'singaporean_kopi', 'immersion'] as CoffeeCategory[])
    .map(cat => {
      const defId = userPreferences.defaultRecipePerCategory[cat];
      const match = recipes.find(r => r.id === defId) || recipes.find(r => r.category === cat);
      return match ? { category: cat, recipe: match } : null;
    })
    .filter((item): item is { category: CoffeeCategory; recipe: Recipe } => item !== null);

  const handleSelectProfile = (recipeId: string) => {
    const found = recipes.find(r => r.id === recipeId);
    if (!found) return;
    setSelectedRecipeForBrew(found);
    setActualDose(found.doseGrams);
    setActualYield(found.yieldGrams);
    setActualTemp(found.waterTempC);
    if (!isRunning) {
      setElapsedMs(0);
      accumulatedMsRef.current = 0;
      setCurrentStageIndex(0);
      setIsCompleted(false);
    }
  };

  const handleLoadDefaultRig = () => {
    const targetCat = profileCategoryFilter !== 'all' ? profileCategoryFilter : activeRecipe.category;
    const defId = userPreferences.defaultRecipePerCategory[targetCat] || userPreferences.defaultRecipePerCategory[userPreferences.primaryCategory];
    const defRecipe = recipes.find(r => r.id === defId) || recipes.find(r => r.category === targetCat);
    if (defRecipe) {
      handleSelectProfile(defRecipe.id);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }
  };

  const handleSetCurrentAsDefault = () => {
    setDefaultRecipeForCategory(activeRecipe.category, activeRecipe.id);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const isDialInTweaked =
    Math.abs(actualDose - activeRecipe.doseGrams) > 0.05 ||
    Math.abs(actualYield - activeRecipe.yieldGrams) > 0.05 ||
    Math.abs(actualTemp - activeRecipe.waterTempC) > 0.5;

  const handleSaveTweakedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileTitle.trim()) return;
    const newRecipe = addRecipe({
      title: newProfileTitle.trim(),
      category: activeRecipe.category,
      beanId: activeRecipe.beanId,
      gearId: activeRecipe.gearId,
      waterProfileId: activeRecipe.waterProfileId,
      doseGrams: actualDose,
      yieldGrams: actualYield,
      ratio: Number((actualYield / (actualDose || 1)).toFixed(2)),
      waterTempC: actualTemp,
      grindSetting: activeRecipe.grindSetting,
      grindMicrons: activeRecipe.grindMicrons,
      targetTotalTimeSeconds: activeRecipe.targetTotalTimeSeconds,
      targetFlowRateGs: activeRecipe.targetFlowRateGs,
      targetTdsPercent: activeRecipe.targetTdsPercent,
      targetExtractionYieldPercent: activeRecipe.targetExtractionYieldPercent,
      pourStages: activeRecipe.pourStages,
      basketSpec: activeRecipe.basketSpec,
      notes: `Custom dialed profile from Live Station: ${actualDose}g in → ${actualYield}g out. ${activeRecipe.notes || ''}`,
      tags: [...(activeRecipe.tags || []), 'Dialed In', 'Live Station'],
    });
    setSelectedRecipeForBrew(newRecipe);
    setIsSaveProfileModalOpen(false);
    setNewProfileTitle('');
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Profile / Default Selector Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        {/* Method Filter Tabs & Quick Loaders */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-mono text-stone-400 mr-1 hidden md:inline">Filter:</span>
            {CATEGORY_FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setProfileCategoryFilter(tab.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  profileCategoryFilter === tab.id
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                    : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <span>{tab.icon} {tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadDefaultRig}
              title="Instantly load category default daily driver rig"
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Load Default Rig</span>
            </button>

            {!isCurrentCategoryDefault ? (
              <button
                onClick={handleSetCurrentAsDefault}
                title="Designate this recipe as the category default daily driver"
                className="px-2.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-amber-500/40 text-xs font-mono flex items-center space-x-1 transition-all"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Set as Default</span>
              </button>
            ) : (
              <span className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>DEFAULT RIG</span>
              </span>
            )}

            {isDialInTweaked && (
              <button
                onClick={() => {
                  setNewProfileTitle(`${activeRecipe.title} (${actualDose}g / ${actualYield}g)`);
                  setIsSaveProfileModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-md transition-all animate-pulse"
                title="Save adjusted dose/yield numbers as a new profile in your vault"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Tweaked</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Information & Dropdown Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wide">
                Active Dial-in Station
              </span>
              <span className="text-xs text-stone-400 font-mono capitalize">
                Category: {activeRecipe.category.replace('_', ' ')}
              </span>
              {isCurrentCategoryDefault && (
                <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Category Benchmark</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {activeRecipe.title}
            </h2>
            <p className="text-xs text-stone-400 line-clamp-1">
              Target: {activeRecipe.doseGrams}g in → {activeRecipe.yieldGrams}g out (1:{activeRecipe.ratio}) in {activeRecipe.targetTotalTimeSeconds}s @ {activeRecipe.waterTempC}°C
            </p>
          </div>

          {/* Profile Dropdown Selector (Defaults + Pre-saved) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="space-y-1 w-full sm:w-auto">
              <label className="text-[11px] font-mono text-stone-400 flex items-center space-x-1">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Default or Pre-saved Profile:</span>
              </label>
              <select
                value={activeRecipe.id}
                onChange={e => handleSelectProfile(e.target.value)}
                className="w-full sm:w-80 bg-stone-950 border border-stone-700 text-stone-100 text-xs font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 shadow-inner"
              >
                {/* Default Profiles Group */}
                <optgroup label="⭐ Default Daily-Driver Profiles">
                  {defaultProfilesList.map(({ category, recipe }) => (
                    <option key={`default-${recipe.id}`} value={recipe.id}>
                      ⭐ {category.toUpperCase()}: {recipe.title} ({recipe.doseGrams}g → {recipe.yieldGrams}g)
                    </option>
                  ))}
                </optgroup>

                {/* Pre-saved Profiles Group */}
                <optgroup label={`📚 Pre-Saved Brew Profiles (${filteredRecipes.length})`}>
                  {filteredRecipes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.isDefault ? '⭐ ' : ''}{r.title} — {r.doseGrams}g → {r.yieldGrams}g (1:{r.ratio})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Live Variable Quick Adjustments for THIS Cup */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-800/80">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider flex items-center space-x-1">
              <Scale className="w-3 h-3 text-amber-400" />
              <span>Dose In (g)</span>
            </span>
            <input
              type="number"
              step="0.1"
              value={actualDose}
              onChange={e => setActualDose(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-stone-400">Target: {activeRecipe.doseGrams}g</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider flex items-center space-x-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>Yield Out (g)</span>
            </span>
            <input
              type="number"
              step="0.5"
              value={actualYield}
              onChange={e => setActualYield(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-cyan-400 focus:outline-none"
            />
            <span className="text-[10px] text-stone-400">
              Ratio: 1:{(actualYield / (actualDose || 1)).toFixed(1)}
            </span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider flex items-center space-x-1">
              <Thermometer className="w-3 h-3 text-red-400" />
              <span>Water Temp (°C)</span>
            </span>
            <input
              type="number"
              value={actualTemp}
              onChange={e => setActualTemp(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-red-400 focus:outline-none"
            />
            <span className="text-[10px] text-stone-400">Target: {activeRecipe.waterTempC}°C</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider flex items-center space-x-1">
              <Layers className="w-3 h-3 text-purple-400" />
              <span>Grind Setting</span>
            </span>
            <p className="text-xs sm:text-sm font-mono font-semibold text-stone-200 mt-1 truncate">
              {activeRecipe.grindSetting}
            </p>
            {activeRecipe.grindMicrons && (
              <span className="text-[10px] text-stone-400">{activeRecipe.grindMicrons} µm</span>
            )}
          </div>
        </div>

        {/* Bean, Gear & Water Badges */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {selectedBean && (
            <div className="bg-stone-800/80 px-2.5 py-1 rounded-lg text-stone-300 flex items-center space-x-1.5 border border-stone-700/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedBean.name} ({selectedBean.origin} · {selectedBean.roastLevel})</span>
            </div>
          )}

          {selectedGear && (
            <div className="bg-stone-800/80 px-2.5 py-1 rounded-lg text-stone-300 flex items-center space-x-1.5 border border-stone-700/60">
              <Layers className="w-3.5 h-3.5 text-stone-400" />
              <span>{selectedGear.dripperModel || selectedGear.machineModel}</span>
              {selectedGear.filterPaperType && (
                <span className="text-amber-400/90 font-medium">· {selectedGear.filterPaperType}</span>
              )}
            </div>
          )}

          {selectedWater && (
            <div className="bg-stone-800/80 px-2.5 py-1 rounded-lg text-stone-300 flex items-center space-x-1.5 border border-stone-700/60">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedWater.name} ({selectedWater.tdsPpm} ppm TDS)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Stopwatch Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer & Extraction Diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
              isRunning ? 'bg-amber-500/15' : 'bg-transparent'
            }`} />

            <div className="flex items-center justify-center space-x-2 text-xs font-mono text-stone-400 tracking-wider uppercase mb-2">
              <Gauge className="w-4 h-4 text-amber-500" />
              <span>Extraction Timeline Monitor</span>
            </div>

            {/* High Precision Timer Display */}
            <div className="font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white select-none">
              <span>{String(minutes).padStart(2, '0')}</span>
              <span className="text-amber-500 animate-pulse">:</span>
              <span>{String(seconds).padStart(2, '0')}</span>
              <span className="text-2xl sm:text-3xl text-stone-500">.{tenths}</span>
            </div>

            {/* Pacing vs Target */}
            <div className="mt-2 text-xs font-mono text-stone-400 flex items-center justify-center space-x-3">
              <span>Target: {activeRecipe.targetTotalTimeSeconds}s</span>
              <span>•</span>
              <span className={totalSeconds > activeRecipe.targetTotalTimeSeconds ? 'text-amber-400 font-semibold' : ''}>
                Diff: {(totalSeconds - activeRecipe.targetTotalTimeSeconds).toFixed(1)}s
              </span>
            </div>

            {/* Real-time Flow Rate Bar (g/s) */}
            <div className="mt-6 max-w-md mx-auto bg-stone-950 p-4 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-stone-400 flex items-center space-x-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Calculated Flow Rate</span>
                </span>
                <span className="text-cyan-400 font-bold text-sm">
                  {totalSeconds > 0 ? currentFlowRateGs : '0.00'} g/s
                </span>
              </div>

              {/* Visual Speed Gauge Bar */}
              <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden flex relative">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, (currentFlowRateGs / ((targetFlowRate || 2) * 1.5)) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>0 g/s</span>
                <span className="text-amber-400">Target: {targetFlowRate.toFixed(2)} g/s</span>
                <span>3.0+ g/s</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-center space-x-4">
              <button
                onClick={handleStartStop}
                className={`px-8 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center space-x-2 shadow-xl transition-all duration-200 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50 scale-105'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{elapsedMs > 0 ? 'Resume Brew' : 'Start Brew'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {isRunning && (
                <button
                  onClick={handleFinishBrew}
                  className="px-5 py-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-semibold text-sm flex items-center space-x-1.5 transition-colors border border-amber-500/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Complete</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pour Stages Schedule (if available) */}
          {pourStages.length > 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Pour Stages & Drawdown Schedule</span>
                </h4>
                <span className="text-xs text-stone-400 font-mono">
                  Stage {currentStageIndex + 1} of {pourStages.length}
                </span>
              </div>

              <div className="space-y-2">
                {pourStages.map((stage, idx) => {
                  const isCurrent = idx === currentStageIndex;
                  const isPassed = idx < currentStageIndex;
                  return (
                    <div
                      key={stage.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                          : isPassed
                          ? 'bg-stone-950/40 border-stone-800/60 text-stone-400'
                          : 'bg-stone-950/20 border-stone-800/40 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isPassed
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : isCurrent
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {isPassed ? '✓' : idx + 1}
                          </span>
                          <span className={`text-xs font-semibold ${isCurrent ? 'text-amber-300' : ''}`}>
                            {stage.name}
                          </span>
                        </div>

                        <div className="text-xs font-mono flex items-center space-x-3">
                          <span className="font-bold text-cyan-400">{stage.targetWeightGrams}g</span>
                          <span className="text-stone-400">@{stage.startTimeSeconds}s</span>
                        </div>
                      </div>

                      {stage.notes && isCurrent && (
                        <p className="text-[11px] text-amber-200/80 mt-1.5 pl-7">
                          💡 {stage.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {isRunning && currentStageIndex < pourStages.length - 1 && (
                <button
                  onClick={handleNextStage}
                  className="mt-4 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-amber-950/40"
                >
                  <span>Advance to Next Pour ({pourStages[currentStageIndex + 1]?.name})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Refractometer TDS %, Extraction Yield & Dial-in Diagnostics */}
        <div className="space-y-6">
          {/* Extraction Yield (EY %) Refractometer Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-stone-200 flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Extraction Yield & Refractometer</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">
                  Beverage TDS % (DiFluid / Atago / VST):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    placeholder="e.g. 9.5% espresso or 1.4% filter"
                    value={refractometerTds}
                    onChange={e => setRefractometerTds(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-mono text-stone-400">% TDS</span>
                </div>
              </div>

              {/* Calculated EY Box */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-mono">
                  Calculated Extraction Yield (EY)
                </span>
                <span className="text-2xl font-mono font-black text-amber-400 mt-1 block">
                  {calculatedEy !== undefined ? `${calculatedEy}%` : '-- %'}
                </span>

                {calculatedEy !== undefined && (
                  <div className="mt-2 text-[11px] font-medium">
                    {calculatedEy < 18.0 && (
                      <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        Under-extracted (&lt; 18.0%)
                      </span>
                    )}
                    {calculatedEy >= 18.0 && calculatedEy <= 22.0 && (
                      <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        Specialty Balanced (18.0% - 22.0%)
                      </span>
                    )}
                    {calculatedEy > 22.0 && (
                      <span className="text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full border border-purple-400/20">
                        High Extraction (22.0%+)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sensory Cupping Sliders & Verdict */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sensory Evaluation & Cup Verdict</span>
            </h4>

            {/* Verdict Selection */}
            <div>
              <label className="block text-[11px] font-mono text-stone-400 mb-1.5">Extraction Verdict:</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                {[
                  { id: 'under_extracted', label: 'Sour / Fast' },
                  { id: 'balanced', label: 'Balanced / Sweet' },
                  { id: 'over_extracted', label: 'Bitter / Dry' },
                  { id: 'channeling', label: 'Channelling / Astringent' },
                  { id: 'stalled', label: 'Stalled / Choked' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setSensoryRating(prev => ({
                        ...prev,
                        verdict: item.id as SensoryRating['verdict'],
                      }))
                    }
                    className={`py-1.5 px-2.5 rounded-lg border text-center transition-colors ${
                      sensoryRating.verdict === item.id
                        ? 'bg-amber-600 text-white border-amber-500 font-semibold'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cupping Attribute Sliders */}
            <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
              <div>
                <div className="flex justify-between text-stone-300 font-mono text-[11px]">
                  <span>Acidity (Crisp vs Harsh)</span>
                  <span className="text-amber-400 font-bold">{sensoryRating.acidity}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sensoryRating.acidity}
                  onChange={e =>
                    setSensoryRating(prev => ({ ...prev, acidity: parseInt(e.target.value) }))
                  }
                  className="w-full accent-amber-500 h-1.5 bg-stone-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-300 font-mono text-[11px]">
                  <span>Sweetness (Caramel / Fruit)</span>
                  <span className="text-amber-400 font-bold">{sensoryRating.sweetness}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sensoryRating.sweetness}
                  onChange={e =>
                    setSensoryRating(prev => ({ ...prev, sweetness: parseInt(e.target.value) }))
                  }
                  className="w-full accent-amber-500 h-1.5 bg-stone-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-300 font-mono text-[11px]">
                  <span>Bitterness (Pleasant Cocoa vs Burnt)</span>
                  <span className="text-amber-400 font-bold">{sensoryRating.bitterness}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sensoryRating.bitterness}
                  onChange={e =>
                    setSensoryRating(prev => ({ ...prev, bitterness: parseInt(e.target.value) }))
                  }
                  className="w-full accent-amber-500 h-1.5 bg-stone-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-300 font-mono text-[11px]">
                  <span>Body & Crema Texture</span>
                  <span className="text-amber-400 font-bold">{sensoryRating.body}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sensoryRating.body}
                  onChange={e =>
                    setSensoryRating(prev => ({ ...prev, body: parseInt(e.target.value) }))
                  }
                  className="w-full accent-amber-500 h-1.5 bg-stone-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Barista Notes */}
            <div className="pt-2 border-t border-stone-800">
              <label className="block text-[11px] font-mono text-stone-400 mb-1">
                Tasting & Barista Notes:
              </label>
              <textarea
                rows={2}
                value={sensoryNotes}
                onChange={e => setSensoryNotes(e.target.value)}
                placeholder="Floral jasmine aroma, syrupy peach body, silky finish..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Smart Barista Dial-in Advisor Box */}
          <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Smart Dial-in Diagnostic Advice</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {adviceList.map((adv, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>

            {/* Save Session CTA */}
            <div className="mt-4 pt-3 border-t border-stone-800">
              {saveSuccess ? (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold text-center flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Brew Session Saved to Dial-in History!</span>
                </div>
              ) : (
                <button
                  onClick={handleSaveBrewSession}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save to Dial-in History</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Tweaked Profile Modal */}
      {isSaveProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-amber-500" />
                <span>Save Live Dial-In as New Profile</span>
              </h3>
              <button
                onClick={() => setIsSaveProfileModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTweakedProfile} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-stone-300 mb-1">New Profile Name:</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Morning 1:2.3 Turbo Extraction"
                  value={newProfileTitle}
                  onChange={e => setNewProfileTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-300 space-y-1">
                <div className="flex justify-between">
                  <span>Dose:</span>
                  <span className="font-bold text-amber-400">{actualDose}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Yield:</span>
                  <span className="font-bold text-cyan-400">{actualYield}g (1:{(actualYield / (actualDose || 1)).toFixed(1)})</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Temp:</span>
                  <span className="font-bold text-red-400">{actualTemp}°C</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
                >
                  <Save className="w-4 h-4" />
                  <span>Save to Pre-saved Profiles</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
