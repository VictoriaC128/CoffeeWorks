export type CoffeeCategory =
  | 'espresso'         // 1. Benchtop / Electric Espresso
  | 'manual_lever'     // 2. Manual Lever & Alternative Pressure
  | 'moka_stovetop'    // 3. Stovetop & Moka Pot
  | 'filter'           // 4. Modern Filter Coffee (V60, Orea, UFO, Chemex, Pulsar, Ceramic)
  | 'immersion'        // 5. Immersion (AeroPress, French Press, Cold Brew)
  | 'singaporean_kopi'; // 6. Traditional Singaporean Kopi (Nanyang Coffee)

export type RoastLevel =
  | 'light'
  | 'med_light'
  | 'medium'
  | 'med_dark'
  | 'dark'
  | 'nanyang_wok';

export type ProcessMethod =
  | 'washed'
  | 'natural'
  | 'honey'
  | 'anaerobic_fermentation'
  | 'carbonic_maceration'
  | 'thermal_shock'
  | 'co_fermented'
  | 'traditional_butter_sugar_roast'
  | 'other';

export interface Bean {
  id: string;
  name: string;
  roaster: string;
  origin: string;
  region?: string;
  varietal?: string;
  elevationMeters?: number;
  roastLevel: RoastLevel;
  processMethod: ProcessMethod;
  tastingNotes: string[];
  aroma: string;
  roastDate: string; // YYYY-MM-DD
  degassingDaysIdeal?: number;
  notes?: string;
}

export type WaterType = 'tap' | 'bottled_spring' | 'remineralized_ro' | 'filtration_jug' | 'other' | string;

export interface WaterProfile {
  id: string;
  name: string;
  type: WaterType;
  countryRegion: string;
  tdsPpm: number;
  ghPpm: number; // General Hardness (Ca/Mg)
  khPpm: number; // Carbonate Hardness / Alkalinity buffer
  ph?: number;
  description: string;
}

export interface BasketSpec {
  brand: string;
  sizeGrams: string; // e.g. "18g", "20g", "7g-10g", "22g-24g", "custom"
  diameterMm: string; // "58.5mm", "54mm", "53mm", "51mm", "49mm", "custom"
}

export interface PuckPrepTools {
  wdt: boolean;
  wdtNeedleSize?: string; // e.g. "0.25mm", "0.35mm", "Subminimal Flick", custom
  distributor: boolean;
  tamperType: 'calibrated_30lb' | 'calibrated_25lb' | 'traditional_flat' | 'electronic_puqpress' | 'force_tamper' | 'other';
  tamperCustomLabel?: string;
  puckScreen: boolean;
  puckScreenThickness?: string; // "0.2mm Sworks", "0.8mm Normcore", "1.7mm Mesh", custom
  bottomPaperFilter: boolean;
  topPaperFilter: boolean;
}

export interface GearProfile {
  id: string;
  name: string;
  category: CoffeeCategory;
  machineModel: string;
  grinderModel: string;
  // Espresso / Lever specific
  hasFlowControl?: boolean;
  hasPreInfusion?: boolean;
  basketSpec?: BasketSpec;
  basketType?: string; // e.g. "Wafo Spirit", "Weber Unibasket", "Pullman 876", "VST 18g"
  puckPrep: PuckPrepTools;
  // Filter specific
  dripperModel?: string; // "Orea V4 Modular", "UFO Dripper", "NextLevel Pulsar", "Graycano", "V60 02"
  filterPaperType?: string; // "Sibarist FAST Flat", "Cafec Abaca", "Sibarist UFO", "Kyuemon Ceramic"
  isCeramicFilter?: boolean;
  hasImmersionValve?: boolean; // Hario Switch, Pulsar, Clever
  usesNegotiator?: boolean; // Orea Negotiator
}

export interface PourStage {
  id: string;
  name: string;
  targetWeightGrams: number;
  startTimeSeconds: number;
  durationSeconds: number;
  isImmersionClosed?: boolean;
  agitation?: 'swirl' | 'stir' | 'melodrip' | 'gentle_pour' | 'center_pour' | 'other';
  notes?: string;
}

export interface KopiCustomization {
  style: 'kopi' | 'kopi_o' | 'kopi_c' | 'kopi_kosong' | 'kopi_o_kosong' | 'kopi_c_kosong' | 'other';
  strength: 'standard' | 'gao' | 'po' | 'di_lo';
  isIced: boolean;
  condensedMilkGrams: number;
  evaporatedMilkGrams: number;
  sugarGrams: number;
  hotWaterMl: number;
  coffeeEssenceMl: number;
}

export interface Recipe {
  id: string;
  title: string;
  category: CoffeeCategory;
  beanId?: string;
  gearId?: string;
  waterProfileId?: string;
  
  doseGrams: number;
  yieldGrams: number;
  ratio: number; // yield / dose
  waterTempC: number;
  grindSetting: string;
  grindMicrons?: number;
  
  // Espresso / Pressure
  preInfusionSeconds?: number;
  preInfusionPressureBar?: number;
  targetTotalTimeSeconds: number;
  targetFlowRateGs?: number; // calculated target g/s
  
  // Extraction Targets
  targetTdsPercent?: number; // e.g. 9.5% for espresso, 1.4% for filter
  targetExtractionYieldPercent?: number; // e.g. 20.5%
  
  // Filter Pour schedule
  pourStages?: PourStage[];
  
  // Singaporean Kopi formulation
  kopiSpecs?: KopiCustomization;
  
  basketSpec?: BasketSpec;
  isDefault?: boolean; // Set as default recipe for this category
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SensoryRating {
  overall: number; // 1 to 5
  acidity: number; // 1 to 5
  sweetness: number; // 1 to 5
  bitterness: number; // 1 to 5
  body: number; // 1 to 5
  verdict: 'under_extracted' | 'balanced' | 'over_extracted' | 'channeling' | 'stalled';
}

export interface BrewSession {
  id: string;
  recipeId: string;
  recipeTitle: string;
  category: CoffeeCategory;
  beanName: string;
  timestamp: string;
  
  actualDoseGrams: number;
  actualYieldGrams: number;
  actualRatio: number;
  
  actualPreInfusionSeconds?: number;
  actualTotalTimeSeconds: number;
  actualFlowRateGs: number; // yield / totalTime
  
  refractometerTdsPercent?: number;
  calculatedExtractionYieldPercent?: number;
  
  sensory: SensoryRating;
  sensoryNotes: string;
  dialInAdvice: string[];
}

export interface UserPreferences {
  primaryCategory: CoffeeCategory;
  defaultRecipePerCategory: Partial<Record<CoffeeCategory, string>>;
  hasCompletedOnboarding: boolean;
}
