import { Recipe } from '../types/coffee';

export const DEFAULT_RECIPES: Recipe[] = [
  // 1. Benchtop Espresso
  {
    id: 'recipe-espresso-modern-flow',
    title: 'Modern High-Extraction 1:2.2 Slayer Profile',
    category: 'espresso',
    beanId: 'bean-colombia-pink-bourbon',
    gearId: 'gear-espresso-benchtop',
    waterProfileId: 'water-tww-espresso',
    doseGrams: 18.0,
    yieldGrams: 40.0,
    ratio: 2.22,
    waterTempC: 93,
    grindSetting: 'Lagom P64 #1.4 (Fine)',
    grindMicrons: 260,
    preInfusionSeconds: 8,
    preInfusionPressureBar: 3.0,
    targetTotalTimeSeconds: 32,
    targetFlowRateGs: 1.25,
    targetTdsPercent: 9.8,
    targetExtractionYieldPercent: 21.7,
    notes: 'WDT distribution + calibrated 30lb spring tamp + Sworks 0.2mm billet puck screen + bottom paper filter. 8s low-flow pre-infusion followed by 9 bar peak ramp and gentle declining flow tail.',
    tags: ['High-Extraction', 'WDT', '30lb Tamp', 'Puck Screen', 'Flow Control'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },

  // 2. Manual Lever
  {
    id: 'recipe-lever-flair-pressure-profile',
    title: 'Flair 58+ Declining Pressure Lever Profile',
    category: 'manual_lever',
    beanId: 'bean-ethiopia-yirg',
    gearId: 'gear-manual-lever-flair',
    waterProfileId: 'water-singapore-pub',
    doseGrams: 18.0,
    yieldGrams: 45.0,
    ratio: 2.5,
    waterTempC: 95,
    grindSetting: 'Zerno Z1 #2.2',
    grindMicrons: 280,
    preInfusionSeconds: 10,
    preInfusionPressureBar: 2.5,
    targetTotalTimeSeconds: 38,
    targetFlowRateGs: 1.18,
    targetTdsPercent: 9.0,
    targetExtractionYieldPercent: 22.5,
    notes: 'Preheat chamber to Level 3. Gentle manual pre-infusion at 2.5 bar until first drops cover the basket. Ramp to 8 bar, then slowly allow pressure to decline to 5 bar as puck erodes.',
    tags: ['Manual Lever', 'Pressure Profiling', 'Turbo Ratio', 'Declining Pressure'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },

  // 3. Stovetop & Moka Pot
  {
    id: 'recipe-moka-9barista-crema',
    title: '9Barista Twin Boiler Precision Shot',
    category: 'moka_stovetop',
    beanId: 'bean-kenya-nyeri',
    gearId: 'gear-moka-9barista',
    waterProfileId: 'water-volvic',
    doseGrams: 18.0,
    yieldGrams: 36.0,
    ratio: 2.0,
    waterTempC: 99,
    grindSetting: '1Zpresso J-Ultra #1.1.5',
    grindMicrons: 300,
    preInfusionSeconds: 0,
    targetTotalTimeSeconds: 330, // 5.5 min total heat cycle, 25s extraction
    targetFlowRateGs: 1.44,
    targetTdsPercent: 9.5,
    targetExtractionYieldPercent: 19.0,
    notes: 'Fill boiler with room temp Volvic water. Heat over medium gas flame until extraction valve opens at exactly 9 bar. Remove from heat as blonding begins (~25-30s liquid extraction).',
    tags: ['9Barista', 'Stovetop', 'Real 9 Bar', 'Volvic'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },

  // 4. Modern Filter Coffee (Orea V4 Apex + Sibarist + Negotiator)
  {
    id: 'recipe-filter-orea-apex-fast',
    title: 'Orea V4 Apex + Sibarist Negotiated 5-Pour',
    category: 'filter',
    beanId: 'bean-panama-geisha',
    gearId: 'gear-filter-orea-v4',
    waterProfileId: 'water-japan-tokyo',
    doseGrams: 15.0,
    yieldGrams: 250.0,
    ratio: 16.67,
    waterTempC: 92,
    grindSetting: 'Fellow Ode Gen 2 #5.1 (Medium-Fine)',
    grindMicrons: 680,
    targetTotalTimeSeconds: 150, // 2:30 total drawdown
    targetFlowRateGs: 1.66,
    targetTdsPercent: 1.42,
    targetExtractionYieldPercent: 21.3,
    pourStages: [
      {
        id: 'pour-1',
        name: 'Stage 1: Bloom & Gentle Swirl',
        targetWeightGrams: 50,
        startTimeSeconds: 0,
        durationSeconds: 45,
        agitation: 'swirl',
        notes: 'Saturate coffee bed completely, gentle 3-second swirl, let degas until 0:45.'
      },
      {
        id: 'pour-2',
        name: 'Stage 2: Center-to-Edge Spiral',
        targetWeightGrams: 100,
        startTimeSeconds: 45,
        durationSeconds: 20,
        agitation: 'gentle_pour',
        notes: 'Pour at 5 g/s in concentric circles.'
      },
      {
        id: 'pour-3',
        name: 'Stage 3: Pulse Pour',
        targetWeightGrams: 150,
        startTimeSeconds: 75,
        durationSeconds: 15,
        agitation: 'gentle_pour',
        notes: 'Maintain shallow water head height.'
      },
      {
        id: 'pour-4',
        name: 'Stage 4: Pulse Pour',
        targetWeightGrams: 200,
        startTimeSeconds: 100,
        durationSeconds: 15,
        agitation: 'gentle_pour',
        notes: 'Wash down any high-and-dry grounds.'
      },
      {
        id: 'pour-5',
        name: 'Stage 5: Final Pour & Bed Tap',
        targetWeightGrams: 250,
        startTimeSeconds: 120,
        durationSeconds: 15,
        agitation: 'swirl',
        notes: 'Final gentle swirl and tap for flat bed drawdown. Bed should drain dry by 2:30.'
      }
    ],
    notes: 'Sibarist FAST Flat paper seated with Orea Negotiator tool to completely eliminate side bypass. High sweetness and clear florality.',
    tags: ['Orea V4', 'Sibarist FAST', 'Negotiator', 'Zero Bypass', 'Geisha'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },

  // 4b. UFO Ultra-Fast Filter Recipe
  {
    id: 'recipe-filter-ufo-fast',
    title: 'UFO Dripper 1-Minute Hyper-Speed Extraction',
    category: 'filter',
    beanId: 'bean-ethiopia-yirg',
    gearId: 'gear-filter-ufo-fast',
    waterProfileId: 'water-melbourne-tap',
    doseGrams: 16.0,
    yieldGrams: 250.0,
    ratio: 15.6,
    waterTempC: 94,
    grindSetting: '1Zpresso ZP6 #4.5 (Fine)',
    grindMicrons: 550,
    targetTotalTimeSeconds: 110, // 1:50 lightning fast
    targetFlowRateGs: 2.27,
    targetTdsPercent: 1.48,
    targetExtractionYieldPercent: 23.1,
    pourStages: [
      {
        id: 'ufo-1',
        name: 'Bloom (High Energy)',
        targetWeightGrams: 60,
        startTimeSeconds: 0,
        durationSeconds: 30,
        agitation: 'stir',
        notes: 'Rapid 3-point spiral pour.'
      },
      {
        id: 'ufo-2',
        name: 'Single Continuous Cascade',
        targetWeightGrams: 250,
        startTimeSeconds: 30,
        durationSeconds: 40,
        agitation: 'melodrip',
        notes: 'High flow rate pour across wide shallow bed. Extremely low contact resistance.'
      }
    ],
    notes: 'UFO dripper wide bed geometry prevents fines choking even at finer grind settings, delivering syrupy sweetness without astringency.',
    tags: ['UFO Dripper', 'Sibarist UFO', 'High Flow', 'Ultra Wide'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },

  // 5. Immersion (AeroPress Inverted)
  {
    id: 'recipe-aeropress-inverted-championship',
    title: 'AeroPress Inverted World Champion Style',
    category: 'immersion',
    beanId: 'bean-kenya-nyeri',
    gearId: 'gear-immersion-aeropress',
    waterProfileId: 'water-ashbeck',
    doseGrams: 18.0,
    yieldGrams: 200.0,
    ratio: 11.1,
    waterTempC: 86,
    grindSetting: 'Baratza ESP #22 (Medium-Coarse)',
    grindMicrons: 750,
    targetTotalTimeSeconds: 120, // 2:00
    targetFlowRateGs: 1.66,
    targetTdsPercent: 1.60,
    targetExtractionYieldPercent: 21.3,
    pourStages: [
      {
        id: 'aero-1',
        name: 'Rapid Pour & 10x Vigorous Stir',
        targetWeightGrams: 200,
        startTimeSeconds: 0,
        durationSeconds: 20,
        agitation: 'stir',
        notes: 'Pour 200g water at 86°C, paddle stir back and forth 10 times.'
      },
      {
        id: 'aero-2',
        name: 'Steep & Flip',
        targetWeightGrams: 200,
        startTimeSeconds: 20,
        durationSeconds: 70,
        notes: 'Attach rinsed filter cap. At 1:30, gently invert onto carafe.'
      },
      {
        id: 'aero-3',
        name: 'Gentle Plunge to Hiss',
        targetWeightGrams: 200,
        startTimeSeconds: 90,
        durationSeconds: 30,
        notes: 'Slow, steady plunge for 30s. Stop immediately when air hiss sounds.'
      }
    ],
    notes: 'Low temperature (86°C) combined with high agitation suppresses bitterness while preserving juicy berry vibrancy.',
    tags: ['AeroPress', 'Inverted', 'Low Temp', 'Champion Style'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },

  // 6. Traditional Singaporean Kopi
  {
    id: 'recipe-kopi-singaporean-gao',
    title: 'Traditional Singaporean Kopi Gao (Thick & Rich)',
    category: 'singaporean_kopi',
    beanId: 'bean-traditional-nanyang',
    gearId: 'gear-kopi-singapore',
    waterProfileId: 'water-singapore-pub',
    doseGrams: 25.0,
    yieldGrams: 160.0,
    ratio: 6.4,
    waterTempC: 100, // Boiling water
    grindSetting: 'Coarse Sand Nanyang Grind',
    grindMicrons: 1100,
    targetTotalTimeSeconds: 180, // 3 min steep & pull
    targetFlowRateGs: 0.88,
    targetTdsPercent: 3.5,
    targetExtractionYieldPercent: 22.4,
    kopiSpecs: {
      style: 'kopi',
      strength: 'gao',
      isIced: false,
      condensedMilkGrams: 30, // 2 generous tablespoons
      evaporatedMilkGrams: 15, // 1 tablespoon (Carnation/Marigold)
      sugarGrams: 0, // Condensed milk provides rich sweetness
      hotWaterMl: 180,
      coffeeEssenceMl: 140
    },
    notes: 'Add 25g wok-roast grounds into flannel sock. Pour 180ml boiling water through, lift and dip sock 4 times to extract heavy body. Pour over condensed and evaporated milk in a pre-warmed floral ceramic cup. Stir thoroughly.',
    tags: ['Traditional Kopi', 'Kopi Gao', 'Singapore Heritage', 'Flannel Sock', 'Condensed Milk'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  },
  {
    id: 'recipe-kopi-singaporean-c-kosong',
    title: 'Kopi-C Kosong (Evaporated Milk, No Sugar)',
    category: 'singaporean_kopi',
    beanId: 'bean-traditional-nanyang',
    gearId: 'gear-kopi-singapore',
    waterProfileId: 'water-singapore-pub',
    doseGrams: 22.0,
    yieldGrams: 180.0,
    ratio: 8.18,
    waterTempC: 100,
    grindSetting: 'Coarse Sand Nanyang Grind',
    grindMicrons: 1100,
    targetTotalTimeSeconds: 150,
    targetFlowRateGs: 1.2,
    targetTdsPercent: 2.8,
    targetExtractionYieldPercent: 21.0,
    kopiSpecs: {
      style: 'kopi_c_kosong',
      strength: 'standard',
      isIced: false,
      condensedMilkGrams: 0,
      evaporatedMilkGrams: 35,
      sugarGrams: 0,
      hotWaterMl: 200,
      coffeeEssenceMl: 150
    },
    notes: 'Pure coffee essence steeped through the sock strainer, mixed with creamy evaporated milk without added sugar. Clean, savory roasted malt and chocolate notes.',
    tags: ['Kopi-C Kosong', 'No Sugar', 'Evaporated Milk', 'Singapore Tradition'],
    createdAt: '2026-11-09',
    updatedAt: '2026-11-09'
  }
];
