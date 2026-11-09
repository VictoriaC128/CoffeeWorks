import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Bean,
  GearProfile,
  WaterProfile,
  Recipe,
  BrewSession,
  CoffeeCategory,
  UserPreferences,
} from '../types/coffee';
import { PRESET_BEANS } from '../data/presetBeans';
import { PRESET_GEARS } from '../data/presetGear';
import { PRESET_WATER_PROFILES } from '../data/presetWater';
import { DEFAULT_RECIPES } from '../data/defaultRecipes';

interface CoffeeContextType {
  activeCategory: CoffeeCategory | 'all';
  setActiveCategory: (cat: CoffeeCategory | 'all') => void;

  userPreferences: UserPreferences;
  setUserPreferences: (prefs: UserPreferences) => void;
  setDefaultRecipeForCategory: (cat: CoffeeCategory, recipeId: string) => void;

  customVariables: Record<string, string[]>;
  addCustomVariable: (group: string, label: string) => void;
  
  beans: Bean[];
  gearProfiles: GearProfile[];
  waterProfiles: WaterProfile[];
  recipes: Recipe[];
  sessions: BrewSession[];

  // Selected Recipe for brewing
  selectedRecipeForBrew: Recipe | null;
  setSelectedRecipeForBrew: (recipe: Recipe | null) => void;

  // Bean CRUD
  addBean: (bean: Omit<Bean, 'id'>) => Bean;
  updateBean: (id: string, updates: Partial<Bean>) => void;
  deleteBean: (id: string) => void;

  // Gear CRUD
  addGear: (gear: Omit<GearProfile, 'id'>) => GearProfile;
  updateGear: (id: string, updates: Partial<GearProfile>) => void;
  deleteGear: (id: string) => void;

  // Water CRUD
  addWaterProfile: (water: Omit<WaterProfile, 'id'>) => WaterProfile;
  updateWaterProfile: (id: string, updates: Partial<WaterProfile>) => void;
  deleteWaterProfile: (id: string) => void;

  // Recipe CRUD
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Recipe;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  duplicateRecipe: (id: string, newTitle?: string) => Recipe;

  // Session Logging
  logBrewSession: (session: Omit<BrewSession, 'id' | 'timestamp'>) => BrewSession;
  deleteSession: (id: string) => void;

  // Calculations
  calculateExtractionYield: (dose: number, yieldAmount: number, tdsPercent: number) => number;
  calculateFlowRate: (yieldAmount: number, seconds: number) => number;
  getDialInAdvice: (
    category: CoffeeCategory,
    timeSeconds: number,
    targetTimeSeconds: number,
    flowRateGs: number,
    targetFlowRateGs: number | undefined,
    eyPercent?: number,
    verdict?: string
  ) => string[];

  // Export & Import
  exportDataAsJSON: () => string;
  importDataFromJSON: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  BEANS: 'coffeeworks_beans_v2',
  GEAR: 'coffeeworks_gear_v2',
  WATER: 'coffeeworks_water_v2',
  RECIPES: 'coffeeworks_recipes_v2',
  SESSIONS: 'coffeeworks_sessions_v2',
  PREFERENCES: 'coffeeworks_preferences_v2',
  CUSTOM_VARS: 'coffeeworks_custom_vars_v2',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  primaryCategory: 'filter',
  defaultRecipePerCategory: {
    espresso: 'recipe-espresso-modern-flow',
    manual_lever: 'recipe-lever-flair-pressure-profile',
    moka_stovetop: 'recipe-moka-9barista-crema',
    filter: 'recipe-filter-orea-apex-fast',
    immersion: 'recipe-aeropress-inverted-championship',
    singaporean_kopi: 'recipe-kopi-singaporean-gao',
  },
  hasCompletedOnboarding: false,
};

const CoffeeContext = createContext<CoffeeContextType | undefined>(undefined);

