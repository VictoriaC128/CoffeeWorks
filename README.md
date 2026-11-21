# CoffeeWorks — Precision Coffee Recipe Vault & Dial-in Station

An advanced, responsive coffee dial-in station and recipe vault designed to eliminate the cognitive overhead of managing countless coffee variables—from bean varietals and fermentation processes, to 2026 puck preparation tools, machine profiling, global water chemistry, and traditional sock-brewed Singaporean Kopi.

---

## 🌟 Key Capabilities & Architecture

### 1. Six Distinct Coffee Disciplines
1. **⚡ Benchtop Electric Espresso**:
   - Machine profiling: Flow control needle valves, programmable pre-infusion, line vs. pump pressure.
   - Puck preparation: Needle WDT (0.25mm retractable, planetary gear), calibrated spring tampers (30 lbs, 25 lbs), electronic auto-tampers (Puqpress), high-extraction baskets (WAFO Spirit, Weber Unibasket, Pullman 876), and dual-filtration layers (0.2mm billet puck screens, bottom basket paper filters).
2. **🦾 Manual Lever & Alternative Pressure**:
   - Lever presses (Flair 58+, Cafelat Robot, Odyssey Argos) and portable handheld units (Wacaco Picopresso, CO2 cartridge/pneumatic devices).
   - Chamber pre-heating protocols and manual declining pressure profiling curves.
3. **🔥 Stovetop & Moka Pot**:
   - 9Barista jet-engineered twin boiler, Bialetti Brikka (dual weighted valve), and classic Moka pots.
   - Water temperature in boiler, flame/induction control, emergence to sputter cutoff timeline.
4. **💧 Modern Filter Coffee (Percolation & Hybrid Immersion)**:
   - Drippers: Orea V4 Modular (Apex, Fast, Open, Classic bases), UFO Dripper (ultra-wide shallow bed), NextLevel Pulsar (zero-bypass hybrid), Graycano (Lava ribs), Origami, Fellow Stagg [X/XF], Hario V60, Chemex.
   - Reusable Porous Ceramic Micro-Filters: LOCA Arita-ware and Cofil Fuji alumina filters (eliminating paper taste, retaining aromatic coffee oils).
   - Filter Paper Synergy Matrix: Sibarist FAST Cone/Flat/UFO papers, Cafec Abaca/T-90/T-83, Chemex bonded, and Kalita Wave fluted.
   - Tooling: Orea Negotiator tool (custom pleating flat papers against walls to control bypass).
   - Hybrid Immersion Toggles: Scheduled open/closed valve routines (Hario Switch, Pulsar, Clever).
5. **⏳ Immersion & Hybrid**:
   - AeroPress (Standard vs. Inverted), Flow Control Cap, Fellow Prismo, French Press, Cold Brew.
   - Agitation schedules, steep duration, and plunge resistance.
6. **🇸🇬 Traditional Singaporean Kopi (Nanyang Heritage)**:
   - Wok-roasted Robusta beans caramelized with Planta butter/margarine and sugar.
   - Long-spout stainless steel kettle and traditional flannel cloth sock strainer (*kopi bag*).
   - Dynamic dialect formulation engine: *Kopi, Kopi-O, Kopi-C, Kopi-Kosong, Kopi-O Kosong, Kopi-C Kosong, Gao (thick), Po (light), Di-lo (undiluted essence), and Peng (iced)*.

---

### 2. Global Water Chemistry & Profiling Lab
Tracks **TDS** ($ppm$), **General Hardness GH** ($Ca^{2+}, Mg^{2+}$), **Carbonate Hardness / Alkalinity KH** ($HCO_3^-$ buffer), and **pH**:
- **Municipal Tap Profiles**: Singapore PUB (ultra-soft ~70 ppm), Tokyo snowmelt (~48 ppm), Melbourne specialty baseline (~50 ppm), Seattle (~42 ppm), New York City (~58 ppm), London Thames chalk (~320 ppm), Berlin (~360 ppm).
- **Bottled Waters**: Volvic (SCA benchmark ~130 ppm), Evian (~345 ppm), Crystal Geyser (~120 ppm), Ashbeck (~85 ppm), Spa Reine (~33 ppm).
- **Remineralized Recipes**: Third Wave Water (Classic & Espresso Machine-Safe), Lotus Water Drops, and Peak Water adjustable bypass jug.

---

### 3. Live Brew Station & High-Precision Stopwatch
- **Real-Time Flow Rate ($g/s$) Speedometer**: Computes live bed drawdown speed ($\text{Yield} \div \text{Time}$) with target pacing indicator.
- **Split Timers**: Pre-infusion / Bloom, Pulse pours, Immersion steep, and Drawdown.
- **Extraction Yield (EY %) Refractometer Matrix**:
  $$\text{EY \%} = \frac{\text{Yield } (g) \times \text{Beverage TDS \%}}{\text{Dry Dose } (g)}$$
  Categorizes extraction into Under-extracted ($<18\%$), Balanced ($18.5\% - 22\%$), and Modern High-Extraction ($22\% - 25.5\%+$).
- **Smart Barista Dial-in Advisor**: Recommends grind micron adjustments, temperature tweaks, or WDT fixes based on flow rate and sensory feedback (sour vs. balanced vs. bitter).

---

### 4. Bean Cellar & Degassing Tracker
- Tracks varietal, elevation, roast level, and processing (Washed, Natural, Honey, Anaerobic Fermentation, Carbonic Maceration, Thermal Shock, Co-fermented, Traditional Wok Roast).
- Automatic **Days Off Roast** calculation with resting vs. peak flavor window alerts.

---

## 🛠️ Technology Stack
- **Platform**: Android app for phones and tablets (Capacitor 8). The same code can be packaged for iPhone/iPad later.
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS on the Roaster's Label design tokens (`src/index.css`): 5 colour themes, 5 bundled fonts, no network fonts
- **Icons**: Lucide Icons
- **Native**: keep-awake while brewing, haptics on step change, orientation lock, edge-to-edge insets, Android back gesture
- **Persistence**: offline-first; data lives in native storage (Capacitor Preferences) mirrored to the WebView, with copy/paste backup in Settings

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Work on the UI in a browser (resize or rotate devtools to see the tilt layouts)
npm run dev

# 3. Build the web bundle and copy it into the Android project
npm run build
npx cap sync android
```

### Build and run on Android

Needs JDK 21 and the Android SDK (platform 36). Android Studio includes both.

```bash
# Open in Android Studio, then Run on a phone or emulator
npx cap open android

# Or build a debug APK from the command line
cd android
./gradlew assembleDebug        # → android/app/build/outputs/apk/debug/app-debug.apk
```

Point Gradle at the SDK with `android/local.properties` (not committed), for example `sdk.dir=C:/Users/<you>/Android/sdk`, and set `JAVA_HOME` to the JDK.

For Google Play, build a signed release bundle (`./gradlew bundleRelease` with a signing config, or Android Studio → Build → Generate Signed App Bundle). The app id is `com.coffeeworks.app` in `capacitor.config.ts`; change it before the first upload if you want a different one.
