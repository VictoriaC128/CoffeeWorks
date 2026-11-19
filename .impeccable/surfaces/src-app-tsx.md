---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/LiveBrewStopwatch.tsx"]
---

Scope: whole CoffeeWorks app shell (all tabs), Operate mode. Lead surface: Live Brew Station.

Audience/job: home baristas scaling to café service; phone by the scale and iPad on the counter. Get from recipe to running brew fast, read step timing at arm's length, record taste after.

User decisions (19 Nov 2026):
- Chose Roaster's Label; keep the left menu rail for fast mode switching.
- Time per step is the largest number on the brew screen; schedule larger and easier to read (cupping-sheet style step boxes + tick bar).
- Flow rate always in its own font colour.
- After extraction: brew info shrinks; taste profile + pour notes + taste notes recorded for future reference.
- Keep dial-in suggestions.

## Direction contract

THESIS: Every recipe is printed like the roaster's bag it came from. Refuses the dark mocha/amber card grid and the grey rounded brew-app default.
OWN-WORLD: White ground, #151515 ink, 1px rules, no radius. One flat label colour per discipline (espresso #E0452B, lever #5D6B2F, moka #E9B523, filter #2747D6, immersion #1F7A8C, kopi #1F7A55) fills only the active recipe's label band. One grotesk (Archivo, width axis) with tabular figures carries everything. Lot numbers CW-### on recipes, beans, shots. Done steps struck through.
STORY: The barista picks a daily driver from the rail, sees the label, brews reading the step clock, then tastes, scores and notes, and gets the next dial-in move.
FIRST VIEWPORT: Left rail (nav + daily drivers). Label band across the top. Below, the current step's countdown is the largest element, total time secondary, flow rate in its own colour; step boxes with durations in a row beneath; dial-in note; bottom action bar with Finish primary at the right.
FORM: Roaster's Label, position 3 on ordered list; seed:ec54187308b64698
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