export const CoffeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState<CoffeeCategory | 'all'>('all');

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const [customVariables, setCustomVariables] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_VARS);
    return saved ? JSON.parse(saved) : {};
  });

  // Persistent States
  const [beans, setBeans] = useState<Bean[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BEANS);
    return saved ? JSON.parse(saved) : PRESET_BEANS;
  });

  const [gearProfiles, setGearProfiles] = useState<GearProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GEAR);
    return saved ? JSON.parse(saved) : PRESET_GEARS;
  });

  const [waterProfiles, setWaterProfiles] = useState<WaterProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER);
    return saved ? JSON.parse(saved) : PRESET_WATER_PROFILES;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECIPES);
    return saved ? JSON.parse(saved) : DEFAULT_RECIPES;
  });

  const [sessions, setSessions] = useState<BrewSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedRecipeForBrew, setSelectedRecipeForBrew] = useState<Recipe | null>(() => {
    const prefCat = userPreferences.primaryCategory || 'filter';
    const defId = userPreferences.defaultRecipePerCategory[prefCat];
    return recipes.find(r => r.id === defId) || recipes[0];
  });

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(userPreferences));
  }, [userPreferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VARS, JSON.stringify(customVariables));
  }, [customVariables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BEANS, JSON.stringify(beans));
  }, [beans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEAR, JSON.stringify(gearProfiles));
  }, [gearProfiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(waterProfiles));
  }, [waterProfiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  // When active category switches, load default recipe for that category if applicable
  const handleSetActiveCategory = (cat: CoffeeCategory | 'all') => {
    setActiveCategory(cat);
    if (cat !== 'all') {
      const defaultRecipeId = userPreferences.defaultRecipePerCategory[cat];
      const match = recipes.find(r => r.id === defaultRecipeId) || recipes.find(r => r.category === cat);
      if (match) {
        setSelectedRecipeForBrew(match);
      }
    }
  };

  const setDefaultRecipeForCategory = (cat: CoffeeCategory, recipeId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      defaultRecipePerCategory: {
        ...prev.defaultRecipePerCategory,
        [cat]: recipeId,
      },
    }));
  };

  const addCustomVariable = (group: string, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setCustomVariables(prev => {
      const existing = prev[group] || [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        [group]: [trimmed, ...existing],
      };
    });
  };

  // Bean Actions
  const addBean = (beanData: Omit<Bean, 'id'>) => {
    const newBean: Bean = { ...beanData, id: `bean-${Date.now()}` };
    setBeans(prev => [newBean, ...prev]);
    return newBean;
  };

  const updateBean = (id: string, updates: Partial<Bean>) => {
    setBeans(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBean = (id: string) => {
    setBeans(prev => prev.filter(b => b.id !== id));
  };

  // Gear Actions
  const addGear = (gearData: Omit<GearProfile, 'id'>) => {
    const newGear: GearProfile = { ...gearData, id: `gear-${Date.now()}` };
    setGearProfiles(prev => [newGear, ...prev]);
    return newGear;
  };

  const updateGear = (id: string, updates: Partial<GearProfile>) => {
    setGearProfiles(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGear = (id: string) => {
    setGearProfiles(prev => prev.filter(g => g.id !== id));
  };

  // Water Actions
  const addWaterProfile = (waterData: Omit<WaterProfile, 'id'>) => {
    const newWater: WaterProfile = { ...waterData, id: `water-${Date.now()}` };
    setWaterProfiles(prev => [newWater, ...prev]);
    return newWater;
  };

  const updateWaterProfile = (id: string, updates: Partial<WaterProfile>) => {
    setWaterProfiles(prev => prev.map(w => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWaterProfile = (id: string) => {
    setWaterProfiles(prev => prev.filter(w => w.id !== id));
  };

  // Recipe Actions
  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newRecipe: Recipe = {
      ...recipeData,
      id: `recipe-${Date.now()}`,
      createdAt: dateStr,
      updatedAt: dateStr,
    };
    setRecipes(prev => [newRecipe, ...prev]);

    // If marked as default or first recipe in category, set as default
    if (newRecipe.isDefault || !userPreferences.defaultRecipePerCategory[newRecipe.category]) {
      setDefaultRecipeForCategory(newRecipe.category, newRecipe.id);
    }

    return newRecipe;
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    setRecipes(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates, updatedAt: dateStr } : r))
    );
    if (updates.isDefault && updates.category) {
      setDefaultRecipeForCategory(updates.category, id);
    }
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const duplicateRecipe = (id: string, newTitle?: string) => {
    const original = recipes.find(r => r.id === id);
    if (!original) throw new Error('Recipe not found');
    const dateStr = new Date().toISOString().split('T')[0];
    const forked: Recipe = {
      ...original,
      id: `recipe-${Date.now()}`,
      title: newTitle || `${original.title} (Customized)`,
      isDefault: false,
      createdAt: dateStr,
      updatedAt: dateStr,
    };
    setRecipes(prev => [forked, ...prev]);
    return forked;
  };

  // Session Logging
  const logBrewSession = (sessionData: Omit<BrewSession, 'id' | 'timestamp'>) => {
    const newSession: BrewSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Calculations
  const calculateExtractionYield = (dose: number, yieldAmount: number, tdsPercent: number) => {
    if (!dose || dose <= 0) return 0;
    return Number(((yieldAmount * tdsPercent) / dose).toFixed(2));
  };

  const calculateFlowRate = (yieldAmount: number, seconds: number) => {
    if (!seconds || seconds <= 0) return 0;
    return Number((yieldAmount / seconds).toFixed(2));
  };

  // Dial-in Diagnostic Engine
  const getDialInAdvice = (
    category: CoffeeCategory,
    timeSeconds: number,
    targetTimeSeconds: number,
    flowRateGs: number,
    targetFlowRateGs: number | undefined,
    eyPercent?: number,
    verdict?: string
  ): string[] => {
    const advice: string[] = [];

    // Flow rate evaluation
    if (targetFlowRateGs && flowRateGs > targetFlowRateGs * 1.25) {
      advice.push('Flow rate is substantially faster than target (+25%). Suggest grinding finer or increasing dose.');
    } else if (targetFlowRateGs && flowRateGs < targetFlowRateGs * 0.75) {
      advice.push('Flow rate is restricted (-25%). Check for bed stalling or puck channelling; suggest grinding coarser.');
    }

    // Time evaluation
    if (timeSeconds < targetTimeSeconds - 6) {
      advice.push('Brew finished prematurely. If sour or vegetal, extend pre-infusion/bloom or grind finer.');
    } else if (timeSeconds > targetTimeSeconds + 10) {
      advice.push('Brew prolonged significantly. If dry, astringent, or bitter, coarsen grind setting.');
    }

    // Extraction Yield evaluation
    if (eyPercent !== undefined && eyPercent > 0) {
      if (eyPercent < 18.0) {
        advice.push(`Under-extracted (${eyPercent}% EY). Increase water temperature, grind finer, or increase beverage yield ratio.`);
      } else if (eyPercent >= 18.5 && eyPercent <= 22.0) {
        advice.push(`Excellent extraction balance (${eyPercent}% EY) in the specialty sweet spot!`);
      } else if (eyPercent > 22.0) {
        advice.push(`High extraction (${eyPercent}% EY). Perfect for precision baskets (Wafo/Unibasket) and clean burrs; ensure no astringent finish.`);
      }
    }

    // Sensory Verdict cues
    if (verdict === 'under_extracted') {
      advice.push('Sour, grassy, or sharp acidity: Grind 1-2 steps finer, raise water temp by 1-2°C, or extend pre-infusion.');
    } else if (verdict === 'over_extracted') {
      advice.push('Harsh, bitter, dry finish: Grind 1-2 steps coarser, reduce water temp by 1-2°C, or shorten yield ratio.');
    } else if (verdict === 'channeling') {
      if (category === 'espresso' || category === 'manual_lever') {
        advice.push('Channelling detected: Inspect needle WDT technique, ensure level 30lb tamping, or use a 0.2mm billet puck screen.');
      } else {
        advice.push('Channel bypass detected: Use the Orea Negotiator tool to shape flat filter papers against dripper walls or pour with a Melodrip.');
      }
    } else if (verdict === 'stalled') {
      advice.push('Filter bed stalled: Excessive fines migration. Use fast-flow papers (Sibarist FAST), coarsen grind, or sift fines.');
    }

    if (advice.length === 0) {
      advice.push('Extraction metrics align cleanly with baseline targets. Savor the cup!');
    }

    return advice;
  };

  // Export / Import
  const exportDataAsJSON = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      userPreferences,
      customVariables,
      beans,
      gearProfiles,
      waterProfiles,
      recipes,
      sessions,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.userPreferences) setUserPreferences(data.userPreferences);
      if (data.customVariables) setCustomVariables(data.customVariables);
      if (data.beans) setBeans(data.beans);
      if (data.gearProfiles) setGearProfiles(data.gearProfiles);
      if (data.waterProfiles) setWaterProfiles(data.waterProfiles);
      if (data.recipes) setRecipes(data.recipes);
      if (data.sessions) setSessions(data.sessions);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setUserPreferences(DEFAULT_PREFERENCES);
    setCustomVariables({});
    setBeans(PRESET_BEANS);
    setGearProfiles(PRESET_GEARS);
    setWaterProfiles(PRESET_WATER_PROFILES);
    setRecipes(DEFAULT_RECIPES);
    setSessions([]);
    localStorage.clear();
  };

  return (
    <CoffeeContext.Provider
      value={{
        activeCategory,
        setActiveCategory: handleSetActiveCategory,
        userPreferences,
        setUserPreferences,
        setDefaultRecipeForCategory,
        customVariables,
        addCustomVariable,
        beans,
        gearProfiles,
        waterProfiles,
        recipes,
        sessions,
        selectedRecipeForBrew,
        setSelectedRecipeForBrew,
        addBean,
        updateBean,
        deleteBean,
        addGear,
        updateGear,
        deleteGear,
        addWaterProfile,
        updateWaterProfile,
        deleteWaterProfile,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        duplicateRecipe,
        logBrewSession,
        deleteSession,
        calculateExtractionYield,
        calculateFlowRate,
        getDialInAdvice,
        exportDataAsJSON,
        importDataFromJSON,
        resetToDefaults,
      }}
    >
      {children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = () => {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error('useCoffee must be used within a CoffeeProvider');
  }
  return context;
};
