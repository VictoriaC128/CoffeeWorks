import React, { useState } from 'react';
import { Coffee, CheckCircle2, Sparkles, ChevronRight, Scale, Droplets } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeCategory } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import {
  ESPRESSO_MACHINE_OPTIONS,
  FILTER_DRIPPER_OPTIONS,
  GRINDER_OPTIONS,
  ESPRESSO_BASKET_OPTIONS,
  FILTER_PAPER_OPTIONS,
  DISPERSION_OPTIONS,
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
    tagline: 'Flow control, 30lb spring tampers, billet puck screens, high-extraction baskets',
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
  } = useCoffee();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPrimary, setSelectedPrimary] = useState<CoffeeCategory>(
    userPreferences.primaryCategory || 'filter'
  );

  // Default Rig fields
  const [machineChoice, setMachineChoice] = useState<string>('Orea V4 Modular (Apex Base)');
  const [grinderChoice, setGrinderChoice] = useState<string>('Fellow Ode Gen 2');
  const [waterChoice, setWaterChoice] = useState<string>('Singapore PUB Tap Water (Ultra-Soft)');
  const [toolChoice, setToolChoice] = useState<string>('Sibarist FAST Flat Filters');

  if (!isOpen) return null;

  const handleSelectCategory = (cat: CoffeeCategory) => {
    setSelectedPrimary(cat);
    if (cat === 'espresso') {
      setMachineChoice('Lelit Bianca V3 (Paddle Needle Valve)');
      setGrinderChoice('Option-O Lagom P64');
      setToolChoice('WAFO Spirit (Hyper-Dense Laser Matrix)');
    } else if (cat === 'filter') {
      setMachineChoice('Orea V4 Modular (Apex Base)');
      setGrinderChoice('Fellow Ode Gen 2');
      setToolChoice('Sibarist FAST Flat (Low Bypass / Zero Fines Clogging)');
    } else if (cat === 'manual_lever') {
      setMachineChoice('Flair 58+ (Electric Heated Chamber)');
      setGrinderChoice('Zerno Z1');
      setToolChoice('Weber Workshops Unibasket (CNC Zero Deadzone)');
    } else if (cat === 'moka_stovetop') {
      setMachineChoice('9Barista Twin Boiler 9-Bar Stovetop');
      setGrinderChoice('1Zpresso J-Ultra');
      setToolChoice('9Barista 53mm Precision Stovetop Basket');
    } else if (cat === 'singaporean_kopi') {
      setMachineChoice('Long-Spout Stainless Kettle + Flannel Cloth Sock');
      setGrinderChoice('Commercial Coarse Roller Mill / Mortar Grind');
      setToolChoice('Cotton Flannel Pull Sock & Straining Pot');
    } else {
      setMachineChoice('AeroPress Clear + Flow Control Cap');
      setGrinderChoice('Baratza Encore ESP');
      setToolChoice('AeroPress Prismo Flow Control Valve & Metal Disc');
    }
    setStep(2);
  };

  const handleFinish = () => {
    // Find first recipe matching primary category to set as default
    const matchingRecipe = recipes.find(r => r.category === selectedPrimary) || recipes[0];

    setUserPreferences({
      primaryCategory: selectedPrimary,
      hasCompletedOnboarding: true,
      defaultRecipePerCategory: {
        ...userPreferences.defaultRecipePerCategory,
        [selectedPrimary]: matchingRecipe.id,
      },
    });

    setActiveCategory(selectedPrimary);
    if (matchingRecipe) {
      setSelectedRecipeForBrew(matchingRecipe);
    }

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-6">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-950/60 mb-2">
                <Coffee className="w-6 h-6 text-stone-950" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Welcome to CoffeeWorks
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
                What is your go-to coffee discipline? Choose your main choice to set as your default starting station.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {CATEGORY_CHOICES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group hover:border-amber-500/80 hover:bg-stone-800/80 ${
                    selectedPrimary === cat.id
                      ? 'bg-amber-600/10 border-amber-500 shadow-lg shadow-amber-950/40'
                      : 'bg-stone-950/70 border-stone-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
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
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Step 2 of 2 • Customize Your Daily Driver
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Configure Your Default Setup
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Whenever you open CoffeeWorks, your workspace will load this setup ready for instant 1-tap dial-in. Click <strong className="text-amber-400 font-mono">"Edit labels"</strong> on any dropdown to key in minority brands of machines, custom water chemistry, or boutique tools.
              </p>
            </div>

            <div className="space-y-4 bg-stone-950/60 p-5 rounded-2xl border border-stone-800">
              <SmartDropdownWithOthers
                label="Daily Driver Machine / Dripper:"
                value={machineChoice}
                onChange={setMachineChoice}
                options={
                  selectedPrimary === 'espresso'
                    ? ESPRESSO_MACHINE_OPTIONS
                    : selectedPrimary === 'filter'
                    ? FILTER_DRIPPER_OPTIONS
                    : [
                        { label: 'Flair 58+ Lever', value: 'Flair 58+ Lever' },
                        { label: '9Barista Stovetop', value: '9Barista Stovetop' },
                        { label: 'Flannel Cloth Sock & Kettle', value: 'Flannel Cloth Sock & Kettle' },
                        { label: 'AeroPress Clear', value: 'AeroPress Clear' },
                      ]
                }
                customVariableGroup="machines"
              />

              <SmartDropdownWithOthers
                label="Primary Grinder & Burrs:"
                value={grinderChoice}
                onChange={setGrinderChoice}
                options={GRINDER_OPTIONS}
                customVariableGroup="grinders"
              />

              <SmartDropdownWithOthers
                label="Default Water Profile:"
                value={waterChoice}
                onChange={setWaterChoice}
                options={waterProfiles.map(w => ({
                  label: `${w.name} (${w.tdsPpm} ppm)`,
                  value: w.name,
                  group: w.countryRegion,
                }))}
                customVariableGroup="waters"
              />

              <SmartDropdownWithOthers
                label={
                  selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever'
                    ? 'Default Precision Basket & Tools:'
                    : selectedPrimary === 'filter'
                    ? 'Default Filter Paper & Media Tools:'
                    : 'Default Brewing & Dispersion Tools:'
                }
                value={toolChoice}
                onChange={setToolChoice}
                options={
                  selectedPrimary === 'espresso' || selectedPrimary === 'manual_lever'
                    ? ESPRESSO_BASKET_OPTIONS
                    : selectedPrimary === 'filter'
                    ? FILTER_PAPER_OPTIONS
                    : DISPERSION_OPTIONS
                }
                customVariableGroup="tools"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                ← Back to Categories
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-950/50 transition-all scale-105"
              >
                <span>Save & Enter CoffeeWorks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
