# Product

<!-- impeccable:product-schema 1 -->

## Platform

android — a mobile app for phones and tablets only, never a desktop/PC app. The React web code is wrapped as a native Android app (Capacitor) and published on Google Play. The same codebase should stay iOS-capable for a later App Store release, but Android is the foundation and the first target.

## Users

- **Home baristas** dialling in espresso, lever, moka, filter, immersion and Singaporean kopi at a home brew bar.
- **Café baristas** using the same tool in a "café mode": pulling a saved recipe up fast during service or training and running it without digging through forms.
- The same person often moves between both scenes; the app must scale from one hobbyist's bench to a counter in service.

## Product Purpose

CoffeeWorks removes the cognitive overhead of managing coffee variables. It stores recipes per brewing discipline, runs a live brew (timer, splits, flow rate, EY%), advises on the next dial-in move, and keeps the beans, gear, water and history those recipes depend on. Success: a barista gets from "which recipe?" to a running brew in seconds, and learns from each shot.

## Positioning

One station that spans six disciplines — benchtop espresso, manual lever, stovetop/moka, modern filter, immersion, and traditional Nanyang kopi — with granular tool stacks (puck prep, filter papers, water chemistry) that generic brew timers do not model. The kopi dialect engine (Kopi, O, C, Kosong, Gao, Po, Di-lo, Peng) is a Singapore-specific capability.

## Operating Context

- Used standing at the bar: a **phone propped by the scale** (wet hands, quick taps, glanced at mid-pour) and a **tablet on the counter** (Android tablet first, iPad later), sometimes facing the barista.
- Planning, gear setup and history review also happen on the phone or tablet. There is no desktop or PC use.
- Held upright the app shows the simple one-column layout; turned sideways it shows the full layout with the mode rail. Users can lock either.
- Rituals: grind, puck prep, pre-infusion/bloom, pours, drawdown, tasting, logging.

## Capabilities and Constraints

- Tabs today: Recipe Vault, Drink Lab, Live Brew Station, Kopi Calculator, Bean Cellar, Gear Locker, Water Lab, Dial-in History; plus onboarding / "Customise Setup & Tools".
- Every dropdown supports custom "Others…" labels and an N/A option; per-method default recipe ("daily driver") and tool-selection persistence.
- React 18 + Vite + TypeScript + Tailwind; Lucide icons; offline-first with JSON export/import.
- Android-ready foundation: Capacitor Android project; data in native storage (not WebView LocalStorage, which the OS may clear); screen kept awake while brewing; haptics on step change; native orientation lock; edge-to-edge layout respecting status and navigation bars; Android back gesture handled (never silently drops a running brew).
- Touch only: no hover-dependent UI, tap targets sized for wet hands, works across phone and tablet screen sizes and aspect ratios.
- Undecided: whether "café mode" is a distinct UI mode or the same UI with faster recipe access.

## Brand Commitments

- Name: **CoffeeWorks**. No other binding visual assets (logo is a Lucide coffee icon today).

## Evidence on Hand

- Real content: default recipes (`src/data/defaultRecipes.ts`), beans, gear, water profiles, drinks catalog, dropdown catalog.
- No testimonials, user counts, or press. Do not invent them.

## Product Principles

1. Brew first: the path from recipe to a running timer is the shortest path in the app.
2. Readable at arm's length: key numbers (dose, yield, ratio, time, flow) legible at a glance on phone and tablet.
3. Depth on demand: granular variables exist but never block a quick brew.
4. Every discipline is first-class, kopi included.
5. Learn from each shot: history and advice close the loop.
