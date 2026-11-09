import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Star, ShieldCheck, Zap } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { Recipe, CoffeeCategory, PourStage, BasketSpec } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import {
  ESPRESSO_MACHINE_OPTIONS,
  ESPRESSO_BASKET_OPTIONS,
  BASKET_SIZE_OPTIONS,
  BASKET_DIAMETER_OPTIONS,
  FILTER_DRIPPER_OPTIONS,
  FILTER_PAPER_OPTIONS,
  GRINDER_OPTIONS,
  WDT_OPTIONS,
  TAMPER_OPTIONS,
  PUCK_SCREEN_OPTIONS,
  DISPERSION_OPTIONS,
} from '../data/dropdownCatalog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe | null;
}

export const RecipeModal: React.FC<Props> = ({ isOpen, onClose, recipeToEdit }) => {
  const {
    beans,
    waterProfiles,
    addRecipe,
    updateRecipe,
    userPreferences,
    setDefaultRecipeForCategory,
  } = useCoffee();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CoffeeCategory>('espresso');
  const [beanId, setBeanId] = useState<string>('');
  const [waterProfileId, setWaterProfileId] = useState<string>('');

  // Equipment & Tools
  const [machineModel, setMachineModel] = useState<string>('Lelit Bianca V3');
  const [grinderModel, setGrinderModel] = useState<string>('Option-O Lagom P64');
  const [dripperModel, setDripperModel] = useState<string>('Orea V4 Modular (Apex Base)');
  const [filterPaperType, setFilterPaperType] = useState<string>('Sibarist FAST Flat');

  // Basket Specs for Espresso / Levers
  const [basketBrand, setBasketBrand] = useState<string>('WAFO Spirit');
  const [basketSize, setBasketSize] = useState<string>('20g-22g');
  const [basketDiameter, setBasketDiameter] = useState<string>('58.5mm');

  // Puck Prep Tools
  const [wdtTool, setWdtTool] = useState<string>('Subminimal Flick 0.25mm');
  const [tamperTool, setTamperTool] = useState<string>('calibrated_30lb');
  const [puckScreenTool, setPuckScreenTool] = useState<string>('0.2mm Sworks Billet');
  const [hasBottomPaper, setHasBottomPaper] = useState<boolean>(true);
  const [hasFlowControl, setHasFlowControl] = useState<boolean>(true);
  const [hasPreInfusion, setHasPreInfusion] = useState<boolean>(true);

  // Filter Tooling
  const [dispersionTool, setDispersionTool] = useState<string>('Kettle Direct Pour');
  const [usesNegotiator, setUsesNegotiator] = useState<boolean>(true);
  const [hasImmersionValve, setHasImmersionValve] = useState<boolean>(false);

  // Recipe Metrics
  const [doseGrams, setDoseGrams] = useState<number>(18);
  const [yieldGrams, setYieldGrams] = useState<number>(36);
  const [waterTempC, setWaterTempC] = useState<number>(93);
  const [grindSetting, setGrindSetting] = useState<string>('1.4');
  const [grindMicrons, setGrindMicrons] = useState<number | undefined>(260);

  const [preInfusionSeconds, setPreInfusionSeconds] = useState<number>(5);
  const [targetTotalTimeSeconds, setTargetTotalTimeSeconds] = useState<number>(30);
  const [targetTdsPercent, setTargetTdsPercent] = useState<number | undefined>(9.5);
  const [notes, setNotes] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);

  const [pourStages, setPourStages] = useState<PourStage[]>([]);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCategory(recipeToEdit.category);
      setBeanId(recipeToEdit.beanId || '');
      setWaterProfileId(recipeToEdit.waterProfileId || '');
      setDoseGrams(recipeToEdit.doseGrams);
      setYieldGrams(recipeToEdit.yieldGrams);
      setWaterTempC(recipeToEdit.waterTempC);
      setGrindSetting(recipeToEdit.grindSetting);
      setGrindMicrons(recipeToEdit.grindMicrons);
      setPreInfusionSeconds(recipeToEdit.preInfusionSeconds || 0);
      setTargetTotalTimeSeconds(recipeToEdit.targetTotalTimeSeconds);
      setTargetTdsPercent(recipeToEdit.targetTdsPercent);
      setNotes(recipeToEdit.notes || '');
      setPourStages(recipeToEdit.pourStages || []);
      setIsDefault(userPreferences.defaultRecipePerCategory[recipeToEdit.category] === recipeToEdit.id);

      if (recipeToEdit.basketSpec) {
        setBasketBrand(recipeToEdit.basketSpec.brand);
        setBasketSize(recipeToEdit.basketSpec.sizeGrams);
        setBasketDiameter(recipeToEdit.basketSpec.diameterMm);
      }
    } else {
      setTitle('');
      setCategory('espresso');
      setBeanId(beans[0]?.id || '');
      setWaterProfileId(waterProfiles[0]?.id || '');
      setDoseGrams(18);
      setYieldGrams(36);
      setWaterTempC(93);
      setGrindSetting('1.4');
      setGrindMicrons(260);
      setPreInfusionSeconds(5);
      setTargetTotalTimeSeconds(30);
      setTargetTdsPercent(9.5);
      setNotes('');
      setPourStages([]);
      setIsDefault(false);
      setMachineModel('Lelit Bianca V3');
      setGrinderModel('Option-O Lagom P64');
      setBasketBrand('WAFO Spirit');
      setBasketSize('20g-22g');
      setBasketDiameter('58.5mm');
    }
  }, [recipeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategorySwitch = (newCat: CoffeeCategory) => {
    setCategory(newCat);
    if (newCat === 'espresso') {
      setDoseGrams(18);
      setYieldGrams(38);
      setTargetTotalTimeSeconds(32);
      setWaterTempC(93);
      setMachineModel('Lelit Bianca V3');
      setGrindSetting('1.4');
      setGrindMicrons(260);
    } else if (newCat === 'filter') {
      setDoseGrams(15);
      setYieldGrams(250);
      setTargetTotalTimeSeconds(150);
      setWaterTempC(92);
      setDripperModel('Orea V4 Modular (Apex Base)');
      setFilterPaperType('Sibarist FAST Flat');
      setGrindSetting('5.1');
      setGrindMicrons(680);
    } else if (newCat === 'manual_lever') {
      setDoseGrams(18);
      setYieldGrams(45);
      setTargetTotalTimeSeconds(38);
      setWaterTempC(95);
      setMachineModel('Flair 58+ Heated Chamber');
      setGrindSetting('2.2');
      setGrindMicrons(280);
    } else if (newCat === 'moka_stovetop') {
      setDoseGrams(18);
      setYieldGrams(36);
      setTargetTotalTimeSeconds(330);
      setWaterTempC(99);
      setMachineModel('9Barista Twin Boiler 9-Bar Stovetop');
      setGrindSetting('1.1.5');
      setGrindMicrons(300);
    } else if (newCat === 'singaporean_kopi') {
      setDoseGrams(25);
      setYieldGrams(160);
      setTargetTotalTimeSeconds(180);
      setWaterTempC(100);
      setMachineModel('Long-Spout Stainless Kettle + Flannel Sock');
      setGrindSetting('Coarse Nanyang Sand Grind');
      setGrindMicrons(1100);
    } else if (newCat === 'immersion') {
      setDoseGrams(18);
      setYieldGrams(200);
      setTargetTotalTimeSeconds(120);
      setWaterTempC(86);
      setMachineModel('AeroPress Clear + Flow Control Cap');
      setGrindSetting('22');
      setGrindMicrons(750);
    }
  };

  const handleAddPourStage = () => {
    const newStage: PourStage = {
      id: `stage-${Date.now()}`,
      name: `Pour ${pourStages.length + 1}`,
      targetWeightGrams: Math.round(yieldGrams * ((pourStages.length + 1) / (pourStages.length + 2))),
      startTimeSeconds: pourStages.length * 30,
      durationSeconds: 15,
      agitation: 'gentle_pour',
    };
    setPourStages([...pourStages, newStage]);
  };

  const handleRemovePourStage = (id: string) => {
    setPourStages(pourStages.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const basketSpec: BasketSpec | undefined =
      category === 'espresso' || category === 'manual_lever'
        ? {
            brand: basketBrand,
            sizeGrams: basketSize,
            diameterMm: basketDiameter,
          }
        : undefined;

    const recipeData = {
      title,
      category,
      beanId: beanId || undefined,
      waterProfileId: waterProfileId || undefined,
      doseGrams,
      yieldGrams,
      ratio: Number((yieldGrams / (doseGrams || 1)).toFixed(2)),
      waterTempC,
      grindSetting,
      grindMicrons,
      preInfusionSeconds: category === 'espresso' || category === 'manual_lever' ? preInfusionSeconds : 0,
      targetTotalTimeSeconds,
      targetFlowRateGs: Number((yieldGrams / (targetTotalTimeSeconds || 1)).toFixed(2)),
      targetTdsPercent,
      targetExtractionYieldPercent: targetTdsPercent
        ? Number(((yieldGrams * targetTdsPercent) / (doseGrams || 1)).toFixed(2))
        : undefined,
      pourStages: category === 'filter' || category === 'immersion' ? pourStages : undefined,
      basketSpec,
      isDefault,
      notes: `${notes} [Machine: ${machineModel}] [Grinder: ${grinderModel}] ${
        category === 'filter' ? `[Dripper: ${dripperModel}] [Paper: ${filterPaperType}]` : ''
      }`.trim(),
      tags: [category.replace('_', ' ')],
    };

    if (recipeToEdit) {
      updateRecipe(recipeToEdit.id, recipeData);
      if (isDefault) setDefaultRecipeForCategory(category, recipeToEdit.id);
    } else {
      const created = addRecipe(recipeData);
      if (isDefault) setDefaultRecipeForCategory(category, created.id);
    }

    onClose();
  };

  // Recommended tamper calculation
  const recommendedTamper =
    basketDiameter === '58.5mm'
      ? '58.55mm Precision Tamper (Pullman / Normcore / BigStep)'
      : basketDiameter === '54mm'
      ? '53.3mm Precision Tamper (Breville 54mm fit)'
      : basketDiameter === '53mm'
      ? '53.0mm Tamper (9Barista standard)'
      : `${basketDiameter} matching base`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              {recipeToEdit ? 'Edit Coffee Recipe' : 'Create Custom Coffee Recipe'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Select your variables from the dropdowns or choose "Others..." to key in custom labels.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Method Selector Tabs */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1.5">
              Select Coffee Brewing Method:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'espresso', label: '⚡ Benchtop Espresso' },
                { id: 'filter', label: '💧 Modern Filter' },
                { id: 'manual_lever', label: '🦾 Manual Lever' },
                { id: 'moka_stovetop', label: '🔥 Stovetop & Moka' },
                { id: 'singaporean_kopi', label: '🇸🇬 Singaporean Kopi' },
                { id: 'immersion', label: '⏳ Immersion' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleCategorySwitch(item.id as CoffeeCategory)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    category === item.id
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-950/40'
                      : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Set as Default */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-stone-300 mb-1">Recipe Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Slayer-Profile Extraction"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-300 font-medium flex items-center space-x-1.5">
                <Star className={`w-4 h-4 ${isDefault ? 'text-amber-400 fill-amber-400' : 'text-stone-500'}`} />
                <span>Default Rig</span>
              </span>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Core Hardware & Water Dropdowns with 'Others...' */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-3.5">
            <span className="text-xs font-mono font-bold text-amber-400 block uppercase tracking-wider">
              Core Rig & Chemistry Selection (With "Others..." Key-In)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Machine or Dripper Dropdown */}
              {category === 'espresso' && (
                <SmartDropdownWithOthers
                  label="Espresso Machine:"
                  value={machineModel}
                  onChange={setMachineModel}
                  options={ESPRESSO_MACHINE_OPTIONS}
                  customVariableGroup="machines"
                />
              )}

              {category === 'filter' && (
                <SmartDropdownWithOthers
                  label="Filter Dripper:"
                  value={dripperModel}
                  onChange={setDripperModel}
                  options={FILTER_DRIPPER_OPTIONS}
                  customVariableGroup="drippers"
                />
              )}

              {(category === 'manual_lever' || category === 'moka_stovetop' || category === 'singaporean_kopi' || category === 'immersion') && (
                <SmartDropdownWithOthers
                  label="Vessel / Machine Model:"
                  value={machineModel}
                  onChange={setMachineModel}
                  options={[
                    { label: 'Flair 58+ Heated Chamber Lever', value: 'Flair 58+' },
                    { label: 'Cafelat Robot Dual Lever', value: 'Cafelat Robot' },
                    { label: 'Odyssey Espresso Argos Hybrid', value: 'Odyssey Argos' },
                    { label: 'Wacaco Picopresso Handheld', value: 'Wacaco Picopresso' },
                    { label: '9Barista Twin Boiler Stovetop', value: '9Barista Stovetop' },
                    { label: 'Bialetti Brikka Crema Valve', value: 'Bialetti Brikka' },
                    { label: 'Classic Bialetti Moka Express', value: 'Bialetti Moka Express' },
                    { label: 'Long-Spout Kettle + Flannel Cloth Sock', value: 'Cloth Sock Pull' },
                    { label: 'AeroPress Clear + Flow Control Cap', value: 'AeroPress Clear' },
                    { label: 'AeroPress Inverted World Champion', value: 'AeroPress Inverted' },
                  ]}
                  customVariableGroup="machines"
                />
              )}

              {/* Grinder Dropdown */}
              <SmartDropdownWithOthers
                label="Grinder & Burrs:"
                value={grinderModel}
                onChange={setGrinderModel}
                options={GRINDER_OPTIONS}
                customVariableGroup="grinders"
              />

              {/* Water Profile Dropdown */}
              <SmartDropdownWithOthers
                label="Water Source & TDS:"
                value={waterProfileId}
                onChange={setWaterProfileId}
                options={waterProfiles.map(w => ({
                  label: `${w.name} (${w.tdsPpm} ppm)`,
                  value: w.id,
                  group: w.countryRegion,
                }))}
                customVariableGroup="waters"
              />
            </div>
          </div>

          {/* METHOD SPECIFIC: Espresso Basket & Puck Preparation Suite */}
          {(category === 'espresso' || category === 'manual_lever') && (
            <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 block uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Precision Basket & Tool Selection</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  Tamper Fit: <strong className="text-amber-300">{recommendedTamper}</strong>
                </span>
              </div>

              {/* Basket Brand, Size, Diameter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SmartDropdownWithOthers
                  label="Basket Brand / Model:"
                  value={basketBrand}
                  onChange={setBasketBrand}
                  options={ESPRESSO_BASKET_OPTIONS}
                  customVariableGroup="baskets"
                />

                <SmartDropdownWithOthers
                  label="Basket Dose Capacity:"
                  value={basketSize}
                  onChange={setBasketSize}
                  options={BASKET_SIZE_OPTIONS}
                  customVariableGroup="basket_sizes"
                />

                <SmartDropdownWithOthers
                  label="Basket Diameter:"
                  value={basketDiameter}
                  onChange={setBasketDiameter}
                  options={BASKET_DIAMETER_OPTIONS}
                  customVariableGroup="basket_diameters"
                />
              </div>

              {/* Puck Prep Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <SmartDropdownWithOthers
                  label="Needle WDT Tool:"
                  value={wdtTool}
                  onChange={setWdtTool}
                  options={WDT_OPTIONS}
                  customVariableGroup="wdt_tools"
                />

                <SmartDropdownWithOthers
                  label="Tamper System:"
                  value={tamperTool}
                  onChange={setTamperTool}
                  options={TAMPER_OPTIONS}
                  customVariableGroup="tampers"
                />

                <SmartDropdownWithOthers
                  label="Top Puck Screen:"
                  value={puckScreenTool}
                  onChange={setPuckScreenTool}
                  options={PUCK_SCREEN_OPTIONS}
                  customVariableGroup="puck_screens"
                />
              </div>

              {/* Bottom Paper & Flow Controls */}
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-stone-300">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBottomPaper}
                    onChange={e => setHasBottomPaper(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Bottom Basket Paper Disc</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFlowControl}
                    onChange={e => setHasFlowControl(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Flow Control Needle Paddle Active</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPreInfusion}
                    onChange={e => setHasPreInfusion(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>Low-Pressure Pre-Infusion</span>
                </label>
              </div>
            </div>
          )}

          {/* METHOD SPECIFIC: Filter Paper & Tooling */}
          {category === 'filter' && (
            <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800/80 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 block uppercase tracking-wider">
                Filter Paper Media & Tooling Synergy
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SmartDropdownWithOthers
                  label="Filter Paper / Porous Medium:"
                  value={filterPaperType}
                  onChange={setFilterPaperType}
                  options={FILTER_PAPER_OPTIONS}
                  customVariableGroup="papers"
                />

                <SmartDropdownWithOthers
                  label="Dispersion & Agitation Tool:"
                  value={dispersionTool}
                  onChange={setDispersionTool}
                  options={DISPERSION_OPTIONS}
                  customVariableGroup="dispersions"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-stone-300">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usesNegotiator}
                    onChange={e => setUsesNegotiator(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                  <span>Uses Orea Negotiator Tool (Zero Bypass Wall Pleating)</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasImmersionValve}
                    onChange={e => setHasImmersionValve(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Hybrid Immersion Valve (Switch / Pulsar / Clever)</span>
                </label>
              </div>
            </div>
          )}

          {/* Dose, Yield, Temp, Time Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Dose In (g):</label>
              <input
                type="number"
                step="0.1"
                required
                value={doseGrams}
                onChange={e => setDoseGrams(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Yield Out (g):</label>
              <input
                type="number"
                step="0.5"
                required
                value={yieldGrams}
                onChange={e => setYieldGrams(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Water Temp (°C):</label>
              <input
                type="number"
                value={waterTempC}
                onChange={e => setWaterTempC(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Target Time (s):</label>
              <input
                type="number"
                value={targetTotalTimeSeconds}
                onChange={e => setTargetTotalTimeSeconds(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grind Setting & Micron Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                Grind Setting (e.g. 1.4 / 5.1 / 24 clicks):
              </label>
              <input
                type="text"
                placeholder="e.g. Fellow Ode 5.1 / Comandante 24"
                value={grindSetting}
                onChange={e => setGrindSetting(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                Estimated Microns (µm):
              </label>
              <input
                type="number"
                placeholder="e.g. 260 for espresso, 650 for filter"
                value={grindMicrons || ''}
                onChange={e => setGrindMicrons(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pour Schedule Builder for Filter & Immersion */}
          {(category === 'filter' || category === 'immersion') && (
            <div className="pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-stone-200">
                  Pour Stages & Drawdown Schedule:
                </span>
                <button
                  type="button"
                  onClick={handleAddPourStage}
                  className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stage</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pourStages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-2 p-2 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono"
                  >
                    <span className="w-4 text-stone-500 font-bold">{idx + 1}</span>
                    <input
                      type="text"
                      value={stage.name}
                      onChange={e => {
                        const updated = [...pourStages];
                        updated[idx].name = e.target.value;
                        setPourStages(updated);
                      }}
                      className="bg-transparent text-stone-200 flex-1 focus:outline-none"
                    />
                    <div className="flex items-center space-x-1">
                      <span className="text-stone-400">Target:</span>
                      <input
                        type="number"
                        value={stage.targetWeightGrams}
                        onChange={e => {
                          const updated = [...pourStages];
                          updated[idx].targetWeightGrams = parseFloat(e.target.value) || 0;
                          setPourStages(updated);
                        }}
                        className="w-16 bg-stone-900 border border-stone-700 rounded px-1.5 py-0.5 text-cyan-400 text-right focus:outline-none"
                      />
                      <span className="text-cyan-400">g</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="text-stone-400">@</span>
                      <input
                        type="number"
                        value={stage.startTimeSeconds}
                        onChange={e => {
                          const updated = [...pourStages];
                          updated[idx].startTimeSeconds = parseInt(e.target.value) || 0;
                          setPourStages(updated);
                        }}
                        className="w-12 bg-stone-900 border border-stone-700 rounded px-1.5 py-0.5 text-stone-200 text-right focus:outline-none"
                      />
                      <span className="text-stone-400">s</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePourStage(stage.id)}
                      className="p-1 text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barista Notes */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">
              Barista Notes & Preparation Steps:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. WDT thoroughly, 30lb spring tamp, top puck screen..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-stone-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
            >
              <Save className="w-4 h-4" />
              <span>{recipeToEdit ? 'Save Changes' : 'Create Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
