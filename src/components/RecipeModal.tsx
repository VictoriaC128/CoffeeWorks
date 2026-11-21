import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Star } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { Recipe, CoffeeCategory, PourStage, BasketSpec } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import { Btn, Sheet } from '../brew/ui';
import { MODES } from '../brew/modes';
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
  PORTAFILTER_OPTIONS,
  SHOWER_SCREEN_OPTIONS,
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
    getLastUsedTools,
    updateLastUsedTools,
  } = useCoffee();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CoffeeCategory>('espresso');
  const [beanId, setBeanId] = useState<string>('');
  const [waterProfileId, setWaterProfileId] = useState<string>('');
  const [saveAsNewRevision, setSaveAsNewRevision] = useState<boolean>(true);

  // Equipment & Tools
  const [machineModel, setMachineModel] = useState<string>('Lelit Bianca V3');
  const [grinderModel, setGrinderModel] = useState<string>('Option-O Lagom P64');
  const [dripperModel, setDripperModel] = useState<string>('Orea V4 Modular (Apex Base)');
  const [filterPaperType, setFilterPaperType] = useState<string>('Sibarist FAST Flat');

  // Basket Specs for Espresso / Levers
  const [basketBrand, setBasketBrand] = useState<string>('MHW-3BOMBER DEX / Sniper High-Flow Basket (58.5mm)');
  const [basketSize, setBasketSize] = useState<string>('20g-22g');
  const [basketDiameter, setBasketDiameter] = useState<string>('58.5mm');
  const [portafilter, setPortafilter] = useState<string>('MHW-3BOMBER 58mm Bottomless');
  const [showerScreen, setShowerScreen] = useState<string>('Pesado High-Extraction Screen');

  // Puck Prep Tools
  const [wdtTool, setWdtTool] = useState<string>('MHW-3BOMBER Cyclone WDT');
  const [tamperTool, setTamperTool] = useState<string>('MHW-3BOMBER Flash 30lb');
  const [puckScreenTool, setPuckScreenTool] = useState<string>('0.8mm MHW-3BOMBER Titanium');
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

  // Apply user's previous tool selections for category
  const applyPreviousSelectionsForCategory = (cat: CoffeeCategory) => {
    const prev = getLastUsedTools(cat);
    if (prev) {
      if (prev.machineModel) setMachineModel(prev.machineModel);
      if (prev.grinderModel) setGrinderModel(prev.grinderModel);
      if (prev.waterProfileId) setWaterProfileId(prev.waterProfileId);
      if (prev.dripperModel) setDripperModel(prev.dripperModel);
      if (prev.filterPaperType) setFilterPaperType(prev.filterPaperType);
      if (prev.dispersionTool) setDispersionTool(prev.dispersionTool);
      if (prev.basketBrand) setBasketBrand(prev.basketBrand);
      if (prev.basketSize) setBasketSize(prev.basketSize);
      if (prev.basketDiameter) setBasketDiameter(prev.basketDiameter);
      if (prev.portafilter) setPortafilter(prev.portafilter);
      if (prev.showerScreen) setShowerScreen(prev.showerScreen);
      if (prev.tamperTool) setTamperTool(prev.tamperTool);
      if (prev.puckScreenTool) setPuckScreenTool(prev.puckScreenTool);
      if (prev.wdtTool) setWdtTool(prev.wdtTool);
      if (prev.doseGrams !== undefined) setDoseGrams(prev.doseGrams);
      if (prev.yieldGrams !== undefined) setYieldGrams(prev.yieldGrams);
      if (prev.waterTempC !== undefined) setWaterTempC(prev.waterTempC);
      if (prev.grindSetting !== undefined) setGrindSetting(prev.grindSetting);
      if (prev.grindMicrons !== undefined) setGrindMicrons(prev.grindMicrons);
      return;
    }

    // Default Fallbacks by category
    if (cat === 'espresso') {
      setDoseGrams(18);
      setYieldGrams(38);
      setTargetTotalTimeSeconds(32);
      setWaterTempC(93);
      setMachineModel('Lelit Bianca V3');
      setBasketBrand('MHW-3BOMBER DEX / Sniper High-Flow Basket (58.5mm)');
      setPortafilter('MHW-3BOMBER 58mm Bottomless');
      setShowerScreen('Pesado High-Extraction Screen');
      setTamperTool('MHW-3BOMBER Flash 30lb');
      setPuckScreenTool('0.8mm MHW-3BOMBER Titanium');
      setWdtTool('MHW-3BOMBER Cyclone WDT');
      setGrindSetting('1.4');
      setGrindMicrons(260);
    } else if (cat === 'filter') {
      setDoseGrams(15);
      setYieldGrams(250);
      setTargetTotalTimeSeconds(150);
      setWaterTempC(92);
      setDripperModel('Orea V4 Modular (Apex Base)');
      setFilterPaperType('Sibarist FAST Flat');
      setDispersionTool('Kettle Direct Pour');
      setGrindSetting('5.1');
      setGrindMicrons(680);
    } else if (cat === 'manual_lever') {
      setDoseGrams(18);
      setYieldGrams(45);
      setTargetTotalTimeSeconds(38);
      setWaterTempC(95);
      setMachineModel('Flair 58+ Heated Chamber');
      setPortafilter('Flair 58 Bottomless');
      setShowerScreen('IMS E61 200 IM');
      setTamperTool('MHW-3BOMBER Flash 30lb');
      setPuckScreenTool('0.8mm MHW-3BOMBER Titanium');
      setGrindSetting('2.2');
      setGrindMicrons(280);
    } else if (cat === 'moka_stovetop') {
      setDoseGrams(18);
      setYieldGrams(36);
      setTargetTotalTimeSeconds(330);
      setWaterTempC(99);
      setMachineModel('9Barista Twin Boiler 9-Bar Stovetop');
      setGrindSetting('1.1.5');
      setGrindMicrons(300);
    } else if (cat === 'singaporean_kopi') {
      setDoseGrams(25);
      setYieldGrams(160);
      setTargetTotalTimeSeconds(180);
      setWaterTempC(100);
      setMachineModel('Long-Spout Stainless Kettle + Flannel Sock');
      setGrindSetting('Coarse Nanyang Sand Grind');
      setGrindMicrons(1100);
    } else if (cat === 'immersion') {
      setDoseGrams(18);
      setYieldGrams(200);
      setTargetTotalTimeSeconds(120);
      setWaterTempC(86);
      setMachineModel('AeroPress Clear + Flow Control Cap');
      setGrindSetting('22');
      setGrindMicrons(750);
    }
  };

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
      setSaveAsNewRevision(true);

      if (recipeToEdit.basketSpec) {
        setBasketBrand(recipeToEdit.basketSpec.brand);
        setBasketSize(recipeToEdit.basketSpec.sizeGrams);
        setBasketDiameter(recipeToEdit.basketSpec.diameterMm);
      }
      setPortafilter(recipeToEdit.portafilter || 'N/A');
      setShowerScreen(recipeToEdit.showerScreen || 'N/A');
    } else {
      setTitle('');
      const startingCat = (userPreferences.primaryCategory as CoffeeCategory) || 'espresso';
      setCategory(startingCat);
      setBeanId(beans[0]?.id || '');
      setWaterProfileId(waterProfiles[0]?.id || '');
      setPreInfusionSeconds(5);
      setTargetTotalTimeSeconds(30);
      setTargetTdsPercent(9.5);
      setNotes('');
      setPourStages([]);
      setIsDefault(false);
      setSaveAsNewRevision(true);
      applyPreviousSelectionsForCategory(startingCat);
    }
  }, [recipeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategorySwitch = (newCat: CoffeeCategory) => {
    setCategory(newCat);
    applyPreviousSelectionsForCategory(newCat);
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
      (category === 'espresso' || category === 'manual_lever') && basketBrand && basketBrand !== 'N/A'
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
      waterProfileId: (waterProfileId && waterProfileId !== 'N/A') ? waterProfileId : undefined,
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
      portafilter: (category === 'espresso' || category === 'manual_lever') && portafilter !== 'N/A' ? portafilter : undefined,
      showerScreen: (category === 'espresso' || category === 'manual_lever') && showerScreen !== 'N/A' ? showerScreen : undefined,
      isDefault,
      notes: `${notes} ${machineModel && machineModel !== 'N/A' ? `[Machine: ${machineModel}]` : ''} ${grinderModel && grinderModel !== 'N/A' ? `[Grinder: ${grinderModel}]` : ''} ${
        portafilter && portafilter !== 'N/A' ? `[Portafilter: ${portafilter}]` : ''
      } ${
        showerScreen && showerScreen !== 'N/A' ? `[Shower Screen: ${showerScreen}]` : ''
      } ${
        category === 'filter'
          ? `${dripperModel && dripperModel !== 'N/A' ? `[Dripper: ${dripperModel}]` : ''} ${filterPaperType && filterPaperType !== 'N/A' ? `[Paper: ${filterPaperType}]` : ''}`
          : ''
      }`.trim(),
      tags: [category.replace('_', ' ')],
    };

    // Update last used selections for this category so future workflows start with previous selections
    updateLastUsedTools(category, {
      machineModel,
      grinderModel,
      dripperModel: category === 'filter' ? dripperModel : undefined,
      filterPaperType: category === 'filter' ? filterPaperType : undefined,
      dispersionTool: category === 'filter' ? dispersionTool : undefined,
      waterProfileId,
      basketBrand: (category === 'espresso' || category === 'manual_lever') ? basketBrand : undefined,
      basketSize: (category === 'espresso' || category === 'manual_lever') ? basketSize : undefined,
      basketDiameter: (category === 'espresso' || category === 'manual_lever') ? basketDiameter : undefined,
      portafilter: (category === 'espresso' || category === 'manual_lever') ? portafilter : undefined,
      showerScreen: (category === 'espresso' || category === 'manual_lever') ? showerScreen : undefined,
      tamperTool: (category === 'espresso' || category === 'manual_lever') ? tamperTool : undefined,
      puckScreenTool: (category === 'espresso' || category === 'manual_lever') ? puckScreenTool : undefined,
      wdtTool: (category === 'espresso' || category === 'manual_lever') ? wdtTool : undefined,
      doseGrams,
      yieldGrams,
      waterTempC,
      grindSetting,
      grindMicrons,
    });

    if (recipeToEdit) {
      updateRecipe(recipeToEdit.id, recipeData, saveAsNewRevision);
      if (isDefault) setDefaultRecipeForCategory(category, recipeToEdit.id);
    } else {
      const created = addRecipe(recipeData);
      if (isDefault) setDefaultRecipeForCategory(category, created.id);
    }

    onClose();
  };

  // Recommended tamper calculation
  const recommendedTamper =
    tamperTool === 'N/A'
      ? 'No tamper specified (N/A)'
      : basketDiameter === '58.5mm'
      ? '58.55mm Precision Tamper (Pullman / Normcore / BigStep / MHW-3BOMBER)'
      : basketDiameter === '54mm'
      ? '53.3mm Precision Tamper (Breville 54mm fit)'
      : basketDiameter === '53mm'
      ? '53.0mm Tamper (9Barista standard)'
      : basketDiameter === 'N/A'
      ? 'Standard fit base'
      : `${basketDiameter} matching base`;

  const isPressure = category === 'espresso' || category === 'manual_lever';
  const fieldCls = 'w-full h-12 bg-paper border border-ink px-3 text-[15px] font-semibold text-ink';
  const numCls = 'w-full h-12 bg-paper border border-ink px-3 text-[22px] font-bold num text-ink';
  const checkRow = 'flex items-center gap-3 min-h-[48px] py-2 border-b border-rule text-[14px] font-medium';
  const checkCls = 'w-5 h-5 shrink-0 accent-ink';

  const section = (heading: string, body: React.ReactNode) => (
    <section className="pt-6">
      <h3 className="text-[17px] font-extrabold border-b border-ink pb-1.5 mb-3">{heading}</h3>
      {body}
    </section>
  );

  return (
    <Sheet
      title={recipeToEdit ? 'Edit recipe' : 'New recipe'}
      sub={`${MODES[category].label} · pick from the lists, or tap the pencil to type your own brand or tool.`}
      onClose={onClose}
      footer={
        <div className="w-full max-w-4xl mx-auto flex gap-2.5">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" type="submit" form="recipe-form" className="ml-auto flex-1 sm:flex-none sm:px-10">
            <Save className="w-5 h-5" aria-hidden />
            {recipeToEdit ? 'Save changes' : 'Create recipe'}
          </Btn>
        </div>
      }
    >
      <form id="recipe-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-4">
        {/* Method selector */}
        <div>
          <div className="label-caps mb-2" id="recipe-method-label">Brewing method</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-labelledby="recipe-method-label">
            {[
              { id: 'espresso', label: 'Benchtop Espresso' },
              { id: 'filter', label: 'Modern Filter' },
              { id: 'manual_lever', label: 'Manual Lever' },
              { id: 'moka_stovetop', label: 'Stovetop & Moka' },
              { id: 'singaporean_kopi', label: 'Singaporean Kopi' },
              { id: 'immersion', label: 'Immersion' },
            ].map(item => {
              const m = MODES[item.id as CoffeeCategory];
              const on = category === item.id;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={on}
                  key={item.id}
                  onClick={() => handleCategorySwitch(item.id as CoffeeCategory)}
                  className={`min-h-[48px] px-3 border text-[14px] font-bold text-left flex items-center gap-2.5 ${
                    on ? `${m.bg} ${m.on} border-transparent` : 'bg-paper text-ink border-rule'
                  }`}
                >
                  <i className={`w-3.5 h-3.5 shrink-0 ${m.bg} ${on ? 'border border-current' : ''}`} aria-hidden />
                  <span className="leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title & daily driver */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 items-end pt-5">
          <div className="sm:col-span-2">
            <label htmlFor="recipe-title" className="label-caps block mb-1.5">Recipe title</label>
            <input
              id="recipe-title"
              type="text"
              required
              placeholder="e.g. Morning slayer-profile shot"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={fieldCls}
            />
          </div>

          <label className="flex items-center gap-3 min-h-[48px] px-3 border border-ink text-[14px] font-bold">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={e => setIsDefault(e.target.checked)}
              className={checkCls}
            />
            <Star className={`w-4 h-4 shrink-0 ${isDefault ? 'fill-current' : 'text-mute'}`} aria-hidden />
            <span>Daily driver for {MODES[category].label}</span>
          </label>
        </div>

        {/* Core hardware & water */}
        {section('Rig & water',
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-4">
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

            <SmartDropdownWithOthers
              label="Grinder & Burrs:"
              value={grinderModel}
              onChange={setGrinderModel}
              options={GRINDER_OPTIONS}
              customVariableGroup="grinders"
            />

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
        )}

        {/* METHOD SPECIFIC: Espresso basket & puck preparation */}
        {isPressure && section('Basket & puck prep',
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-4">
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

            <div className="border-y border-rule py-2.5">
              <div className="label-caps">Tamper fit</div>
              <div className="text-[14px] font-semibold mt-0.5">{recommendedTamper}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
              <SmartDropdownWithOthers
                label="Portafilter (Bottomless / Spouted):"
                value={portafilter}
                onChange={setPortafilter}
                options={PORTAFILTER_OPTIONS}
                customVariableGroup="portafilters"
              />
              <SmartDropdownWithOthers
                label="Shower Screen (Pesado / IKAPE / IMS):"
                value={showerScreen}
                onChange={setShowerScreen}
                options={SHOWER_SCREEN_OPTIONS}
                customVariableGroup="shower_screens"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-x-4 border-t border-rule">
              <label className={checkRow}>
                <input type="checkbox" checked={hasBottomPaper} onChange={e => setHasBottomPaper(e.target.checked)} className={checkCls} />
                <span>Bottom basket paper disc</span>
              </label>
              <label className={checkRow}>
                <input type="checkbox" checked={hasFlowControl} onChange={e => setHasFlowControl(e.target.checked)} className={checkCls} />
                <span>Flow control paddle active</span>
              </label>
              <label className={checkRow}>
                <input type="checkbox" checked={hasPreInfusion} onChange={e => setHasPreInfusion(e.target.checked)} className={checkCls} />
                <span>Low-pressure pre-infusion</span>
              </label>
            </div>
          </div>
        )}

        {/* METHOD SPECIFIC: Filter paper & tooling */}
        {category === 'filter' && section('Filter paper & tools',
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4 border-t border-rule">
              <label className={checkRow}>
                <input type="checkbox" checked={usesNegotiator} onChange={e => setUsesNegotiator(e.target.checked)} className={checkCls} />
                <span>Orea Negotiator (no bypass, pleated wall)</span>
              </label>
              <label className={checkRow}>
                <input type="checkbox" checked={hasImmersionValve} onChange={e => setHasImmersionValve(e.target.checked)} className={checkCls} />
                <span>Immersion valve (Switch / Pulsar / Clever)</span>
              </label>
            </div>
          </div>
        )}

        {/* Dose, yield, temp, time, grind */}
        {section('Dose, time & grind',
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4">
              <div>
                <label htmlFor="recipe-dose" className="label-caps block mb-1.5">Dose in (g)</label>
                <input
                  id="recipe-dose"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  required
                  value={doseGrams}
                  onChange={e => setDoseGrams(parseFloat(e.target.value) || 0)}
                  className={numCls}
                />
              </div>
              <div>
                <label htmlFor="recipe-yield" className="label-caps block mb-1.5">Yield out (g)</label>
                <input
                  id="recipe-yield"
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  required
                  value={yieldGrams}
                  onChange={e => setYieldGrams(parseFloat(e.target.value) || 0)}
                  className={numCls}
                />
              </div>
              <div>
                <label htmlFor="recipe-temp" className="label-caps block mb-1.5">Water temp (°C)</label>
                <input
                  id="recipe-temp"
                  type="number"
                  inputMode="decimal"
                  value={waterTempC}
                  onChange={e => setWaterTempC(parseFloat(e.target.value) || 0)}
                  className={numCls}
                />
              </div>
              <div>
                <label htmlFor="recipe-time" className="label-caps block mb-1.5">Target time (s)</label>
                <input
                  id="recipe-time"
                  type="number"
                  inputMode="numeric"
                  value={targetTotalTimeSeconds}
                  onChange={e => setTargetTotalTimeSeconds(parseFloat(e.target.value) || 0)}
                  className={numCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
              <div>
                <label htmlFor="recipe-grind" className="label-caps block mb-1.5">Grind setting</label>
                <input
                  id="recipe-grind"
                  type="text"
                  placeholder="e.g. Fellow Ode 5.1 / Comandante 24"
                  value={grindSetting}
                  onChange={e => setGrindSetting(e.target.value)}
                  className={fieldCls}
                />
              </div>
              <div>
                <label htmlFor="recipe-microns" className="label-caps block mb-1.5">Estimated microns (µm)</label>
                <input
                  id="recipe-microns"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 260 espresso, 650 filter"
                  value={grindMicrons || ''}
                  onChange={e => setGrindMicrons(e.target.value ? parseInt(e.target.value) : undefined)}
                  className={fieldCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pour schedule builder for filter & immersion */}
        {(category === 'filter' || category === 'immersion') && section('Pour stages',
          <div>
            {pourStages.length === 0 && (
              <p className="text-[14px] text-mute pb-1">No stages yet. Add one for each pour.</p>
            )}
            {pourStages.length > 0 && (
              <div className="border-t border-rule">
                {pourStages.map((stage, idx) => (
                  <div key={stage.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 py-2 border-b border-rule">
                    <span className="w-7 shrink-0 text-[18px] font-bold num text-center">{idx + 1}</span>
                    <label className="flex-1 min-w-0">
                      <span className="sr-only">Stage {idx + 1} name</span>
                      <input
                        type="text"
                        value={stage.name}
                        onChange={e => {
                          const updated = [...pourStages];
                          updated[idx].name = e.target.value;
                          setPourStages(updated);
                        }}
                        className="w-full h-11 bg-paper border border-rule px-2.5 text-[14px] font-semibold text-ink"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemovePourStage(stage.id)}
                      className="w-11 h-11 shrink-0 flex items-center justify-center text-bad sm:order-last"
                      aria-label={`Remove ${stage.name}`}
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                    <div className="basis-full sm:basis-auto pl-9 sm:pl-0 flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-[13px] text-mute font-semibold">
                        To
                        <input
                          type="number"
                          inputMode="decimal"
                          value={stage.targetWeightGrams}
                          onChange={e => {
                            const updated = [...pourStages];
                            updated[idx].targetWeightGrams = parseFloat(e.target.value) || 0;
                            setPourStages(updated);
                          }}
                          className="w-20 h-11 bg-paper border border-rule px-2 text-right text-[16px] font-bold num text-ink"
                        />
                        g
                      </label>
                      <label className="flex items-center gap-1.5 text-[13px] text-mute font-semibold">
                        At
                        <input
                          type="number"
                          inputMode="numeric"
                          value={stage.startTimeSeconds}
                          onChange={e => {
                            const updated = [...pourStages];
                            updated[idx].startTimeSeconds = parseInt(e.target.value) || 0;
                            setPourStages(updated);
                          }}
                          className="w-16 h-11 bg-paper border border-rule px-2 text-right text-[16px] font-bold num text-ink"
                        />
                        s
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Btn size="md" className="mt-3" onClick={handleAddPourStage}>
              <Plus className="w-4 h-4" aria-hidden />
              Add stage
            </Btn>
          </div>
        )}

        {/* Notes */}
        {section('Notes',
          <div>
            <label htmlFor="recipe-notes" className="sr-only">Barista notes and preparation steps</label>
            <textarea
              id="recipe-notes"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. WDT thoroughly, 30 lb spring tamp, top puck screen…"
              className="w-full bg-paper border border-ink p-3 text-[15px] text-ink"
            />
          </div>
        )}

        {/* Revision preservation option */}
        {recipeToEdit && (
          <label className="mt-4 flex items-start gap-3 min-h-[48px] p-3 border border-ink">
            <input
              type="checkbox"
              checked={saveAsNewRevision}
              onChange={e => setSaveAsNewRevision(e.target.checked)}
              className={`${checkCls} mt-0.5`}
            />
            <span>
              <b className="block text-[14px]">Save as a new dated revision</b>
              <span className="text-[13px] text-mute">Keeps the original recipe as it is and saves this as a separate, time-stamped entry.</span>
            </span>
          </label>
        )}
      </form>
    </Sheet>
  );
};
