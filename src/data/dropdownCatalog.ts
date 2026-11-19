import { DropdownOption } from '../components/SmartDropdownWithOthers';

export const ESPRESSO_MACHINE_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Generic / No machine specified)', value: 'N/A', group: 'None / Not Applicable' },
  // Artisan & Multi-Boiler
  { label: 'Kees van der Westen Spirit (Flagship Multi-Boiler)', value: 'KvdW Spirit', group: 'Artisan & Multi-Boiler' },
  { label: 'Kees van der Westen Speedster', value: 'KvdW Speedster', group: 'Artisan & Multi-Boiler' },
  { label: 'Kees van der Westen Mirage / Slim Jim', value: 'KvdW Mirage', group: 'Artisan & Multi-Boiler' },
  { label: 'Slayer Single Group (Needle-Valve Flow Control)', value: 'Slayer Single Group', group: 'Artisan & Multi-Boiler' },
  { label: 'Synesso ES.1 (Prosumer Profiling)', value: 'Synesso ES.1', group: 'Artisan & Multi-Boiler' },
  { label: 'Sanremo YOU (Digital Paddle & Volumetric)', value: 'Sanremo YOU', group: 'Artisan & Multi-Boiler' },

  // Italian Heritage & Commercial Prosumer
  { label: 'La Marzocco Linea Micra (Compact Dual Boiler)', value: 'La Marzocco Linea Micra', group: 'Italian Prosumer' },
  { label: 'La Marzocco Linea Mini / Mini R', value: 'La Marzocco Linea Mini R', group: 'Italian Prosumer' },
  { label: 'La Marzocco GS3 MP (Manual Paddle Profiling)', value: 'La Marzocco GS3 MP', group: 'Italian Prosumer' },
  { label: 'La Marzocco Strada (X / EP)', value: 'La Marzocco Strada', group: 'Italian Prosumer' },
  { label: 'Lelit Bianca V3 (Manual Paddle Flow Needle)', value: 'Lelit Bianca V3', group: 'Italian Prosumer' },
  { label: 'Lelit Mara X (Smart HX PID)', value: 'Lelit Mara X', group: 'Italian Prosumer' },
  { label: 'Lelit Elizabeth (Dual Boiler)', value: 'Lelit Elizabeth', group: 'Italian Prosumer' },
  { label: 'Rocket R Cinquantotto (R58 Dual Boiler)', value: 'Rocket R58 Cinquantotto', group: 'Italian Prosumer' },
  { label: 'Rocket Appartamento / TCA', value: 'Rocket Appartamento', group: 'Italian Prosumer' },
  { label: 'ECM Synchronika II (E61 Flow Profiling)', value: 'ECM Synchronika II', group: 'Italian Prosumer' },
  { label: 'ECM Puristika (Glass Tank Single Boiler)', value: 'ECM Puristika', group: 'Italian Prosumer' },
  { label: 'Profitec Drive (Integrated Flow Control)', value: 'Profitec Drive', group: 'Italian Prosumer' },
  { label: 'Profitec Pro 600 / Pro 500 / GO', value: 'Profitec Pro 600', group: 'Italian Prosumer' },
  { label: 'Victoria Arduino Eagle One Prima / EXP', value: 'VA Eagle One Prima', group: 'Italian Prosumer' },
  { label: 'Gaggia Classic Pro / Gaggiuino Mod', value: 'Gaggia Classic Pro', group: 'Italian Prosumer' },

  // Digital & Real-time Flow
  { label: 'Decent Espresso DE1PRO / DE1XL', value: 'Decent DE1PRO', group: 'Digital Profiling' },
  { label: 'Decent Espresso Bengle', value: 'Decent Bengle', group: 'Digital Profiling' },

  // Breville / Sage Ecosystem
  { label: 'Breville Dual Boiler (BES920XL / Slayer-Mod)', value: 'Breville Dual Boiler', group: 'Breville / Sage' },
  { label: 'Breville Bambino / Bambino Plus', value: 'Breville Bambino Plus', group: 'Breville / Sage' },
  { label: 'Breville Barista Express / Impress', value: 'Breville Barista Express', group: 'Breville / Sage' },
  { label: 'Breville Barista Touch / Oracle Touch', value: 'Breville Oracle Touch', group: 'Breville / Sage' },

  // Chinese & Asian Value-Engineered Brands
  { label: 'WPM / Welhome KD-310 / KD-330 (Triple Thermoblock Gear Pump)', value: 'WPM KD-310', group: 'Chinese & Asian Brands' },
  { label: 'Gemilai CRM3605 (Entry Benchmark)', value: 'Gemilai CRM3605', group: 'Chinese & Asian Brands' },
  { label: 'Gemilai CRM3007G (58mm Rotary Pump PID)', value: 'Gemilai CRM3007G', group: 'Chinese & Asian Brands' },
  { label: 'Gemilai CRM3121A Commercial Dual Boiler', value: 'Gemilai CRM3121A', group: 'Chinese & Asian Brands' },
  { label: 'ITOP 03 / ITOP 40 Plus Dual Thermoblock', value: 'ITOP 40 Plus', group: 'Chinese & Asian Brands' },
  { label: 'MiiCoffee / Turin Apex (Dual Boiler PID)', value: 'MiiCoffee Apex', group: 'Chinese & Asian Brands' },
  { label: 'HiBREW H10A (Commercial 58mm Group with PID)', value: 'HiBREW H10A', group: 'Chinese & Asian Brands' },
  { label: 'HiBREW H7A Dual Boiler', value: 'HiBREW H7A', group: 'Chinese & Asian Brands' },
  { label: 'Petrus PE3888 / PE3899 Saturated Group', value: 'Petrus PE3899', group: 'Chinese & Asian Brands' },
  { label: 'Barsetto BAE02S / BAE-V1 Dual Boiler', value: 'Barsetto BAE-V1', group: 'Chinese & Asian Brands' },
];

