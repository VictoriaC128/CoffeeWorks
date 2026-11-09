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
  AlertTriangle,
  Lightbulb,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCoffee } from '../context/CoffeeContext';
import { Recipe, PourStage, SensoryRating } from '../types/coffee';

export const LiveBrewStopwatch: React.FC = () => {
  const {
    recipes,
    selectedRecipeForBrew,
    setSelectedRecipeForBrew,
    beans,
    gearProfiles,
    waterProfiles,
    calculateExtractionYield,
    calculateFlowRate,
    getDialInAdvice,
    logBrewSession,
  } = useCoffee();

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Recipe Selector */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wide">
                Active Dial-in Station
              </span>
              <span className="text-xs text-stone-400 capitalize">
                Category: {activeRecipe.category.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {activeRecipe.title}
            </h2>
          </div>

          {/* Quick Recipe Switcher */}
          <div className="flex items-center space-x-2">
            <label className="text-xs text-stone-400 whitespace-nowrap">Switch Recipe:</label>
            <select
              value={activeRecipe.id}
              onChange={e => {
                const found = recipes.find(r => r.id === e.target.value);
                if (found) setSelectedRecipeForBrew(found);
              }}
              className="bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
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
    </div>
  );
};
