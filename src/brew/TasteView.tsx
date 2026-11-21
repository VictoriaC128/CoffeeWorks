import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { BrewModel } from './model';
import { Btn, Caps } from './ui';
import { StepTime } from './useBrewTimer';
import { SensoryRating } from '../types/coffee';
import { useCoffee } from '../context/CoffeeContext';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { shiftGrind, grindShort } from './steps';
import { LayoutMode } from '../shell/LayoutContext';

const VERDICTS: { id: SensoryRating['verdict']; label: string; full: string }[] = [
  { id: 'under_extracted', label: 'Under', full: 'Under-extracted: sour, thin' },
  { id: 'balanced', label: 'Balanced', full: 'Balanced' },
  { id: 'over_extracted', label: 'Over', full: 'Over-extracted: bitter, dry' },
  { id: 'channeling', label: 'Channeled', full: 'Channeled' },
  { id: 'stalled', label: 'Stalled', full: 'Stalled' },
];
const SCALES: { key: keyof Omit<SensoryRating, 'verdict'>; label: string }[] = [
  { key: 'acidity', label: 'Acidity' },
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'bitterness', label: 'Bitterness' },
  { key: 'body', label: 'Body' },
  { key: 'overall', label: 'Overall' },
];
const COMMON_TAGS = ['Chocolate', 'Caramel', 'Nutty', 'Citrus', 'Berry', 'Floral', 'Honey', 'Stone fruit'];