export const ESPRESSO_BASKET_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Stock / No precision basket used)', value: 'N/A', group: 'None / Not Applicable' },
  // High Extraction / Zero Deadzone
  { label: 'WAFO Spirit (Hyper-Dense Laser Matrix)', value: 'WAFO Spirit', group: 'High-Extraction Series' },
  { label: 'WAFO Classic (Balanced Flow Rate)', value: 'WAFO Classic', group: 'High-Extraction Series' },
  { label: 'WAFO SOE (Single Origin Espresso)', value: 'WAFO SOE', group: 'High-Extraction Series' },
  { label: 'WAFO Blonde (Light Roast Clarity)', value: 'WAFO Blonde', group: 'High-Extraction Series' },
  { label: 'Weber Workshops Unibasket (CNC Zero Deadzone)', value: 'Weber Unibasket', group: 'High-Extraction Series' },
  { label: 'Pesado HE% High Extraction Basket', value: 'Pesado HE%', group: 'High-Extraction Series' },
  { label: 'Pullman 876 Precision Filtration Basket', value: 'Pullman 876', group: 'High-Extraction Series' },
  { label: 'MHW-3BOMBER DEX / Sniper High-Flow', value: 'MHW-3BOMBER DEX', group: 'High-Extraction Series' },
  { label: 'SworksDesign Billet Step Basket', value: 'SworksDesign Billet Step', group: 'High-Extraction Series' },
  { label: 'Mish Chief Honeycomb Precision Basket', value: 'Mish Chief Honeycomb', group: 'High-Extraction Series' },

  // Precision Benchmarks
  { label: 'VST Precision (Ridgeless)', value: 'VST Precision Ridgeless', group: 'Precision Benchmarks' },
  { label: 'VST Precision (Ridged)', value: 'VST Precision Ridged', group: 'Precision Benchmarks' },
  { label: 'IMS Baristapro (Nanotech Quartz Coating)', value: 'IMS Baristapro Nanotech', group: 'Precision Benchmarks' },
  { label: 'IMS Competition Series (Curved Bottom)', value: 'IMS Competition', group: 'Precision Benchmarks' },
  { label: 'IMS Big Bang (Graduated Hole Pattern)', value: 'IMS Big Bang', group: 'Precision Benchmarks' },
  { label: 'E&B Lab Superfine (Wire-Mesh Membrane)', value: 'E&B Lab Superfine', group: 'Precision Benchmarks' },
  { label: 'Decent Espresso Precision Basket', value: 'Decent Precision Basket', group: 'Precision Benchmarks' },
  { label: 'Hugh by Levercraft High-Flow Basket', value: 'Hugh by Levercraft', group: 'Precision Benchmarks' },

  // Standard & OEM
  { label: 'La Marzocco OEM (Strada Precision)', value: 'La Marzocco Strada OEM', group: 'Standard & OEM' },
  { label: 'E61 Standard Commercial Basket', value: 'E61 Standard Commercial', group: 'Standard & OEM' },
  { label: 'Breville / Sage 54mm Single-Wall Basket', value: 'Breville 54mm Single-Wall', group: 'Standard & OEM' },
  { label: 'La Pavoni Millennium 51mm / 49mm', value: 'La Pavoni Millennium', group: 'Standard & OEM' },
];

export const BASKET_SIZE_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Standard / Unspecified dose size)', value: 'N/A', group: 'None / Not Applicable' },
  { label: 'Single Dose (7g – 10g)', value: '7g-10g', group: 'Dose Capacity' },
  { label: 'Double Small (14g – 16g)', value: '14g-16g', group: 'Dose Capacity' },
  { label: 'Double Standard (17g – 19g Classic 18g)', value: '17g-19g', group: 'Dose Capacity' },
  { label: 'Double Large (20g – 22g Modern Standard)', value: '20g-22g', group: 'Dose Capacity' },
  { label: 'Triple Basket (22g – 24g)', value: '22g-24g', group: 'Dose Capacity' },
  { label: 'Max High-Volume (24g – 26g+)', value: '24g-26g+', group: 'Dose Capacity' },
];

