import React, { useState, useEffect } from 'react';
import {
  Coffee,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Scale,
  Droplets,
  X,
  History,
  Sliders,
  ShieldCheck,
  Settings,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeCategory, CategoryToolSelections } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import {
  ESPRESSO_MACHINE_OPTIONS,
  FILTER_DRIPPER_OPTIONS,
  GRINDER_OPTIONS,
  ESPRESSO_BASKET_OPTIONS,
  FILTER_PAPER_OPTIONS,
  DISPERSION_OPTIONS,
  TAMPER_OPTIONS,
  PUCK_SCREEN_OPTIONS,
  WDT_OPTIONS,
  PORTAFILTER_OPTIONS,
  SHOWER_SCREEN_OPTIONS,
} from '../data/dropdownCatalog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CHOICES: {
  id: CoffeeCategory;
  name: string;
  icon: string;
  tagline: string;
}[] = [
  {
    id: 'espresso',
    name: 'Benchtop Espresso',
    icon: '⚡',
    tagline: 'Flow control, 30lb spring tampers, MHW-3BOMBER screens, high-extraction baskets',
  },
  {
    id: 'filter',
    name: 'Modern Filter Coffee',
    icon: '💧',
    tagline: 'Orea V4, UFO Dripper, Sibarist FAST, Cafec, Orea Negotiator, porous ceramic',
  },
  {
    id: 'manual_lever',
    name: 'Manual Lever & Portable',
    icon: '🦾',
    tagline: 'Flair 58+, Cafelat Robot, Odyssey Argos, Picopresso, CO2 pneumatic machines',
  },
  {
    id: 'moka_stovetop',
    name: 'Stovetop & Moka Pot',
    icon: '🔥',
    tagline: '9Barista twin boiler, Bialetti Brikka crema valve, classic Moka express',
  },
  {
    id: 'singaporean_kopi',
    name: 'Singaporean Kopi 🇸🇬',
    icon: '☕',
    tagline: 'Traditional flannel sock pull, wok-roasted robusta, condensed & evaporated milk ratios',
  },
  {
    id: 'immersion',
    name: 'Immersion & AeroPress',
    icon: '⏳',
    tagline: 'Inverted AeroPress, Prismo / Flow control cap, French press, steep & plunge pacing',
  },
];

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    userPreferences,
    setUserPreferences,
    setActiveCategory,
    recipes,
    setSelectedRecipeForBrew,
    waterProfiles,
    updateLastUsedTools,
    getLastUsedTools,
    recordSetupChange,
  } = useCoffee();

  const isConfigMode = userPreferences.hasCompletedOnboarding;
  const [activeTab, setActiveTab] = useState<'discipline' | 'rig' | 'history'>(
    isConfigMode ? 'rig' : 'discipline'
  );

  const [selectedPrimary, setSelectedPrimary] = useState<CoffeeCategory>(
    userPreferences.primaryCategory || 'filter'
  );

  // Setup Selections
  const [machineChoice, setMachineChoice] = useState<string>('Lelit Bianca V3');
  const [grinderChoice, setGrinderChoice] = useState<string>('Option-O Lagom P64');
  const [waterChoice, setWaterChoice] = useState<string>('Singapore PUB Tap Water (Ultra-Soft)');
  const [basketChoice, setBasketChoice] = useState<string>('MHW-3BOMBER DEX / Sniper High-Flow Basket (58.5mm)');
  const [portafilterChoice, setPortafilterChoice] = useState<string>('MHW-3BOMBER 58mm Bottomless');
  const [showerScreenChoice, setShowerScreenChoice] = useState<string>('Pesado High-Extraction Screen');
  const [tamperChoice, setTamperChoice] = useState<string>('MHW-3BOMBER Flash Constant Pressure Tamper (30 lbs / Auto-Leveling)');
  const [puckScreenChoice, setPuckScreenChoice] = useState<string>('0.8mm MHW-3BOMBER Titanium Coated Contact Puck Screen');
  const [wdtChoice, setWdtChoice] = useState<string>('MHW-3BOMBER Cyclone Needle WDT Tool (0.25mm / 0.4mm Needles)');
  const [filterPaperChoice, setFilterPaperChoice] = useState<string>('Sibarist FAST Flat');
  const [dispersionChoice, setDispersionChoice] = useState<string>('Kettle Direct Pour');

  // Load category previous selections
  const loadSelectionsForCategory = (cat: CoffeeCategory) => {
    const prev = getLastUsedTools(cat);
    if (prev) {
      if (prev.machineModel) setMachineChoice(prev.machineModel);
      if (prev.grinderModel) setGrinderChoice(prev.grinderModel);
      if (prev.waterProfileId) {
        const matchingWater = waterProfiles.find(w => w.id === prev.waterProfileId);
        if (matchingWater) setWaterChoice(matchingWater.name);
      }
      if (prev.basketBrand) setBasketChoice(prev.basketBrand);
      if (prev.portafilter) setPortafilterChoice(prev.portafilter);
      if (prev.showerScreen) setShowerScreenChoice(prev.showerScreen);
      if (prev.tamperTool) setTamperChoice(prev.tamperTool);
      if (prev.puckScreenTool) setPuckScreenChoice(prev.puckScreenTool);
      if (prev.wdtTool) setWdtChoice(prev.wdtTool);
      if (prev.dripperModel) setMachineChoice(prev.dripperModel);
      if (prev.filterPaperType) setFilterPaperChoice(prev.filterPaperType);
      if (prev.dispersionTool) setDispersionChoice(prev.dispersionTool);
      return;
    }

    // Category default fallbacks
    if (cat === 'espresso') {
      setMachineChoice('Lelit Bianca V3');
      setGrinderChoice('Option-O Lagom P64');
      setBasketChoice('MHW-3BOMBER DEX / Sniper High-Flow Basket (58.5mm)');
      setPortafilterChoice('MHW-3BOMBER 58mm Bottomless');
      setShowerScreenChoice('Pesado High-Extraction Screen');
      setTamperChoice('MHW-3BOMBER Flash Constant Pressure Tamper (30 lbs / Auto-Leveling)');
      setPuckScreenChoice('0.8mm MHW-3BOMBER Titanium Coated Contact Puck Screen');
      setWdtChoice('MHW-3BOMBER Cyclone Needle WDT Tool (0.25mm / 0.4mm Needles)');
    } else if (cat === 'filter') {
      setMachineChoice('Orea V4 Modular (Apex Base)');
      setGrinderChoice('Fellow Ode Gen 2');
      setFilterPaperChoice('Sibarist FAST Flat');
      setDispersionChoice('Kettle Direct Pour');
    } else if (cat === 'manual_lever') {
      setMachineChoice('Flair 58+ Heated Chamber');
      setGrinderChoice('Zerno Z1');
      setBasketChoice('Weber Workshops Unibasket');
      setPortafilterChoice('Flair 58 Bottomless');
      setShowerScreenChoice('IMS E61 200 IM');
      setTamperChoice('MHW-3BOMBER Flash Constant Pressure Tamper (30 lbs / Auto-Leveling)');
      setPuckScreenChoice('0.8mm MHW-3BOMBER Titanium Coated Contact Puck Screen');
    } else if (cat === 'moka_stovetop') {
      setMachineChoice('9Barista Twin Boiler 9-Bar Stovetop');
      setGrinderChoice('1Zpresso J-Ultra');
    } else if (cat === 'singaporean_kopi') {
      setMachineChoice('Long-Spout Stainless Kettle + Flannel Cloth Sock');
      setGrinderChoice('Commercial Coarse Roller Mill / Mortar Grind');
    } else {
      setMachineChoice('AeroPress Clear + Flow Control Cap');
      setGrinderChoice('Baratza Encore ESP');
    }
  };

  useEffect(() => {
    if (isOpen) {
      const currentCat = userPreferences.primaryCategory || 'espresso';
      setSelectedPrimary(currentCat);
      loadSelectionsForCategory(currentCat);
      setActiveTab(userPreferences.hasCompletedOnboarding ? 'rig' : 'discipline');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: CoffeeCategory) => {
    setSelectedPrimary(cat);
    loadSelectionsForCategory(cat);
    setActiveTab('rig');
  };

  const handleFinish = () => {
    const toolSelections: CategoryToolSelections = {
      machineModel: machineChoice,
      grinderModel: grinderChoice,
      dripperModel: selectedPrimary === 'filter' ? machineChoice : undefined,
      filterPaperType: selectedPrimary === 'filter' ? filterPaperChoice : undefined,
      dispersionTool: selectedPrimary === 'filter' ? dispersionChoice : undefined,
      waterProfileId: waterProfiles.find(w => w.name === waterChoice)?.id || 'water-pub-tap',
      basketBrand: (selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') ? basketChoice : undefined,
      portafilter: (selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') ? portafilterChoice : undefined,
      showerScreen: (selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') ? showerScreenChoice : undefined,
      tamperTool: (selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') ? tamperChoice : undefined,
      puckScreenTool: (selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') ? puckScreenChoice : undefined,
      wdtTool: (selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') ? wdtChoice : undefined,
    };

    // Save previous selections for this category
    updateLastUsedTools(selectedPrimary, toolSelections);

    // Save dated and time-stamped setup change log entry without override
    recordSetupChange(
      selectedPrimary,
      `Configured rig & tools for ${selectedPrimary.replace('_', ' ')}: ${machineChoice} + ${grinderChoice}`,
      toolSelections
    );

    // Update user preferences
    const matchingRecipe = recipes.find(r => r.category === selectedPrimary) || recipes[0];
    setUserPreferences(prev => ({
      ...prev,
      primaryCategory: selectedPrimary,
      hasCompletedOnboarding: true,
      defaultRecipePerCategory: {
        ...prev.defaultRecipePerCategory,
        [selectedPrimary]: matchingRecipe ? matchingRecipe.id : prev.defaultRecipePerCategory[selectedPrimary],
      },
    }));

    setActiveCategory(selectedPrimary);
    if (matchingRecipe) {
      setSelectedRecipeForBrew(matchingRecipe);
    }

    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-6 relative">
        {/* Top Header & Close button */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-950/50">
              <Settings className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isConfigMode ? 'Customise Setup & Rig Settings' : 'Welcome to CoffeeWorks'}
              </h2>
              <p className="text-[11px] text-stone-400">
                {isConfigMode
                  ? 'Update your default daily driver and tools at any time. Changes are saved separately & timestamped.'
                  : 'Configure your primary brewing discipline and initial rig selections.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 border-b border-stone-800/80 pt-3 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('discipline')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'discipline'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            1. Coffee Discipline
          </button>
          <button
            onClick={() => setActiveTab('rig')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'rig'
                ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            2. Rig & Tools Setup
          </button>
          {userPreferences.setupHistory && userPreferences.setupHistory.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${
                activeTab === 'history'
                  ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/40'
                  : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Revisions ({userPreferences.setupHistory.length})</span>
            </button>
          )}
        </div>

        {/* TAB 1: Coffee Discipline Selection */}
        {activeTab === 'discipline' && (
          <div className="space-y-4 pt-4">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Select Your Coffee Discipline</h3>
              <p className="text-xs text-stone-400">
                Choose your go-to brewing style to customize its machines and precision accessories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {CATEGORY_CHOICES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group hover:border-amber-500/80 hover:bg-stone-800/80 ${
                    selectedPrimary === cat.id
                      ? 'bg-amber-600/10 border-amber-500 shadow-lg shadow-amber-950/40'
                      : 'bg-stone-950/70 border-stone-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('rig')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
              >
                <span>Continue to Rig Config</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Rig & Precision Tools Setup */}
        {activeTab === 'rig' && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Active Method: {selectedPrimary.replace('_', ' ').toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Configure Rig & Precision Accessories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('discipline')}
                className="text-xs text-stone-400 hover:text-white underline font-mono"
              >
                Switch Method
              </button>
            </div>

            <p className="text-xs text-stone-400">
              Select your daily setup. Click <strong className="text-amber-400 font-mono">"Edit labels"</strong> on any dropdown to add minority brands or custom tools.
            </p>

            <div className="space-y-3.5 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 max-h-[380px] overflow-y-auto pr-1">
              {/* Machine or Dripper */}
              <SmartDropdownWithOthers
                label={
                  selectedPrimary === 'filter'
                    ? 'Primary Filter Dripper:'
                    : 'Daily Driver Machine / Vessel:'
                }
                value={machineChoice}
                onChange={setMachineChoice}
                options={
                  selectedPrimary === 'espresso'
                    ? ESPRESSO_MACHINE_OPTIONS
                    : selectedPrimary === 'filter'
                    ? FILTER_DRIPPER_OPTIONS
                    : [
                        { label: 'Flair 58+ Heated Chamber Lever', value: 'Flair 58+' },
                        { label: 'Cafelat Robot Dual Lever', value: 'Cafelat Robot' },
                        { label: 'Odyssey Espresso Argos Hybrid', value: 'Odyssey Argos' },
                        { label: '9Barista Twin Boiler 9-Bar Stovetop', value: '9Barista Stovetop' },
                        { label: 'Bialetti Brikka Crema Valve', value: 'Bialetti Brikka' },
                        { label: 'Classic Bialetti Moka Express', value: 'Bialetti Moka' },
                        { label: 'Long-Spout Stainless Kettle + Flannel Cloth Sock', value: 'Cloth Sock Pull' },
                        { label: 'AeroPress Clear + Flow Control Cap', value: 'AeroPress Clear' },
                        { label: 'AeroPress Inverted World Champion', value: 'AeroPress Inverted' },
                      ]
                }
                customVariableGroup="machines"
              />

              {/* Grinder */}
              <SmartDropdownWithOthers
                label="Primary Grinder & Burrs:"
                value={grinderChoice}
                onChange={setGrinderChoice}
                options={GRINDER_OPTIONS}
                customVariableGroup="grinders"
              />

              {/* Water Profile */}
              <SmartDropdownWithOthers
                label="Default Water Chemistry:"
                value={waterChoice}
                onChange={setWaterChoice}
                options={waterProfiles.map(w => ({
                  label: `${w.name} (${w.tdsPpm} ppm)`,
                  value: w.name,
                  group: w.countryRegion,
                }))}
                customVariableGroup="waters"
              />

              {/* Espresso & Lever Specific Precision Puck Tools (Includes MHW-3BOMBER) */}
              {(selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever') && (
                <div className="pt-2 border-t border-stone-800/80 space-y-3">
                  <span className="text-[11px] font-mono font-bold text-amber-400 block uppercase tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Puck Prep & Basket Suite (MHW-3BOMBER, Normcore, Pullman)</span>
                  </span>

                  <SmartDropdownWithOthers
                    label="Precision Basket Model:"
                    value={basketChoice}
                    onChange={setBasketChoice}
                    options={ESPRESSO_BASKET_OPTIONS}
                    customVariableGroup="baskets"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SmartDropdownWithOthers
                      label="Calibrated Tamper:"
                      value={tamperChoice}
                      onChange={setTamperChoice}
                      options={TAMPER_OPTIONS}
                      customVariableGroup="tampers"
                    />

                    <SmartDropdownWithOthers
                      label="Puck Screen:"
                      value={puckScreenChoice}
                      onChange={setPuckScreenChoice}
                      options={PUCK_SCREEN_OPTIONS}
                      customVariableGroup="puck_screens"
                    />
                  </div>

                  {/* Portafilter & Shower Screen Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SmartDropdownWithOthers
                      label="Portafilter (Bottomless / Spouted):"
                      value={portafilterChoice}
                      onChange={setPortafilterChoice}
                      options={PORTAFILTER_OPTIONS}
                      customVariableGroup="portafilters"
                    />

                    <SmartDropdownWithOthers
                      label="Shower Screen (Pesado / IKAPE / IMS):"
                      value={showerScreenChoice}
                      onChange={setShowerScreenChoice}
                      options={SHOWER_SCREEN_OPTIONS}
                      customVariableGroup="shower_screens"
                    />
                  </div>

                  <SmartDropdownWithOthers
                    label="Needle WDT Tool:"
                    value={wdtChoice}
                    onChange={setWdtChoice}
                    options={WDT_OPTIONS}
                    customVariableGroup="wdt_tools"
                  />
                </div>
              )}

              {/* Filter Specific Media Tools */}
              {selectedPrimary === 'filter' && (
                <div className="pt-2 border-t border-stone-800/80 space-y-3">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 block uppercase tracking-wider flex items-center space-x-1">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Filter Media & Dispersion Synergy</span>
                  </span>

                  <SmartDropdownWithOthers
                    label="Filter Paper Media:"
                    value={filterPaperChoice}
                    onChange={setFilterPaperChoice}
                    options={FILTER_PAPER_OPTIONS}
                    customVariableGroup="papers"
                  />

                  <SmartDropdownWithOthers
                    label="Dispersion & Agitation Tool:"
                    value={dispersionChoice}
                    onChange={setDispersionChoice}
                    options={DISPERSION_OPTIONS}
                    customVariableGroup="dispersions"
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('discipline')}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Setup & Apply</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Setup Revisions History */}
        {activeTab === 'history' && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-amber-500" />
                  <span>Setup Revision History</span>
                </h3>
                <p className="text-xs text-stone-400">
                  All configuration updates are preserved separately with full date and time stamps.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {userPreferences.setupHistory?.map(entry => (
                <div
                  key={entry.id}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-bold uppercase">
                      {entry.category.replace('_', ' ')}
                    </span>
                    <span className="text-stone-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      <span>{entry.formattedDateTime}</span>
                    </span>
                  </div>
                  <p className="text-stone-200 font-sans text-xs">{entry.summary}</p>
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-400 pt-1 border-t border-stone-800/60">
                    {entry.selections.machineModel && entry.selections.machineModel !== 'N/A' && (
                      <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                        Rig: {entry.selections.machineModel}
                      </span>
                    )}
                    {entry.selections.tamperTool && entry.selections.tamperTool !== 'N/A' && (
                      <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                        Tamp: {entry.selections.tamperTool}
                      </span>
                    )}
                    {entry.selections.portafilter && entry.selections.portafilter !== 'N/A' && (
                      <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                        PF: {entry.selections.portafilter}
                      </span>
                    )}
                    {entry.selections.showerScreen && entry.selections.showerScreen !== 'N/A' && (
                      <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                        Screen: {entry.selections.showerScreen}
                      </span>
                    )}
                    {entry.selections.puckScreenTool && entry.selections.puckScreenTool !== 'N/A' && (
                      <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                        Screen: {entry.selections.puckScreenTool}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('rig')}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium"
              >
                Back to Rig Config
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
