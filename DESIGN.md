---
name: CoffeeWorks
description: Roaster's Label: a brew station that reads like a printed coffee label, at arm's length on a phone or tablet.
colors:
  paper: "#FFFFFF"
  ink: "#151515"
  mute: "#6B6B66"
  rule: "#E3E2DD"
  tint: "#F3F2EE"
  flow: "#E8590C"
  ok: "#1F7A55"
  bad: "#D62828"
  mode-espresso: "#D62828"
  mode-lever: "#5D6B2F"
  mode-moka: "#E9B523"
  mode-filter: "#2747D6"
  mode-immersion: "#1F7A8C"
  mode-kopi: "#1F7A55"
typography:
  timer:
    fontFamily: "Archivo Variable"
    fontSize: "clamp(72px, min(17vh, 33vw), 200px)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo Variable"
    fontSize: "28px"
    fontWeight: 900
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  value:
    fontFamily: "Archivo Variable"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: "Archivo Variable"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Archivo Variable"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  none: "0"
spacing:
  gutter-phone: "16px"
  gutter-tablet: "28px"
  target: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "56px"
  label-band:
    backgroundColor: "{colors.mode-filter}"
    textColor: "{colors.paper}"
    padding: "16px 28px"
  step-now:
    backgroundColor: "{colors.mode-filter}"
    textColor: "{colors.paper}"
---

# CoffeeWorks design system: Roaster's Label

Source of truth: `src/index.css` (tokens, themes, fonts), `tailwind.config.js` (token classes), `src/brew/ui.tsx` (Btn, Stepper, Segmented, Caps, Sheet), `src/brew/modes.ts` (discipline colours). Mockups that set the direction live in `.impeccable/mocks/v2/`.

## Overview

The app is a printed coffee label: a white ground, ink type, hairline rules, and one solid band of colour per brew that says which discipline is running. Everything is read standing at the bar, glanced at mid-pour, on a phone propped by the scale or a tablet on the counter. The time left in the current step is always the largest thing on the brewing screen. Depth comes from type size and rules, never from shadows or cards.

## Colors

- **Paper / ink / mute / rule / tint** are the neutral system. Five themes swap them: Paper (default), Oat, Olive, Roast (deep espresso brown) and Night (black). Tokens are RGB triplets, so `bg-ink/10` works.
- **Mode colours** belong to the six disciplines and never change between themes. Use them for the label band, the current step and the user's own edits in the step editor. Moka yellow takes ink text (`MODES.moka_stovetop.on`); the others take white.
- **Flow orange is reserved for flow rate** (the flow panel, the timeline playhead, avg flow). Never use it for decoration, warnings or edits. Each theme shades it so it stays readable.
- `ok` and `bad` are for confirmations and destructive actions only.

## Typography

- One family per theme: Archivo by default; the user can pick Atkinson Hyperlegible, Lexend, Space Grotesk or Fredoka. All are bundled (no network).
- Numbers use tabular figures everywhere. Big readings use the `.num` utility: Archivo's 78% width axis makes timers condensed; other fonts ignore it.
- Scale steps: timer (clamp, 72–200px) → reading values (36–52px) → titles (19–28px, weight 900) → body 14–16px → labels 11px uppercase, tracking 0.12em (`.label-caps`).
- Labels sit above data values and form fields, never as decorative kickers above headings.

## Layout

- The layout follows how the device is held (`src/shell/LayoutContext.tsx`):
  - **simple** (upright phone or tablet): one column with bottom tabs (Brew, Recipes, Kopi, Beans, More).
  - **full** (sideways tablet): 212px rail with sections and daily drivers.
  - **compact** (sideways phone): 64px rail of mode squares.
- Settings → Screen layout can keep simple or full regardless of tilt, and the brew screen's Auto/Locked chip pins the current layout.
- Gutters are 16px on phones and 28px on tablets. Each screen draws its own edges: a full-width header band, then ruled sections.
- Safe areas come from the `--safe-*` variables (Capacitor injects Android insets). Apply `pt-safe`/`pb-safe` on outer chrome.
- Touch targets are at least 48px (44px minimum for dense table controls), 8px apart.

## Elevation & Depth

Flat. There are no drop shadows (the config maps every `shadow-*` to none). Sheets sit over a light scrim with a 2px ink edge. Hierarchy comes from the colour band, 1px rules, and type size.

## Shapes

Square corners everywhere (all `rounded-*` map to 0). Circles are kept only for radio dots. Lines are 1px `rule` inside sections and 1px `ink` to close a section or frame a control.

## Components

- **Label band**: mode colour with lot line (`CW-004 · Filter · 15 g → 250 ml · 1:16.7 · 92 °C`), recipe title (tap to switch recipe) and, on tablets, a spec list with Change buttons for bean and grind.
- **Step countdown**: "Step n of N", step name, time left (largest), "of planned", target line.
- **Side panels**: Total, Flow (orange), then Pressure (espresso/lever) or Next.
- **Step boxes**: start with a 00 prep box; done steps are struck through with their actual time over the plan; the current step fills with the mode colour.
- **Timeline**: segments sized by time, ticks every 1 s or 5 s, done = ink, current = mode colour fill, flow-orange playhead.
- **Buttons**: one ink primary per screen; secondary is ink outline; ghost is underlined text.
- **Stepper / Segmented**: ruled, square, 48px cells.
- **Sheet**: side sheet on wide layouts, bottom sheet on phones; the Android back gesture closes it.
- **Step editor**: changed values show in the mode colour with the preset value struck through underneath; new steps are tinted and tagged NEW.

## Do's and Don'ts

- Do keep the time left in the step as the biggest number on the brewing screen.
- Do show units through `src/settings/format.ts`. Stored data is always grams, °C, ppm and seconds.
- Do use lucide icons or mode colour squares. Don't use emoji or unicode glyphs as icons.
- Don't use rounded cards, nested cards, gradients, glows, blur or coloured shadows.
- Don't use orange for anything but flow.
- Don't use monospace as a "technical" costume; tabular Archivo numerals do that job.
- Don't rely on hover; every action is a visible, tappable control.
