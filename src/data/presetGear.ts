import { GearProfile } from '../types/coffee';

export const PRESET_GEARS: GearProfile[] = [
  {
    id: 'gear-espresso-benchtop',
    name: 'Benchtop Precision Flow-Control Rig',
    category: 'espresso',
    machineModel: 'Lelit Bianca V3 (Needle Valve Flow Control) / Decent DE1',
    grinderModel: 'Option-O Lagom P64 (Mizen Burrs)',
    hasFlowControl: true,
    hasPreInfusion: true,
    basketType: 'WAFO Spirit 20g / Weber Unibasket',
    puckPrep: {
      wdt: true,
      wdtNeedleSize: 'Subminimal Flick 0.25mm Retractable',
      distributor: true,
      tamperType: 'calibrated_30lb',
      puckScreen: true,
      puckScreenThickness: 'SworksDesign 0.2mm Billet Screen',
      bottomPaperFilter: true,
      topPaperFilter: false,
    }
  },
  {
    id: 'gear-filter-orea-v4',
    name: 'Orea V4 Modular Zero-Bypass Rig',
    category: 'filter',
    machineModel: 'Fellow Stagg EKG Kettle',
    grinderModel: 'Fellow Ode Gen 2 (SSP MP Burrs)',
    dripperModel: 'Orea V4 Modular (Apex Fast Base)',
    filterPaperType: 'Sibarist FAST Flat / Orea Type A',
    usesNegotiator: true,
    isCeramicFilter: false,
    hasImmersionValve: false,
    puckPrep: {
      wdt: false,
      distributor: false,
      tamperType: 'traditional_flat',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-filter-ufo-fast',
    name: 'UFO Dripper Ultra-Wide Flow Rig',
    category: 'filter',
    machineModel: 'MiiCoffee Precision Kettle',
    grinderModel: '1Zpresso ZP6 Special (Ultra-fine particle distribution)',
    dripperModel: 'UFO Dripper (Ultra-wide shallow bed)',
    filterPaperType: 'Sibarist UFO Custom Fast Papers',
    usesNegotiator: false,
    isCeramicFilter: false,
    hasImmersionValve: false,
    puckPrep: {
      wdt: false,
      distributor: false,
      tamperType: 'traditional_flat',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-filter-pulsar-hybrid',
    name: 'NextLevel Pulsar Zero-Bypass Hybrid',
    category: 'filter',
    machineModel: 'Timemore Fish Smart Kettle',
    grinderModel: 'Timemore Sculptor 078',
    dripperModel: 'NextLevel Pulsar Zero-Bypass',
    filterPaperType: 'Pulsar Dedicated Micro-Fine Round Filter',
    usesNegotiator: false,
    isCeramicFilter: false,
    hasImmersionValve: true, // Valve for switching immersion vs percolation
    puckPrep: {
      wdt: false,
      distributor: false,
      tamperType: 'traditional_flat',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-filter-loca-ceramic',
    name: 'LOCA Porous Ceramic Dripper Rig',
    category: 'filter',
    machineModel: 'Brewista Artisan Kettle',
    grinderModel: 'Comandante C40 MK4 Nitro Blade',
    dripperModel: 'LOCA Arita-Ware Porous Ceramic Micro-Filter',
    filterPaperType: 'Reusable Micro-Porous Alumina (No Paper)',
    usesNegotiator: false,
    isCeramicFilter: true,
    hasImmersionValve: false,
    puckPrep: {
      wdt: false,
      distributor: false,
      tamperType: 'traditional_flat',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-manual-lever-flair',
    name: 'Flair 58+ Heated Chamber Lever Rig',
    category: 'manual_lever',
    machineModel: 'Flair 58+ (Electric Heated Chamber & Pressure Gauge)',
    grinderModel: 'Zerno Z1 (Blind Shaker distribution)',
    hasFlowControl: true, // Manual profiling via lever arm
    hasPreInfusion: true,
    basketType: 'Pullman 876 18g Precision Basket',
    puckPrep: {
      wdt: true,
      wdtNeedleSize: 'Weber Workshops Moonraker Planetary WDT',
      distributor: false,
      tamperType: 'force_tamper',
      puckScreen: true,
      puckScreenThickness: 'Normcore 0.8mm Titanium Coated',
      bottomPaperFilter: true,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-moka-9barista',
    name: '9Barista Jet-Engineered Stovetop',
    category: 'moka_stovetop',
    machineModel: '9Barista Twin Boiler Stovetop Espresso',
    grinderModel: '1Zpresso J-Ultra',
    hasFlowControl: false,
    hasPreInfusion: false,
    basketType: '53mm Integrated Precision Stovetop Basket',
    puckPrep: {
      wdt: true,
      wdtNeedleSize: '0.35mm Needle Tool',
      distributor: true,
      tamperType: 'calibrated_25lb',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-immersion-aeropress',
    name: 'AeroPress Flow-Control Inverted Rig',
    category: 'immersion',
    machineModel: 'AeroPress Clear + Fellow Prismo / Flow Control Cap',
    grinderModel: 'Baratza Encore ESP',
    puckPrep: {
      wdt: false,
      distributor: false,
      tamperType: 'traditional_flat',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  },
  {
    id: 'gear-kopi-singapore',
    name: 'Traditional Singaporean Nanyang Kopi Station',
    category: 'singaporean_kopi',
    machineModel: 'Stainless Steel Long-Spout Kettle + Traditional Flannel Sock',
    grinderModel: 'Commercial Nanyang Roller Mill / Coarse Mortar Grind',
    puckPrep: {
      wdt: false,
      distributor: false,
      tamperType: 'traditional_flat',
      puckScreen: false,
      bottomPaperFilter: false,
      topPaperFilter: false
    }
  }
];
