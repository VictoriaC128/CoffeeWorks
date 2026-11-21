import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, History, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeCategory, CategoryToolSelections, SetupChangeLog } from '../types/coffee';
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
import { Btn } from '../brew/ui';
import { MODES, MODE_ORDER } from '../brew/modes';
import { onBack } from '../platform/native';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'discipline' | 'rig' | 'history';

const CATEGORY_CHOICES: Record<CoffeeCategory, { name: string; tagline: string }> = {
  espresso: {
    name: 'Benchtop Espresso',
    tagline: 'Flow control, 30lb spring tampers, MHW-3BOMBER screens, high-extraction baskets',
  },
  filter: {
    name: 'Modern Filter Coffee',
    tagline: 'Orea V4, UFO Dripper, Sibarist FAST, Cafec, Orea Negotiator, porous ceramic',
  },
  manual_lever: {
    name: 'Manual Lever & Portable',
    tagline: 'Flair 58+, Cafelat Robot, Odyssey Argos, Picopresso, CO2 pneumatic machines',
  },
  moka_stovetop: {
    name: 'Stovetop & Moka Pot',
    tagline: '9Barista twin boiler, Bialetti Brikka crema valve, classic Moka express',
  },
  singaporean_kopi: {
    name: 'Singaporean Kopi',
    tagline: 'Traditional flannel sock pull, wok-roasted robusta, condensed & evaporated milk ratios',
  },
  immersion: {
    name: 'Immersion & AeroPress',
    tagline: 'Inverted AeroPress, Prismo / Flow control cap, French press, steep & plunge pacing',
  },
};

const STEPS: { id: Tab; step: string; label: string }[] = [
  { id: 'discipline', step: 'Step 1 of 2', label: 'Discipline' },
  { id: 'rig', step: 'Step 2 of 2', label: 'Rig & tools' },
];

/** Section heading inside the scrolling body: ruled, like Settings. */
const Section: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <section className="mt-6">
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-ink pb-1.5">
      <h3 className="text-[17px] font-extrabold">{title}</h3>
      {note && <span className="text-[12.5px] text-mute">{note}</span>}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-3">{children}</div>
  </section>
);