export const BASKET_DIAMETER_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Standard / Unspecified diameter)', value: 'N/A', group: 'None / Not Applicable' },
  { label: '58.5mm (E61, Decent, Bianca, Linea, Slayer, Flair 58)', value: '58.5mm', group: 'Diameter' },
  { label: '54mm (Breville / Sage Bambino, Barista Express, Dual Boiler)', value: '54mm', group: 'Diameter' },
  { label: '53mm (9Barista Stovetop, La Spaziale)', value: '53mm', group: 'Diameter' },
  { label: '51mm (La Pavoni Post-Millennium, Delonghi Dedica)', value: '51mm', group: 'Diameter' },
  { label: '49mm (La Pavoni Pre-Millennium, Olympia Cremina)', value: '49mm', group: 'Diameter' },
  { label: '45mm Handheld (Wacaco Picopresso, Nanopresso)', value: '45mm', group: 'Diameter' },
];

export const FILTER_DRIPPER_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Generic / Custom dripper)', value: 'N/A', group: 'None / Not Applicable' },
  // Orea Series
  { label: 'Orea V4 Modular (Apex Base - Ultra Fast)', value: 'Orea V4 Apex', group: 'Orea Series' },
  { label: 'Orea V4 Modular (Fast Base)', value: 'Orea V4 Fast', group: 'Orea Series' },
  { label: 'Orea V4 Modular (Open Base)', value: 'Orea V4 Open', group: 'Orea Series' },
  { label: 'Orea V4 Modular (Classic Base)', value: 'Orea V4 Classic', group: 'Orea Series' },
  { label: 'Orea V3 / V3 MK2 (Flat-Bottom)', value: 'Orea V3 MK2', group: 'Orea Series' },
  { label: 'Orea Big Boy (High-Volume Batch)', value: 'Orea Big Boy', group: 'Orea Series' },

  // Ultra-Wide & Zero Bypass
  { label: 'UFO Dripper (Ultra-Wide Shallow Bed)', value: 'UFO Dripper', group: 'Zero Bypass & Fast Flow' },
  { label: 'NextLevel Pulsar (Zero-Bypass Valve Hybrid)', value: 'NextLevel Pulsar', group: 'Zero Bypass & Fast Flow' },
  { label: 'Tricolate (Showerhead Zero-Bypass)', value: 'Tricolate', group: 'Zero Bypass & Fast Flow' },
  { label: 'Hario Switch 02/03 (Immersion Valve Hybrid)', value: 'Hario Switch', group: 'Zero Bypass & Fast Flow' },
  { label: 'Clever Dripper (Weight Release Valve)', value: 'Clever Dripper', group: 'Zero Bypass & Fast Flow' },

  // Geometric Conical & Flat
  { label: 'Graycano (Cast Aluminum Lava Ribs)', value: 'Graycano Lava Ribs', group: 'Geometric Drippers' },
  { label: 'April Dripper (Glass / Plastic / Ceramic)', value: 'April Dripper', group: 'Geometric Drippers' },
  { label: 'Origami Dripper (Air Resin / Ceramic)', value: 'Origami Dripper', group: 'Geometric Drippers' },
  { label: 'Fellow Stagg [X] / [XF] (Double-Wall Insulated)', value: 'Fellow Stagg X', group: 'Geometric Drippers' },
  { label: 'Timemore B75 (75° Flat Bottom)', value: 'Timemore B75', group: 'Geometric Drippers' },
  { label: 'Hario V60 (Plastic 01 / 02)', value: 'Hario V60 Plastic', group: 'Conical & Classic' },
  { label: 'Hario V60 (Ceramic / Glass / Copper / Mugen)', value: 'Hario V60 Ceramic', group: 'Conical & Classic' },
  { label: 'Kalita Wave 155 / 185 (Stainless Tsubame)', value: 'Kalita Wave 185', group: 'Conical & Classic' },
  { label: 'Chemex Classic (3, 6, 8, 10 Cup)', value: 'Chemex Classic', group: 'Conical & Classic' },

  // Porous Ceramic Micro-Filters
  { label: 'LOCA Arita-Ware Porous Ceramic Filter', value: 'LOCA Ceramic Filter', group: 'Porous Ceramic' },
  { label: 'Cofil Fuji Porous Alumina Ceramic Filter', value: 'Cofil Fuji Ceramic', group: 'Porous Ceramic' },
  { label: 'Kyuemon Porous Ceramic Dripper', value: 'Kyuemon Ceramic', group: 'Porous Ceramic' },
];

