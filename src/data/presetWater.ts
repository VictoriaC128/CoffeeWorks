import { WaterProfile } from '../types/coffee';

export const PRESET_WATER_PROFILES: WaterProfile[] = [
  // Municipal Tap Waters
  {
    id: 'water-singapore-pub',
    name: 'Singapore PUB Tap Water (Ultra-Soft)',
    type: 'tap',
    countryRegion: 'Singapore',
    tdsPpm: 70,
    ghPpm: 45, // Low calcium & magnesium
    khPpm: 35, // Low alkalinity buffer
    ph: 7.2,
    description: 'Naturally ultra-soft water. Produces vibrant, sparkling acidity without chalkiness; virtually zero boiler limescale.'
  },
  {
    id: 'water-japan-tokyo',
    name: 'Tokyo Snowmelt Tap Water (Very Soft)',
    type: 'tap',
    countryRegion: 'Japan (Tokyo)',
    tdsPpm: 48,
    ghPpm: 32,
    khPpm: 24,
    ph: 7.0,
    description: 'Very soft natural volcanic runoff. Ideal for delicate floral pour-overs, washed Geishas, and tea-like elegance.'
  },
  {
    id: 'water-melbourne-tap',
    name: 'Melbourne Specialty Tap (Soft & Sweet)',
    type: 'tap',
    countryRegion: 'Australia (Melbourne)',
    tdsPpm: 50,
    ghPpm: 30,
    khPpm: 25,
    ph: 6.9,
    description: 'The golden baseline for Australian specialty coffee. Delivers great balance and fruit sweetness.'
  },
  {
    id: 'water-seattle-tap',
    name: 'Seattle Mountain Runoff Tap (Soft)',
    type: 'tap',
    countryRegion: 'USA (Seattle, WA)',
    tdsPpm: 42,
    ghPpm: 28,
    khPpm: 20,
    ph: 7.1,
    description: 'Cascade mountain snowmelt with low mineral buffering, creating crisp citric and malic brightness.'
  },
  {
    id: 'water-nyc-tap',
    name: 'New York City Catskill Tap (Soft-Medium)',
    type: 'tap',
    countryRegion: 'USA (New York City)',
    tdsPpm: 58,
    ghPpm: 36,
    khPpm: 28,
    ph: 7.2,
    description: 'Natural mountain reservoir water with clean mineral clarity and consistent brewing results.'
  },
  {
    id: 'water-london-tap',
    name: 'London Thames Tap (Very Hard Chalk)',
    type: 'tap',
    countryRegion: 'United Kingdom (London)',
    tdsPpm: 320,
    ghPpm: 260,
    khPpm: 210,
    ph: 7.6,
    description: 'Heavily chalky limestone water. Severe acid buffering and rapid boiler scaling; requires RO or strong ion exchange filtration.'
  },
  {
    id: 'water-berlin-tap',
    name: 'Berlin Groundwater Tap (Very Hard)',
    type: 'tap',
    countryRegion: 'Germany (Berlin)',
    tdsPpm: 360,
    ghPpm: 280,
    khPpm: 230,
    ph: 7.5,
    description: 'Very high mineral content that mutes fruit acidity into flat bitterness if brewed unfiltered.'
  },

  // Bottled Spring & Mineral Waters
  {
    id: 'water-volvic',
    name: 'Volvic Natural Mineral Water (SCA Benchmark)',
    type: 'bottled_spring',
    countryRegion: 'France (Auvergne Volcanoes)',
    tdsPpm: 130,
    ghPpm: 62,
    khPpm: 71,
    ph: 7.0,
    description: 'The classic international cupping standard. Naturally filtered through volcanic rocks with balanced calcium and silica.'
  },
  {
    id: 'water-crystal-geyser',
    name: 'Crystal Geyser Alpine Spring',
    type: 'bottled_spring',
    countryRegion: 'USA (Mt. Shasta / Olancha)',
    tdsPpm: 120,
    ghPpm: 68,
    khPpm: 58,
    ph: 7.3,
    description: 'Popular US specialty standard spring water with consistent low-to-medium mineral profile.'
  },
  {
    id: 'water-ashbeck',
    name: 'Ashbeck Natural Spring',
    type: 'bottled_spring',
    countryRegion: 'United Kingdom',
    tdsPpm: 85,
    ghPpm: 50,
    khPpm: 45,
    ph: 6.8,
    description: 'The go-to budget bottled spring water for UK specialty baristas avoiding hard tap water.'
  },
  {
    id: 'water-spa-reine',
    name: 'Spa Reine Natural Mineral (Ultra-Soft)',
    type: 'bottled_spring',
    countryRegion: 'Belgium (Ardennes)',
    tdsPpm: 33,
    ghPpm: 18,
    khPpm: 15,
    ph: 6.0,
    description: 'One of the lowest mineral bottled waters in Europe. Extremely soft with zero buffering.'
  },
  {
    id: 'water-evian',
    name: 'Evian Natural Mineral Water (High Calcium)',
    type: 'bottled_spring',
    countryRegion: 'France (Alps)',
    tdsPpm: 345,
    ghPpm: 300,
    khPpm: 300,
    ph: 7.2,
    description: 'High calcium and bicarbonate. Accentuates heavy body and crema at the expense of sparkling fruit notes.'
  },

  // Remineralized & Formulated Formulations
  {
    id: 'water-tww-classic',
    name: 'Third Wave Water (Classic Profile)',
    type: 'remineralized_ro',
    countryRegion: 'Formulated Mineral Packet',
    tdsPpm: 150,
    ghPpm: 110, // Rich in Magnesium & Calcium
    khPpm: 40,  // Controlled buffer
    ph: 7.0,
    description: 'Engineered specifically for drip & manual filter brewing to extract maximum sweetness and fruit notes.'
  },
  {
    id: 'water-tww-espresso',
    name: 'Third Wave Water (Espresso Machine Safe)',
    type: 'remineralized_ro',
    countryRegion: 'Formulated Mineral Packet',
    tdsPpm: 150,
    ghPpm: 85,
    khPpm: 65,  // Extra buffer to prevent boiler corrosion and scaling
    ph: 7.2,
    description: 'Espresso-optimized remineralization with elevated alkalinity to protect boilers while highlighting syrupy body.'
  },
  {
    id: 'water-lotus-bright',
    name: 'Lotus Water Drops (Bright & Juicy)',
    type: 'remineralized_ro',
    countryRegion: 'Custom Mineral Concentrate',
    tdsPpm: 90,
    ghPpm: 65,
    khPpm: 25,
    ph: 6.8,
    description: 'High magnesium ratio for enhanced fruit ester extraction with minimal bicarbonate buffering.'
  },
  {
    id: 'water-peak-dial25',
    name: 'Peak Water Precision Jug (Bypass Dial 2.5)',
    type: 'filtration_jug',
    countryRegion: 'Ion-Exchange Bypass Filter',
    tdsPpm: 100,
    ghPpm: 65,
    khPpm: 45,
    ph: 7.0,
    description: 'Variable bypass filter jug adjusted to dial 2.5 to achieve balanced SCA hardness from tap water.'
  }
];