const historyDetails = (entry: SetupChangeLog): string[] => {
  const s = entry.selections;
  const rows: [string, string | undefined][] = [
    ['Rig', s.machineModel],
    ['Tamper', s.tamperTool],
    ['Portafilter', s.portafilter],
    ['Shower screen', s.showerScreen],
    ['Puck screen', s.puckScreenTool],
  ];
  return rows.filter(([, v]) => v && v !== 'N/A').map(([k, v]) => `${k}: ${v}`);
};

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
  const [activeTab, setActiveTab] = useState<Tab>(isConfigMode ? 'rig' : 'discipline');

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

  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

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

  // Android back: step back through the wizard, close from the first step.
  useEffect(() => {
    if (!isOpen) return;
    return onBack(() => {
      if (activeTab === 'history') setActiveTab('rig');
      else if (activeTab === 'rig') setActiveTab('discipline');
      else closeRef.current();
      return true;
    });
  }, [isOpen, activeTab]);

  // Each step starts at the top.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

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

  const history = userPreferences.setupHistory ?? [];
  const isPuckPrep = selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever';
  const mode = MODES[selectedPrimary];
  const choice = CATEGORY_CHOICES[selectedPrimary];

  return (
    // Phones (and phones held sideways) get the whole screen; tablets get a centred panel.
    <div
      className="fixed inset-0 z-50 flex flex-col [@media(min-width:768px)_and_(min-height:600px)]:items-center [@media(min-width:768px)_and_(min-height:600px)]:justify-center [@media(min-width:768px)_and_(min-height:600px)]:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="absolute inset-0 bg-scrim/40" aria-hidden />

      <div className="relative flex flex-col bg-paper text-ink w-full h-[100dvh] pl-safe pr-safe [@media(min-width:768px)_and_(min-height:600px)]:h-auto [@media(min-width:768px)_and_(min-height:600px)]:max-h-[min(92dvh,920px)] [@media(min-width:768px)_and_(min-height:600px)]:max-w-[760px] [@media(min-width:768px)_and_(min-height:600px)]:border-2 [@media(min-width:768px)_and_(min-height:600px)]:border-ink [@media(min-width:768px)_and_(min-height:600px)]:pl-0 [@media(min-width:768px)_and_(min-height:600px)]:pr-0">
        {/* Header band */}
        <header className="bg-ink text-paper pt-safe [@media(min-width:768px)_and_(min-height:600px)]:pt-0">
          <div className="flex items-start gap-3 px-5 py-4">
            <div className="min-w-0">
              <h2 id="onboarding-title" className="text-[22px] sm:text-[26px] font-black tracking-[-0.02em] leading-tight">
                {isConfigMode ? 'Customise setup & tools' : 'Welcome to CoffeeWorks'}
              </h2>
              <p className="text-[13px] opacity-80 mt-1 leading-snug">
                {isConfigMode
                  ? 'Change your daily driver and tools whenever you like. Each change is saved separately with its date and time.'
                  : 'Pick how you brew most, then the gear you use for it.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto -mr-3 -mt-1 w-12 h-12 shrink-0 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Steps */}
        <nav className="flex border-b border-rule" aria-label="Setup steps">
          {STEPS.map(s => {
            const on = activeTab === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveTab(s.id)}
                aria-current={on ? 'step' : undefined}
                className={`flex-1 min-w-0 min-h-[60px] px-5 pt-2 pb-2.5 text-left border-t-4 ${on ? 'border-ink' : 'border-rule'}`}
              >
                <span className="label-caps block">{s.step}</span>
                <span className={`block text-[15px] truncate ${on ? 'font-extrabold text-ink' : 'font-semibold text-mute'}`}>{s.label}</span>
              </button>
            );
          })}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              aria-current={activeTab === 'history' ? 'page' : undefined}
              className={`shrink-0 min-h-[60px] px-4 flex items-center gap-2 border-l border-rule border-t-4 text-[14px] ${
                activeTab === 'history' ? 'border-t-ink font-extrabold text-ink' : 'border-t-rule font-semibold text-mute'
              }`}
            >
              <History className="w-5 h-5" aria-hidden />
              <span>
                <span className="hidden sm:inline">Revisions </span>
                <span className="num">{history.length}</span>
              </span>
            </button>
          )}
        </nav>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
          {activeTab === 'discipline' && (
            <>
              <h3 className="text-[19px] font-extrabold leading-tight">How do you brew most days?</h3>
              <p className="text-[14px] text-mute mt-1">
                This becomes your daily driver. You can set up the other methods later.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {MODE_ORDER.map(id => {
                  const m = MODES[id];
                  const c = CATEGORY_CHOICES[id];
                  const on = selectedPrimary === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelectCategory(id)}
                      aria-pressed={on}
                      className={`flex text-left min-h-[96px] ${on ? 'border-2 border-ink' : 'border border-rule m-px'}`}
                    >
                      <span className={`w-14 shrink-0 flex items-start justify-center pt-3.5 ${m.bg} ${m.on}`} aria-hidden>
                        {on && <Check className="w-6 h-6" strokeWidth={3} />}
                      </span>
                      <span className="flex-1 min-w-0 px-3.5 py-3">
                        <span className="block text-[16px] font-extrabold leading-tight">{c.name}</span>
                        <span className="block text-[13px] text-mute leading-snug mt-1">{c.tagline}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'rig' && (
            <>
              <div className={`flex items-center gap-3 pl-4 pr-2 py-2 min-h-[72px] ${mode.bg} ${mode.on}`}>
                <div className="min-w-0 flex-1">
                  <div className="text-[19px] font-extrabold leading-tight">{choice.name}</div>
                  <div className="text-[12.5px] opacity-85 leading-snug mt-0.5 line-clamp-2">{choice.tagline}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('discipline')}
                  className="shrink-0 min-h-[48px] px-4 border rule-on text-[14px] font-bold"
                >
                  Change
                </button>
              </div>

              <p className="text-[13px] text-mute mt-3">
                Choose your everyday gear. If a brand or tool is missing, tap Edit labels on that list to add it.
              </p>

              <Section title="Rig">
                <SmartDropdownWithOthers
                  label={selectedPrimary === 'filter' ? 'Primary filter dripper' : 'Daily driver machine / vessel'}
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

                <SmartDropdownWithOthers
                  label="Grinder & burrs"
                  value={grinderChoice}
                  onChange={setGrinderChoice}
                  options={GRINDER_OPTIONS}
                  customVariableGroup="grinders"
                />

                <div className="sm:col-span-2">
                  <SmartDropdownWithOthers
                    label="Default water"
                    value={waterChoice}
                    onChange={setWaterChoice}
                    options={waterProfiles.map(w => ({
                      label: `${w.name} (${w.tdsPpm} ppm)`,
                      value: w.name,
                      group: w.countryRegion,
                    }))}
                    customVariableGroup="waters"
                  />
                </div>
              </Section>

              {isPuckPrep && (
                <Section title="Puck prep & basket" note="MHW-3BOMBER, Normcore, Pullman and more">
                  <div className="sm:col-span-2">
                    <SmartDropdownWithOthers
                      label="Basket"
                      value={basketChoice}
                      onChange={setBasketChoice}
                      options={ESPRESSO_BASKET_OPTIONS}
                      customVariableGroup="baskets"
                    />
                  </div>

                  <SmartDropdownWithOthers
                    label="Tamper"
                    value={tamperChoice}
                    onChange={setTamperChoice}
                    options={TAMPER_OPTIONS}
                    customVariableGroup="tampers"
                  />

                  <SmartDropdownWithOthers
                    label="Puck screen"
                    value={puckScreenChoice}
                    onChange={setPuckScreenChoice}
                    options={PUCK_SCREEN_OPTIONS}
                    customVariableGroup="puck_screens"
                  />

                  <SmartDropdownWithOthers
                    label="Portafilter"
                    value={portafilterChoice}
                    onChange={setPortafilterChoice}
                    options={PORTAFILTER_OPTIONS}
                    customVariableGroup="portafilters"
                  />

                  <SmartDropdownWithOthers
                    label="Shower screen"
                    value={showerScreenChoice}
                    onChange={setShowerScreenChoice}
                    options={SHOWER_SCREEN_OPTIONS}
                    customVariableGroup="shower_screens"
                  />

                  <div className="sm:col-span-2">
                    <SmartDropdownWithOthers
                      label="WDT tool"
                      value={wdtChoice}
                      onChange={setWdtChoice}
                      options={WDT_OPTIONS}
                      customVariableGroup="wdt_tools"
                    />
                  </div>
                </Section>
              )}

              {selectedPrimary === 'filter' && (
                <Section title="Filter paper & pouring">
                  <SmartDropdownWithOthers
                    label="Filter paper"
                    value={filterPaperChoice}
                    onChange={setFilterPaperChoice}
                    options={FILTER_PAPER_OPTIONS}
                    customVariableGroup="papers"
                  />

                  <SmartDropdownWithOthers
                    label="Dispersion & agitation tool"
                    value={dispersionChoice}
                    onChange={setDispersionChoice}
                    options={DISPERSION_OPTIONS}
                    customVariableGroup="dispersions"
                  />
                </Section>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              <h3 className="text-[19px] font-extrabold leading-tight">Setup revisions</h3>
              <p className="text-[14px] text-mute mt-1">
                Every change to your setup is kept, newest first, with its date and time.
              </p>

              <ul className="mt-4 border-t border-ink">
                {history.map(entry => {
                  const m = MODES[entry.category];
                  const details = historyDetails(entry);
                  return (
                    <li key={entry.id} className="border-b border-rule py-3">
                      <div className="flex items-center gap-2.5">
                        <i className={`block w-3.5 h-3.5 shrink-0 ${m?.bg ?? 'bg-ink'}`} aria-hidden />
                        <span className="text-[14px] font-bold">{m?.label ?? entry.category.replace('_', ' ')}</span>
                        <span className="ml-auto text-[12.5px] text-mute num text-right">{entry.formattedDateTime}</span>
                      </div>
                      <p className="text-[14px] mt-1.5 leading-snug">{entry.summary}</p>
                      {details.length > 0 && (
                        <p className="text-[12.5px] text-mute mt-1 leading-snug">{details.join(' · ')}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {/* Footer: Back and the one primary action */}
        <footer className="border-t border-ink pb-safe [@media(min-width:768px)_and_(min-height:600px)]:pb-0">
          <div className="flex gap-2.5 px-5 py-3">
            {activeTab === 'discipline' && (
              <>
                <Btn onClick={onClose}>Close</Btn>
                <Btn variant="primary" className="flex-1 sm:flex-none sm:ml-auto sm:min-w-[240px]" onClick={() => setActiveTab('rig')}>
                  Continue
                  <ChevronRight className="w-5 h-5" aria-hidden />
                </Btn>
              </>
            )}
            {activeTab === 'rig' && (
              <>
                <Btn onClick={() => setActiveTab('discipline')}>
                  <ChevronLeft className="w-5 h-5 -ml-1" aria-hidden />
                  Back
                </Btn>
                <Btn variant="primary" className="flex-1 sm:flex-none sm:ml-auto sm:min-w-[240px]" onClick={handleFinish}>
                  <Check className="w-5 h-5" strokeWidth={2.5} aria-hidden />
                  Save setup
                </Btn>
              </>
            )}
            {activeTab === 'history' && (
              <Btn onClick={() => setActiveTab('rig')}>
                <ChevronLeft className="w-5 h-5 -ml-1" aria-hidden />
                Back to rig
              </Btn>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