export const FILTER_PAPER_OPTIONS: DropdownOption[] = [
  { label: 'N/A (No paper filter / cloth / metal mesh)', value: 'N/A', group: 'None / Not Applicable' },
  // Sibarist FAST Series
  { label: 'Sibarist FAST Flat (Orea / Kalita)', value: 'Sibarist FAST Flat', group: 'Sibarist (Spain)' },
  { label: 'Sibarist FAST Cone (V60 / Origami)', value: 'Sibarist FAST Cone', group: 'Sibarist (Spain)' },
  { label: 'Sibarist UFO Custom Fast Papers', value: 'Sibarist UFO', group: 'Sibarist (Spain)' },
  { label: 'Sibarist B3 & HYBRID Discs', value: 'Sibarist B3 HYBRID', group: 'Sibarist (Spain)' },

  // Orea Specialty Papers
  { label: 'Orea Type A (Fast Flow Flat Paper)', value: 'Orea Type A', group: 'Orea Specialty' },
  { label: 'Orea Type B (Balanced Clarity Flat Paper)', value: 'Orea Type B', group: 'Orea Specialty' },
  { label: 'Orea Wave 185 Fluted Papers', value: 'Orea Wave 185', group: 'Orea Specialty' },

  // Cafec Specialty Series
  { label: 'Cafec Abaca / Abaca+ (Manila Hemp Ultra-Flow)', value: 'Cafec Abaca', group: 'Cafec (Japan)' },
  { label: 'Cafec T-90 (Medium-Dark Fast Drawdown)', value: 'Cafec T-90', group: 'Cafec (Japan)' },
  { label: 'Cafec T-83 (Light Roast High Sweetness Retention)', value: 'Cafec T-83', group: 'Cafec (Japan)' },
  { label: 'Cafec T-92 (Dark Roast Density)', value: 'Cafec T-92', group: 'Cafec (Japan)' },

  // Heavy & Standard
  { label: 'Chemex Bonded Circles / Squares (Thick Heavy Filter)', value: 'Chemex Bonded', group: 'Standard & Heavy' },
  { label: 'Kalita Wave 155 / 185 Fluted Papers', value: 'Kalita Wave Fluted', group: 'Standard & Heavy' },
  { label: 'Hario V60 Untabbed (Classic Fast Flow)', value: 'Hario V60 Untabbed', group: 'Standard & Heavy' },
  { label: 'Hario V60 Tabbed (Bleached White)', value: 'Hario V60 Tabbed White', group: 'Standard & Heavy' },
  { label: 'Hario V60 Tabbed (Natural Brown)', value: 'Hario V60 Tabbed Brown', group: 'Standard & Heavy' },

  // Reusable
  { label: 'Porous Ceramic Alumina (No Paper - LOCA / Cofil)', value: 'Porous Ceramic Alumina', group: 'Reusable Media' },
  { label: 'Traditional Flannel Cloth Sock Strainer', value: 'Flannel Cloth Sock', group: 'Reusable Media' },
  { label: 'Stainless Steel Ultra-Fine Metal Mesh', value: 'Stainless Steel Mesh', group: 'Reusable Media' },
];

export const GRINDER_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Pre-ground / Unbranded grinder)', value: 'N/A', group: 'None / Not Applicable' },
  // High-End Flat Burr Profiling
  { label: 'Option-O Lagom P64 (Mizen / SSP Burrs)', value: 'Lagom P64', group: 'Precision Flat Burrs' },
  { label: 'Option-O Lagom 01 / P01 (102mm / 98mm)', value: 'Lagom 01', group: 'Precision Flat Burrs' },
  { label: 'Zerno Z1 (Blind Shaker Alignment)', value: 'Zerno Z1', group: 'Precision Flat Burrs' },
  { label: 'Timemore Sculptor 078 / 078s', value: 'Timemore Sculptor 078', group: 'Precision Flat Burrs' },
  { label: 'Timemore Sculptor 064 / 064s', value: 'Timemore Sculptor 064', group: 'Precision Flat Burrs' },
  { label: 'Fellow Ode Gen 2 (SSP MP Burrs)', value: 'Fellow Ode Gen 2', group: 'Precision Flat Burrs' },
  { label: 'Mazzer Philos (Single-Dose 64mm Flat)', value: 'Mazzer Philos', group: 'Precision Flat Burrs' },
  { label: 'DF64 Gen 2 / DF83 / DF64V Variable RPM', value: 'DF64 Gen 2', group: 'Precision Flat Burrs' },

  // Conical & Traditional Single Dose
  { label: 'Niche Zero (63mm Conical Mazzer Kony Burrs)', value: 'Niche Zero', group: 'Conical & Sweetness' },
  { label: 'Niche Duo (Dual 83mm Flat Burr Sets)', value: 'Niche Duo', group: 'Conical & Sweetness' },
  { label: 'Weber Workshops Key / EG-1', value: 'Weber EG-1', group: 'Conical & Sweetness' },
  { label: 'Baratza Encore ESP / Sette 270', value: 'Baratza Encore ESP', group: 'Conical & Sweetness' },

  // Premium Hand Grinders
  { label: 'Comandante C40 MK4 Nitro Blade', value: 'Comandante C40 MK4', group: 'Precision Hand Grinders' },
  { label: '1Zpresso K-Ultra (External Calibration)', value: '1Zpresso K-Ultra', group: 'Precision Hand Grinders' },
  { label: '1Zpresso ZP6 Special (Ultra-Low Fines Pour-Over)', value: '1Zpresso ZP6', group: 'Precision Hand Grinders' },
  { label: '1Zpresso J-Ultra (Fine Espresso Steps 8µm)', value: '1Zpresso J-Ultra', group: 'Precision Hand Grinders' },
  { label: 'Kingrinder K6 / K4', value: 'Kingrinder K6', group: 'Precision Hand Grinders' },
  { label: 'Timemore Chestnut C2 / C3 / Slim', value: 'Timemore Chestnut', group: 'Precision Hand Grinders' },
];