/** After the brew: numbers shrink to a strip, taste and notes take over. */
export const TasteView: React.FC<{ m: BrewModel; layout: LayoutMode; stepTimes: StepTime[]; totalSec: number; onDone: () => void }> = ({ m, layout, stepTimes, totalSec, onDone }) => {
  const { logBrewSession, getDialInAdvice, calculateExtractionYield, updateRecipe } = useCoffee();
  const { settings } = useSettings();
  const u = settings.units;
  const { recipe, setup, mode, bean } = m;
  const [sensory, setSensory] = useState<SensoryRating>({ overall: 3, acidity: 3, sweetness: 3, bitterness: 2, body: 3, verdict: 'balanced' });
  const [tags, setTags] = useState<string[]>([]);
  const [extraTags, setExtraTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [pourNotes, setPourNotes] = useState('');
  const [tasteNotes, setTasteNotes] = useState('');
  const [tds, setTds] = useState('');
  const [saved, setSaved] = useState(false);
  const wide = layout !== 'simple';

  const tdsN = parseFloat(tds);
  const ey = tdsN > 0 ? calculateExtractionYield(setup.dose, setup.water, tdsN) : undefined;
  const avgFlow = setup.water / Math.max(1, totalSec);
  const targetFlow = recipe.targetFlowRateGs || recipe.yieldGrams / Math.max(1, recipe.targetTotalTimeSeconds);
  const advice = getDialInAdvice(recipe.category, Math.round(totalSec), recipe.targetTotalTimeSeconds, avgFlow, targetFlow, ey, sensory.verdict);
  const grindDelta = sensory.verdict === 'under_extracted' ? -2 : sensory.verdict === 'over_extracted' || sensory.verdict === 'stalled' ? 2 : 0;
  const nextGrind = grindDelta ? shiftGrind(setup.grind, grindDelta) : null;
  const allTags = useMemo(() => Array.from(new Set([...(bean?.tastingNotes || []), ...COMMON_TAGS, ...extraTags])), [bean, extraTags]);

  const save = (useNext: boolean) => {
    logBrewSession({
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      category: recipe.category,
      beanName: bean?.name || 'Unknown bean',
      beanId: setup.beanId,
      actualDoseGrams: setup.dose,
      actualYieldGrams: setup.water,
      actualRatio: Number((setup.water / (setup.dose || 1)).toFixed(2)),
      actualPreInfusionSeconds: recipe.preInfusionSeconds,
      actualTotalTimeSeconds: Math.round(totalSec * 10) / 10,
      actualFlowRateGs: Number(avgFlow.toFixed(2)),
      refractometerTdsPercent: tdsN > 0 ? tdsN : undefined,
      calculatedExtractionYieldPercent: ey,
      sensory,
      sensoryNotes: tasteNotes.trim(),
      pourNotes: pourNotes.trim(),
      flavourTags: tags,
      dialInAdvice: advice,
      grindSetting: setup.grind,
      waterTempC: setup.tempC,
      waterGrams: setup.water,
      stepTimes,
      prepUsed: setup.prep.map((p) => ({ name: p.name, tool: p.tool, use: p.use })),
      toolsUsed: {
        machine: m.gear?.machineModel,
        grinder: m.gear?.grinderModel,
        water: m.water?.name,
        portafilter: recipe.portafilter || m.gear?.portafilter,
        showerScreen: recipe.showerScreen || m.gear?.showerScreen,
        paper: m.gear?.filterPaperType,
        dripper: m.gear?.dripperModel,
      },
    });
    if (useNext && nextGrind) updateRecipe(recipe.id, { grindSetting: nextGrind });
    setSaved(true);
    onDone();
  };

  const stat = (k: string, v: React.ReactNode, cls = '') => (
    <div className="px-4 py-2.5 border-r border-b border-rule min-w-0"><div className={`label-caps !text-[10.5px] ${cls}`}>{k}</div><div className={`text-[20px] font-bold num mt-0.5 ${cls}`}>{v}</div></div>
  );

  return (
    <div className="min-h-full flex flex-col">
      <header className={`${mode.bg} ${mode.on} px-5 sm:px-7 py-3 flex items-center gap-4`}>
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-85 whitespace-nowrap">{m.lot} · brew {m.brewNumber}</span>
        <span className="font-black text-[18px] sm:text-[20px] truncate flex-1" style={{ fontStretch: '106%' }}>{recipe.title}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] border border-current px-2 py-1 whitespace-nowrap">Brew finished</span>
      </header>

      <section className={`grid border-b border-ink ${wide ? 'grid-cols-[repeat(6,auto)_1fr]' : 'grid-cols-3'}`}>
        {stat('Total', F.clock(totalSec, u))}
        {stat('In → out', `${F.coffee(setup.dose, u).value} → ${F.text(F.scale(setup.water, u, mode.scaleIsWater))}`)}
        {stat('Ratio', `1:${(setup.water / (setup.dose || 1)).toFixed(1)}`)}
        {stat('Avg flow', F.text(F.flow(avgFlow, u)), 'text-flow !text-flow')}
        <div className="px-4 py-2.5 border-r border-b border-rule">
          <label className="label-caps !text-[10.5px]" htmlFor="tds">TDS %</label>
          <input id="tds" inputMode="decimal" value={tds} onChange={(e) => setTds(e.target.value)} placeholder="—" className="block w-16 bg-transparent border-b border-ink text-[18px] font-bold num mt-0.5 h-8" />
        </div>
        {stat('EY', ey !== undefined ? `${ey} %` : '—')}
        <div className={`px-4 py-2.5 border-b border-rule min-w-0 ${wide ? '' : 'col-span-3'}`}>
          <div className="label-caps !text-[10.5px]">Step times · plan</div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[13px]">
            {stepTimes.map((s, i) => (
              <span key={i}><span className="text-mute">{s.name.split(' ')[0]}</span> <b className="num">{F.clock(s.actualSeconds, u)}</b> <span className="text-mute">{F.clock(s.plannedSeconds, u)}</span></span>
            ))}
          </div>
        </div>
        <div className="col-span-full px-4 sm:px-7 py-1.5 text-[13px] text-mute">
          Prep saved with this brew · <b className="text-ink">{F.text(F.coffee(setup.dose, u))}</b> · <b className="text-ink">{grindShort(setup.grind)}</b> · <b className="text-ink">{F.text(F.temp(setup.tempC, u))}</b>
          {m.water && <> · <b className="text-ink">{m.water.name.split('(')[0].trim()}, GH {m.water.ghPpm}</b></>}
          {setup.prep.filter((p) => !p.use).length > 0 && <> · skipped {setup.prep.filter((p) => !p.use).map((p) => p.name).join(', ')}</>}
        </div>
      </section>

      <section className={`grid flex-1 ${wide ? 'grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        <div className="px-5 sm:px-7 py-4">
          <h2 className="text-[26px] font-extrabold tracking-[-0.01em]">How does it taste?</h2>
          <Caps className="mt-3 mb-1.5">Verdict</Caps>
          <div role="radiogroup" aria-label="Verdict" className={`grid border border-ink ${wide ? 'grid-cols-5' : 'grid-cols-2'}`}>
            {VERDICTS.map((v, i) => (
              <button key={v.id} type="button" role="radio" aria-checked={sensory.verdict === v.id} aria-label={v.full} title={v.full} onClick={() => setSensory((s) => ({ ...s, verdict: v.id }))}
                className={`min-h-[52px] px-2 text-[14px] font-bold border-rule ${i ? 'border-l' : ''} ${!wide && i > 1 ? 'border-t' : ''} ${sensory.verdict === v.id ? 'bg-ink text-paper' : 'hover:bg-tint'}`}>
                {v.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            {SCALES.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-[96px_1fr] items-center gap-3">
                <span className="text-[15px] font-semibold">{label}</span>
                <div role="radiogroup" aria-label={label} className="grid grid-cols-5 border border-ink max-w-[300px]">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={sensory[key] === n} onClick={() => setSensory((s) => ({ ...s, [key]: n }))}
                      className={`h-12 text-[15px] font-bold ${n > 1 ? 'border-l border-ink' : ''} ${sensory[key] === n ? `${mode.bg} ${mode.on}` : 'hover:bg-tint'}`}>{n}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Caps className="mt-5 mb-1.5">Flavour notes</Caps>
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => {
              const on = tags.includes(t);
              return (
                <button key={t} type="button" aria-pressed={on} onClick={() => setTags((x) => (on ? x.filter((y) => y !== t) : [...x, t]))}
                  className={`min-h-[44px] px-3.5 text-[14px] font-semibold border ${on ? 'bg-ink text-paper border-ink' : 'border-rule hover:border-ink'}`}>{t}</button>
              );
            })}
            <form className="flex" onSubmit={(e) => { e.preventDefault(); const t = newTag.trim(); if (t) { setExtraTags((x) => [...x, t]); setTags((x) => [...x, t]); setNewTag(''); } }}>
              <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a note" className="h-11 w-32 border border-rule px-2.5 text-[14px]" aria-label="New flavour note" />
              <button type="submit" className="h-11 w-11 border border-l-0 border-ink flex items-center justify-center" aria-label="Add flavour note"><Plus className="w-4 h-4" /></button>
            </form>
          </div>
        </div>

        <aside className={`${wide ? 'border-l' : 'border-t'} border-rule px-5 py-4 flex flex-col gap-3`}>
          <label className="block">
            <Caps className="mb-1">Pour notes</Caps>
            <textarea value={pourNotes} onChange={(e) => setPourNotes(e.target.value)} rows={3} placeholder="How the pours, bed and drawdown went" className="w-full border border-ink p-3 text-[15px] leading-snug bg-paper" />
          </label>
          <label className="block">
            <Caps className="mb-1">Taste notes</Caps>
            <textarea value={tasteNotes} onChange={(e) => setTasteNotes(e.target.value)} rows={3} placeholder="What you taste, and how it changes as it cools" className="w-full border border-ink p-3 text-[15px] leading-snug bg-paper" />
          </label>
          <div className="border border-ink px-4 py-3">
            <b className="bg-ink text-paper text-[10.5px] tracking-[0.1em] uppercase px-1.5 py-1">Dial-in · next brew</b>
            <p className="text-[14.5px] leading-snug mt-2.5">{advice[0]}</p>
            <dl className="mt-2 text-[13.5px]">
              <div className="flex justify-between py-1.5 border-t border-rule"><dt>Grind</dt><dd className="font-bold">{nextGrind ? <><s className="font-normal text-mute">{grindShort(setup.grind)}</s> → {grindShort(nextGrind)}</> : `${grindShort(setup.grind)}, no change`}</dd></div>
              <div className="flex justify-between py-1.5 border-t border-rule"><dt>Temp</dt><dd>{F.text(F.temp(setup.tempC, u))}, no change</dd></div>
            </dl>
          </div>
        </aside>
      </section>

      <footer className="border-t border-ink flex flex-wrap items-center gap-3 px-5 sm:px-7 py-3">
        <Btn onClick={onDone} disabled={saved}>Skip</Btn>
        <span className="text-[12px] text-mute">Saves to History as {m.lot} · brew {m.brewNumber}</span>
        <Btn variant={nextGrind ? 'secondary' : 'primary'} className="ml-auto px-8" onClick={() => save(false)} disabled={saved}>Save</Btn>
        {nextGrind && <Btn variant="primary" onClick={() => save(true)} disabled={saved}>Save &amp; use {grindShort(nextGrind)} next</Btn>}
      </footer>
    </div>
  );
};