export const WDT_OPTIONS: DropdownOption[] = [
  { label: 'N/A (No needle WDT tool used)', value: 'N/A', group: 'None / Not Applicable' },
  // MHW-3BOMBER (MH3W-Bomber)
  { label: 'MHW-3BOMBER Cyclone Needle WDT Tool (0.25mm / 0.4mm Needles)', value: 'MHW-3BOMBER Cyclone WDT', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Lightning Magnetic Stand WDT (0.25mm)', value: 'MHW-3BOMBER Lightning WDT', group: 'MHW-3BOMBER (MH3W)' },

  // Precision WDT Tools
  { label: 'Subminimal Flick WDT (Retractable 0.25mm Needles)', value: 'Subminimal Flick 0.25mm', group: 'WDT Tools' },
  { label: 'SworksDesign Billet WDT (0.22mm Interchangeable)', value: 'SworksDesign Billet 0.22mm', group: 'WDT Tools' },
  { label: 'Umikot Planetary Gear 3D Printed WDT', value: 'Umikot Planetary Gear', group: 'WDT Tools' },
  { label: 'Weber Workshops Moonraker (Planetary Distribution)', value: 'Weber Moonraker', group: 'WDT Tools' },
  { label: 'Normcore V2 / V3 WDT Tool (0.3mm)', value: 'Normcore V2 0.3mm', group: 'WDT Tools' },
];

export const TAMPER_OPTIONS: DropdownOption[] = [
  { label: 'N/A (No calibrated tamper / standard palm tamp)', value: 'N/A', group: 'None / Not Applicable' },
  // MHW-3BOMBER (MH3W-Bomber)
  { label: 'MHW-3BOMBER Flash Constant Pressure Tamper (30 lbs / Auto-Leveling)', value: 'MHW-3BOMBER Flash 30lb', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Yu Series Calibrated Spring Tamper (30 lbs)', value: 'MHW-3BOMBER Yu 30lb', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Sonic Impact Tamper (30 lbs Acoustic Click Feedback)', value: 'MHW-3BOMBER Sonic Impact', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Palm / Push Leveling Tamper (58.35mm / 53.3mm)', value: 'MHW-3BOMBER Palm Push', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 2-in-1 Dual Head Distributor & Tamper', value: 'MHW-3BOMBER 2-in-1', group: 'MHW-3BOMBER (MH3W)' },

  // Precision & Calibrated Systems
  { label: 'Normcore V4 Calibrated Spring Tamper (30 lbs)', value: 'calibrated_30lb', group: 'Tamping Systems' },
  { label: 'Normcore V4 Calibrated Spring Tamper (25 lbs)', value: 'calibrated_25lb', group: 'Tamping Systems' },
  { label: 'The Force Tamper (Automatic Leveling Impact Mechanism)', value: 'force_tamper', group: 'Tamping Systems' },
  { label: 'Puqpress Q2 / M-Line Gen 5 Digital Electronic Auto-Tamper', value: 'electronic_puqpress', group: 'Tamping Systems' },
  { label: 'Pullman BigStep Precision Flat Tamper (58.55mm)', value: 'traditional_flat', group: 'Tamping Systems' },
];

export const PUCK_SCREEN_OPTIONS: DropdownOption[] = [
  { label: 'N/A (No puck screen used)', value: 'N/A', group: 'None / Not Applicable' },
  // MHW-3BOMBER (MH3W-Bomber)
  { label: 'MHW-3BOMBER 0.8mm Titanium Coated Contact Puck Screen', value: '0.8mm MHW-3BOMBER Titanium', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 1.7mm Penta-Layer Sintered Mesh Screen', value: '1.7mm MHW-3BOMBER Mesh', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 0.2mm Laser Ultra-Thin Contact Screen', value: '0.2mm MHW-3BOMBER Laser', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Honeycomb Dispersion Contact Screen', value: 'MHW-3BOMBER Honeycomb', group: 'MHW-3BOMBER (MH3W)' },

  // Artisan & Laser Screens
  { label: 'SworksDesign 0.2mm Billet Puck Screen (Ultra-Thin Laser Drilled)', value: '0.2mm Sworks Billet', group: 'Puck Screens' },
  { label: 'Normcore 0.8mm Titanium Coated Screen', value: '0.8mm Normcore Titanium', group: 'Puck Screens' },
  { label: 'Normcore 1.7mm Stainless Steel Mesh Screen', value: '1.7mm Stainless Mesh', group: 'Puck Screens' },
  { label: 'Mish Chief Honeycomb Puck Screen', value: 'Mish Chief Honeycomb', group: 'Puck Screens' },
];

export const DISPERSION_OPTIONS: DropdownOption[] = [
  { label: 'N/A (No dispersion tool / direct kettle pour)', value: 'N/A', group: 'None / Not Applicable' },
  { label: 'Melodrip (Collimated Zero-Agitation Water Shower)', value: 'melodrip', group: 'Water Dispersion' },
  { label: 'Hario Drip-Assist (Dual Concentric Ring Shower)', value: 'Hario Drip-Assist', group: 'Water Dispersion' },
  { label: 'Gabi Master A (Precision Shower Drip)', value: 'Gabi Master A', group: 'Water Dispersion' },
  { label: 'Gooseneck Kettle Direct Pour (No Dispersion Tool)', value: 'Kettle Direct Pour', group: 'Water Dispersion' },
];

export const WATER_SOURCE_OPTIONS: DropdownOption[] = [
  { label: 'N/A (Standard municipal / unspecified water)', value: 'N/A', group: 'None / Not Applicable' },
  { label: 'Municipal Tap Water', value: 'tap', group: 'Tap & Municipal' },
  { label: 'Bottled Spring / Mineral Water (Volvic, Crystal Geyser, Evian)', value: 'bottled_spring', group: 'Bottled Spring' },
  { label: 'Remineralized RO (Third Wave Water / Lotus Drops / Barista Hustle Recipe)', value: 'remineralized_ro', group: 'Remineralized RO' },
  { label: 'Filtration Jug (Peak Water Ion-Exchange / Brita / ZeroWater)', value: 'filtration_jug', group: 'Filtration Jugs' },
];

export const PORTAFILTER_OPTIONS: DropdownOption[] = [
  // None / Not specified
  { label: 'N/A (Standard / Unspecified portafilter)', value: 'N/A', group: 'None / Not Applicable' },

  // MHW-3BOMBER (MH3W)
  { label: 'MHW-3BOMBER 58mm Bottomless Naked Portafilter (Solid Wood Handle)', value: 'MHW-3BOMBER 58mm Bottomless', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 58mm Double Spout Portafilter (Modular Spout)', value: 'MHW-3BOMBER 58mm Double Spout', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 58mm Single Spout Portafilter', value: 'MHW-3BOMBER 58mm Single Spout', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 54mm Breville Bottomless Naked Portafilter', value: 'MHW-3BOMBER 54mm Breville Bottomless', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER 51mm Bottomless Portafilter (Delonghi / La Pavoni)', value: 'MHW-3BOMBER 51mm Bottomless', group: 'MHW-3BOMBER (MH3W)' },

  // Pesado
  { label: 'Pesado 58.5 Modular Bottomless Naked Portafilter', value: 'Pesado 58.5 Bottomless', group: 'Pesado' },
  { label: 'Pesado 58.5 Double Spout Modular Portafilter', value: 'Pesado 58.5 Double Spout', group: 'Pesado' },
  { label: 'Pesado 58.5 Single Spout Modular Portafilter', value: 'Pesado 58.5 Single Spout', group: 'Pesado' },
  { label: 'Pesado 54mm Breville Hybrid Bottomless Portafilter', value: 'Pesado 54mm Breville Bottomless', group: 'Pesado' },

  // IKAPE
  { label: 'IKAPE 58mm Bottomless Naked Portafilter (Wood Ergonomic Handle)', value: 'IKAPE 58mm Bottomless', group: 'IKAPE' },
  { label: 'IKAPE 58mm Double Spout Portafilter', value: 'IKAPE 58mm Double Spout', group: 'IKAPE' },
  { label: 'IKAPE 58mm Single Spout Portafilter', value: 'IKAPE 58mm Single Spout', group: 'IKAPE' },
  { label: 'IKAPE 54mm Breville Bottomless Naked Portafilter', value: 'IKAPE 54mm Breville Bottomless', group: 'IKAPE' },

  // Normcore
  { label: 'Normcore 58mm Bottomless Naked Portafilter (Walnut / Anodized)', value: 'Normcore 58mm Bottomless', group: 'Normcore' },
  { label: 'Normcore 58mm Detachable Double Spout Portafilter', value: 'Normcore 58mm Double Spout', group: 'Normcore' },
  { label: 'Normcore 58mm Single Spout Portafilter', value: 'Normcore 58mm Single Spout', group: 'Normcore' },
  { label: 'Normcore 54mm Breville Bottomless Naked Portafilter', value: 'Normcore 54mm Breville Bottomless', group: 'Normcore' },

  // Artisan & Monolithic Billet
  { label: 'Weber Workshops Buck (Monolithic 58mm Naked)', value: 'Weber Buck Bottomless', group: 'Artisan & Billet' },
  { label: 'Weber Workshops Unifilter (Zero Bypass Integrated Billet)', value: 'Weber Unifilter', group: 'Artisan & Billet' },
  { label: 'SworksDesign Billet Modular Bottomless Portafilter (58mm)', value: 'SworksDesign Billet Bottomless', group: 'Artisan & Billet' },

  // La Marzocco OEM
  { label: 'La Marzocco OEM Stainless Steel Bottomless Naked Portafilter', value: 'La Marzocco OEM Bottomless', group: 'La Marzocco OEM' },
  { label: 'La Marzocco OEM Stainless Double Spout Portafilter', value: 'La Marzocco OEM Double Spout', group: 'La Marzocco OEM' },
  { label: 'La Marzocco OEM Stainless Single Spout Portafilter', value: 'La Marzocco OEM Single Spout', group: 'La Marzocco OEM' },

  // Lelit OEM
  { label: 'Lelit 58mm Bottomless Naked Portafilter (Walnut Handle)', value: 'Lelit OEM Bottomless Walnut', group: 'Lelit OEM' },
  { label: 'Lelit 58mm Double Spout "Coffee Slide" Portafilter', value: 'Lelit OEM Double Spout', group: 'Lelit OEM' },
  { label: 'Lelit 58mm Single Spout "Coffee Slide" Portafilter', value: 'Lelit OEM Single Spout', group: 'Lelit OEM' },

  // Breville / Sage OEM
  { label: 'Breville 54mm Bottomless Naked Portafilter (Bambino / Express)', value: 'Breville 54mm Bottomless', group: 'Breville / Sage OEM' },
  { label: 'Breville 54mm Double Spout OEM Portafilter', value: 'Breville 54mm Double Spout', group: 'Breville / Sage OEM' },
  { label: 'Breville 54mm Single Spout OEM Portafilter', value: 'Breville 54mm Single Spout', group: 'Breville / Sage OEM' },
  { label: 'Breville 58mm Dual Boiler Bottomless Naked Portafilter', value: 'Breville 58mm Bottomless', group: 'Breville / Sage OEM' },
  { label: 'Breville 58mm Dual Boiler Double Spout OEM Portafilter', value: 'Breville 58mm Double Spout', group: 'Breville / Sage OEM' },
  { label: 'Breville 58mm Dual Boiler Single Spout OEM Portafilter', value: 'Breville 58mm Single Spout', group: 'Breville / Sage OEM' },

  // Rocket Espresso OEM
  { label: 'Rocket Espresso 58mm Bottomless Naked Portafilter', value: 'Rocket OEM Bottomless', group: 'Rocket Espresso OEM' },
  { label: 'Rocket Espresso 58mm Double Spout Portafilter', value: 'Rocket OEM Double Spout', group: 'Rocket Espresso OEM' },
  { label: 'Rocket Espresso 58mm Single Spout Portafilter', value: 'Rocket OEM Single Spout', group: 'Rocket Espresso OEM' },

  // ECM & Profitec OEM
  { label: 'ECM / Profitec 58mm Gran Crema Bottomless Naked Portafilter', value: 'ECM Bottomless Naked', group: 'ECM & Profitec OEM' },
  { label: 'ECM / Profitec 58mm Angled Double Spout Portafilter', value: 'ECM Double Spout', group: 'ECM & Profitec OEM' },
  { label: 'ECM / Profitec 58mm Angled Single Spout Portafilter', value: 'ECM Single Spout', group: 'ECM & Profitec OEM' },

  // Gaggia OEM
  { label: 'Gaggia Classic 58mm Bottomless Naked Portafilter', value: 'Gaggia Bottomless Naked', group: 'Gaggia OEM' },
  { label: 'Gaggia Classic 58mm Double Spout OEM Portafilter', value: 'Gaggia Double Spout OEM', group: 'Gaggia OEM' },
  { label: 'Gaggia Classic 58mm Single Spout OEM Portafilter', value: 'Gaggia Single Spout OEM', group: 'Gaggia OEM' },

  // Slayer, Synesso & Kees van der Westen
  { label: 'Slayer Espresso 58mm Hardwood Bottomless Portafilter', value: 'Slayer Bottomless', group: 'Slayer / KvdW / Synesso' },
  { label: 'Slayer Espresso 58mm Double Spout Portafilter', value: 'Slayer Double Spout', group: 'Slayer / KvdW / Synesso' },
  { label: 'Kees van der Westen (KvdW) 58mm Naked Bottomless Portafilter', value: 'KvdW Naked Bottomless', group: 'Slayer / KvdW / Synesso' },
  { label: 'Synesso 58mm Commercial Bottomless Naked Portafilter', value: 'Synesso Bottomless', group: 'Slayer / KvdW / Synesso' },

  // Manual Lever & Portable
  { label: 'Flair 58 Bottomless Naked Portafilter (Walnut Grip)', value: 'Flair 58 Bottomless', group: 'Manual Lever & Portable' },
  { label: 'Cafelat Robot Naked Portafilter (Dual Lever)', value: 'Cafelat Robot Naked', group: 'Manual Lever & Portable' },
  { label: 'Cafelat Robot Spouted Dual Split Portafilter', value: 'Cafelat Robot Spouted', group: 'Manual Lever & Portable' },
  { label: 'Odyssey Argos 58mm Bottomless Naked Portafilter', value: 'Odyssey Argos Bottomless', group: 'Manual Lever & Portable' },
  { label: '9Barista Precision 53mm Portafilter Assembly', value: '9Barista Portafilter Assembly', group: 'Manual Lever & Portable' },
  { label: 'Wacaco Picopresso 52mm Naked Bottomless Portafilter', value: 'Picopresso Naked Portafilter', group: 'Manual Lever & Portable' },
];

export const SHOWER_SCREEN_OPTIONS: DropdownOption[] = [
  // None / Not specified
  { label: 'N/A (Standard factory OEM shower screen)', value: 'N/A', group: 'None / Not Applicable' },

  // Pesado
  { label: 'Pesado High-Extraction Precision Shower Screen (58.5mm / 200µm Integrated Membrane)', value: 'Pesado High-Extraction Screen', group: 'Pesado' },
  { label: 'Pesado Reinforced Laser-Cut Dispersion Screen (E61 / La Marzocco)', value: 'Pesado Reinforced Laser Screen', group: 'Pesado' },

  // IKAPE
  { label: 'IKAPE High-Flow Stainless Steel Shower Screen (58.5mm E61)', value: 'IKAPE 58.5mm Stainless Screen', group: 'IKAPE' },
  { label: 'IKAPE Nanotech Non-Stick Shower Screen (58mm E61 / La Marzocco)', value: 'IKAPE Nanotech Screen', group: 'IKAPE' },
  { label: 'IKAPE Breville 54mm Precision Replacement Shower Screen', value: 'IKAPE Breville 54mm Screen', group: 'IKAPE' },
  { label: 'IKAPE Gaggia Classic 58mm Precision Dispersion Screen', value: 'IKAPE Gaggia Screen', group: 'IKAPE' },

  // MHW-3BOMBER (MH3W)
  { label: 'MHW-3BOMBER Titanium Coated Precision Shower Screen (58.5mm E61)', value: 'MHW-3BOMBER Titanium Shower Screen', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Sintered Mesh Dispersion Shower Screen', value: 'MHW-3BOMBER Sintered Screen', group: 'MHW-3BOMBER (MH3W)' },
  { label: 'MHW-3BOMBER Breville 54mm Nano Dispersion Screen', value: 'MHW-3BOMBER Breville 54mm Screen', group: 'MHW-3BOMBER (MH3W)' },

  // IMS Competition & E&B Lab
  { label: 'IMS Competition Nanotech E61 200 NT (Quartz Nanotechnology)', value: 'IMS E61 200 NT Nanotech', group: 'IMS & E&B Lab' },
  { label: 'IMS Competition E61 Integrated Membrane (E61 200 IM)', value: 'IMS E61 200 IM', group: 'IMS & E&B Lab' },
  { label: 'IMS Competition La Marzocco / Slayer / Synesso (MA 200 IM)', value: 'IMS MA 200 IM (LM/Slayer)', group: 'IMS & E&B Lab' },
  { label: 'IMS Competition Breville 54mm (BV 200 IM / Bambino / Express)', value: 'IMS BV 200 IM (Breville 54mm)', group: 'IMS & E&B Lab' },
  { label: 'IMS Competition Gaggia Classic (GA 200 IM)', value: 'IMS GA 200 IM (Gaggia)', group: 'IMS & E&B Lab' },
  { label: 'E&B Lab All-in-One Reinforced Matrix Membrane (E61 200 RNT)', value: 'E&B Lab E61 200 RNT', group: 'IMS & E&B Lab' },

  // Specialty Diffusion & OEM
  { label: 'SworksDesign Billet Diffusion Dispersion Screen (Ultra-Even Flow)', value: 'SworksDesign Billet Diffusion', group: 'Specialty Diffusion' },
  { label: 'Matrix Sintered Stainless Multi-Layer Group Dispersion Screen', value: 'Matrix Sintered Group Screen', group: 'Specialty Diffusion' },
  { label: 'Slayer OEM Precision Saturated Group Screen', value: 'Slayer OEM Dispersion Screen', group: 'Specialty Diffusion' },
  { label: 'La Marzocco OEM Factory Stainless Screen', value: 'La Marzocco OEM Screen', group: 'Specialty Diffusion' },
];
