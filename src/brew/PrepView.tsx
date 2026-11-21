import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { BrewModel } from './model';
import { Btn, Caps, Segmented, Stepper } from './ui';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { useCoffee } from '../context/CoffeeContext';
import { shiftGrind, grindShort } from './steps';
import { LayoutMode } from '../shell/LayoutContext';

const EFFECTS_PRESSURE: [string, string][] = [
  ['Dose', 'More coffee: stronger, heavier, slower shot.'],
  ['Grind', 'Finer: slower, sweeter, more body. Too fine: bitter, dry.'],
  ['Brew temp', 'Hotter pulls more out. Light roasts like 93–95 °C.'],
  ['Puck prep', 'WDT, tamp, screen: even bed, fewer channels, no sour-bitter mix.'],
];
const EFFECTS_WATER: [string, string][] = [
  ['Water temp', 'Hotter: fuller, sweeter. Cooler: brighter, lighter.'],
  ['Hardness', 'Soft: sparkling acid, light body. Hard or KH over ~50: heavier, duller fruit.'],
  ['Grind', 'Finer: slower drawdown, more body. Too fine: bitter, stalls.'],
  ['Dose · water', 'More coffee or less water: stronger cup. Ratio updates as you change either.'],
];

/** Step 00: dose, water, grind, temperature, water profile and the prep checklist. */
export const PrepView: React.FC<{ m: BrewModel; layout: LayoutMode; onDone: () => void; onBack: () => void }> = ({ m, layout, onDone, onBack }) => {
  const { settings, setUnit } = useSettings();
  const { waterProfiles, updateRecipe } = useCoffee();
  const u = settings.units;
  const { setup, setSetup, recipe, mode } = m;
  const isEsp = mode.pressure;
  const wp = waterProfiles.find((w) => w.id === setup.waterProfileId);
  const ratio = setup.water / (setup.dose || 1);
  const grindChanged = setup.grind !== recipe.grindSetting;
  const wide = layout !== 'simple';

  const set = (patch: Partial<typeof setup>) => setSetup((s) => ({ ...s, ...patch }));
  const toggleDone = (id: string) => setSetup((s) => ({ ...s, prepDone: s.prepDone.includes(id) ? s.prepDone.filter((x) => x !== id) : [...s.prepDone, id] }));
  const toggleUse = (id: string, use: boolean) => setSetup((s) => ({ ...s, prep: s.prep.map((p) => (p.id === id ? { ...p, use } : p)) }));
  const nowId = setup.prep.find((p) => p.use && !setup.prepDone.includes(p.id))?.id;
  const usedCount = setup.prep.filter((p) => p.use).length;
  const doneCount = setup.prep.filter((p) => p.use && setup.prepDone.includes(p.id)).length;

  const savePrep = () => updateRecipe(recipe.id, { prepItems: setup.prep, doseGrams: setup.dose, yieldGrams: setup.water, ratio: Number(ratio.toFixed(2)), waterTempC: setup.tempC, grindSetting: setup.grind, waterProfileId: setup.waterProfileId });

  const dial = (key: string, k: React.ReactNode, value: string, unit: string, sub: React.ReactNode, ctl: React.ReactNode, changed = false) => (
    <div key={key} className="px-4 sm:px-5 py-3 border-r border-b border-rule min-w-0 flex flex-col">
      <Caps className="flex items-center gap-1.5">{k}</Caps>
      <div className={`num font-extrabold leading-none mt-2 mb-1 whitespace-nowrap ${wide ? 'text-[52px]' : 'text-[44px]'} ${changed ? mode.text : ''}`}>
        {value}<span className="text-[18px] font-semibold text-mute ml-1 tracking-normal" style={{ fontStretch: '100%' }}>{unit}</span>
      </div>
      <div className="text-[13px] text-mute leading-snug min-h-[34px]">{sub}</div>
      <div className="mt-2">{ctl}</div>
    </div>
  );

  const unitToggle = <K extends 'coffee' | 'water' | 'hardness' | 'temp'>(key: K, opts: { value: string; label: string }[]) => (
    <Segmented small label={`${key} unit`} value={u[key] as string} options={opts} onChange={(v) => setUnit(key, v as never)} className="ml-auto" />
  );

  const dials = [
    dial('dose', 'Dose', F.coffee(setup.dose, u).value, F.coffee(setup.dose, u).unit,
      <>Ratio <b className="text-ink">1:{ratio.toFixed(1)}</b></>,
      <Stepper label="dose" onMinus={() => set({ dose: Math.max(1, +(setup.dose - 0.1).toFixed(1)) })} onPlus={() => set({ dose: +(setup.dose + 0.1).toFixed(1) })} />),
    dial('water', <>{isEsp ? 'Yield out' : 'Water'}{unitToggle(isEsp ? 'coffee' : 'water', isEsp ? [{ value: 'g', label: 'g' }, { value: 'oz', label: 'oz' }] : [{ value: 'ml', label: 'ml' }, { value: 'g', label: 'g' }, { value: 'oz', label: 'fl oz' }])}</>,
      F.scale(setup.water, u, mode.scaleIsWater).value, F.scale(setup.water, u, mode.scaleIsWater).unit,
      isEsp ? <>Stop by weight · ratio 1:{ratio.toFixed(1)}</> : <>Pours rescale to match · default unit from Settings</>,
      <Stepper label={isEsp ? 'yield' : 'water'} onMinus={() => set({ water: Math.max(1, setup.water - (isEsp ? 1 : 5)) })} onPlus={() => set({ water: setup.water + (isEsp ? 1 : 5) })} />),
    dial('grind', <>Grind{grindChanged && <span className={`ml-1 ${mode.bg} ${mode.on} px-1.5 py-0.5 text-[10px] tracking-[0.08em]`}>changed</span>}</>,
      grindShort(setup.grind), '',
      <>{setup.grind}{grindChanged && <s className="block">{grindShort(recipe.grindSetting)} in recipe</s>}</>,
      shiftGrind(setup.grind, 1) ? <Stepper label="grind" onMinus={() => set({ grind: shiftGrind(setup.grind, -1)! })} onPlus={() => set({ grind: shiftGrind(setup.grind, 1)! })} /> : <span className="text-[12px] text-mute">Set a numbered grind in the recipe to step it here.</span>,
      grindChanged),
    dial('temp', isEsp ? 'Brew temp' : 'Water temp', F.temp(setup.tempC, u).value, F.temp(setup.tempC, u).unit,
      !isEsp ? <TempScale c={setup.tempC} /> : <>Group or boiler target</>,
      <Stepper label="temperature" onMinus={() => set({ tempC: +(setup.tempC - (isEsp ? 0.5 : 1)).toFixed(1) })} onPlus={() => set({ tempC: +(setup.tempC + (isEsp ? 0.5 : 1)).toFixed(1) })} />),
  ];
  if (!isEsp) {
    dials.push(dial('hard', <>Hardness{unitToggle('hardness', [{ value: 'ppm', label: 'ppm' }, { value: 'dh', label: '°dH' }])}</>,
      wp ? F.hardness(wp.ghPpm, u).value : '—', wp ? F.hardness(wp.ghPpm, u).unit : '',
      wp ? <>TDS <b className="text-ink">{wp.tdsPpm}</b> · KH <b className="text-ink">{wp.khPpm}</b>{wp.ph ? ` · pH ${wp.ph}` : ''}</> : 'Pick the water you use',
      <select value={setup.waterProfileId || ''} onChange={(e) => set({ waterProfileId: e.target.value || undefined })} className="w-full h-12 border border-rule bg-paper px-2 text-[14px] font-semibold" aria-label="Water">
        <option value="">No water profile</option>
        {waterProfiles.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
      </select>));
  }

  const history = m.history.slice(0, 3);

  return (
    <div className="min-h-full flex flex-col">
      <header className={`${mode.bg} ${mode.on} px-5 sm:px-7 py-3.5 flex items-end gap-4`}>
        <button type="button" onClick={onBack} className="w-11 h-11 -ml-2 flex items-center justify-center shrink-0" aria-label="Back to brew"><ArrowLeft className="w-5 h-5" /></button>
        <div className="min-w-0">
          <div className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-85 truncate">{m.lot} · {mode.label} · before brew {m.brewNumber} · step 00</div>
          <h1 className="font-black text-[24px] sm:text-[26px] leading-tight tracking-[-0.02em] truncate" style={{ fontStretch: '106%' }}>{isEsp ? 'Beans prep' : 'Brew prep'} · {recipe.title}</h1>
        </div>
      </header>

      <section className={`grid border-b border-ink ${wide ? (dials.length === 5 ? 'grid-cols-3 xl:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4') : 'grid-cols-2'}`}>{dials}</section>

      <section className={`grid flex-1 ${wide ? 'grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>
        <div className="min-w-0">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="text-left">
                <th className="label-caps !text-[10.5px] pl-5 sm:pl-7 py-2 border-b border-ink w-14">Done</th>
                <th className="label-caps !text-[10.5px] py-2 border-b border-ink">{isEsp ? 'Puck prep, in order' : 'Prep, in order'} · tools from your Gear</th>
                <th className="label-caps !text-[10.5px] py-2 pr-4 border-b border-ink w-[124px]">This brew</th>
              </tr>
            </thead>
            <tbody>
              {setup.prep.map((p, i) => {
                const done = setup.prepDone.includes(p.id);
                const now = p.id === nowId;
                return (
                  <tr key={p.id} className={`${now ? 'bg-tint' : ''} ${!p.use ? 'text-mute' : ''}`}>
                    <td className="pl-5 sm:pl-7 border-b border-rule h-[58px]">
                      <button type="button" disabled={!p.use} onClick={() => toggleDone(p.id)} aria-pressed={done} aria-label={`${p.name} done`}
                        className={`w-7 h-7 border-[1.5px] border-ink flex items-center justify-center ${done ? 'bg-ink text-paper' : ''} disabled:opacity-30`}>
                        {done && <Check className="w-4 h-4" strokeWidth={3} />}
                      </button>
                    </td>
                    <td className="border-b border-rule pr-2">
                      <div className={`font-bold ${!p.use ? 'line-through' : ''}`}>
                        <span className="text-[11px] text-mute font-extrabold mr-2">{String(i + 1).padStart(2, '0')}</span>{p.name}
                        {now && <span className={`ml-2 ${mode.bg} ${mode.on} text-[10px] font-extrabold tracking-[0.08em] uppercase px-1.5 py-0.5 align-[2px]`}>now</span>}
                      </div>
                      <div className={`text-[12.5px] text-mute ${!p.use ? 'line-through' : ''}`}><span className="text-ink font-medium">{p.tool}</span>{p.setting ? ` · ${p.setting}` : ''}</div>
                    </td>
                    <td className="border-b border-rule pr-4">
                      <Segmented small label={`${p.name} this brew`} value={p.use ? 'use' : 'skip'} options={[{ value: 'use', label: 'Use' }, { value: 'skip', label: 'Skip' }]} onChange={(v) => toggleUse(p.id, v === 'use')} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mx-5 sm:mx-7 my-2.5 text-[12.5px] text-mute">Tools come from your Gear. Skip leaves one out of this brew only; tap Done as you go.</p>
        </div>

        <aside className={`${wide ? 'border-l border-rule' : 'border-t border-rule'} px-5 py-3.5 flex flex-col gap-3`}>
          <div className="border border-ink px-3 py-2.5 text-[13.5px] leading-snug">
            <b className="bg-ink text-paper text-[10.5px] tracking-[0.1em] uppercase px-1.5 py-0.5 mr-1.5">Dial-in</b>
            {history[0] ? <>Last brew: {history[0].dialInAdvice?.[0] ?? 'no advice logged'} </> : 'No brews of this recipe yet.'}
            {grindChanged && <> Grind moved <b>{grindShort(recipe.grindSetting)} → {grindShort(setup.grind)}</b>. Change one thing per brew so you can tell what worked.</>}
          </div>
          <div>
            <Caps className="mb-1.5">What each one does to the cup</Caps>
            <dl className="grid grid-cols-[92px_1fr] text-[12.5px] leading-snug border-t border-ink">
              {(isEsp ? EFFECTS_PRESSURE : EFFECTS_WATER).map(([a, b]) => (
                <React.Fragment key={a}>
                  <dt className="font-bold py-1.5 border-b border-rule">{a}</dt>
                  <dd className="py-1.5 border-b border-rule">{b}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
          {history.length > 0 && (
            <div>
              <Caps className="mb-1">Last brews · this recipe</Caps>
              <table className="w-full text-[12px]">
                <thead><tr className="text-left">{['When', isEsp ? 'Dose · grind' : 'Temp · grind', 'Time', 'Cup'].map((h) => <th key={h} className="label-caps !text-[10px] py-1 border-b border-ink">{h}</th>)}</tr></thead>
                <tbody>
                  {history.map((s) => (
                    <tr key={s.id} className="align-top">
                      <td className="py-1.5 pr-1 border-b border-rule">{new Date(s.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                      <td className="py-1.5 pr-1 border-b border-rule">{isEsp ? `${s.actualDoseGrams} · ` : s.waterTempC ? `${F.text(F.temp(s.waterTempC, u))} · ` : ''}{s.grindSetting ? grindShort(s.grindSetting) : '—'}</td>
                      <td className="py-1.5 pr-1 border-b border-rule num">{F.clock(s.actualTotalTimeSeconds, u)}</td>
                      <td className="py-1.5 border-b border-rule font-bold">{verdictWord(s.sensory.verdict)} {s.sensory.overall}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </aside>
      </section>

      <footer className="border-t border-ink flex flex-wrap items-center gap-3 px-5 sm:px-7 py-3 pb-safe">
        <Btn onClick={onBack}>Back</Btn>
        <Btn variant="ghost" size="md" onClick={savePrep}>Save prep to recipe</Btn>
        <span className="text-[12px] text-mute">{doneCount} of {usedCount} done · {setup.prep.length - usedCount} skipped · saved with the brew</span>
        <Btn variant="primary" className="ml-auto px-8" onClick={onDone}>Prep done · {isEsp ? 'pull shot' : 'start brew'}</Btn>
      </footer>
    </div>
  );
};

const TempScale: React.FC<{ c: number }> = ({ c }) => {
  const pct = (x: number) => `${Math.min(100, Math.max(0, ((x - 85) / 15) * 100))}%`;
  return (
    <div aria-hidden>
      <div className="relative h-3 border border-ink mt-1">
        <span className="absolute inset-y-0 bg-tint" style={{ left: pct(92), width: `calc(${pct(96)} - ${pct(92)})` }} />
        <span className="absolute -top-1.5 -bottom-1.5 w-[3px] bg-ink" style={{ left: `calc(${pct(c)} - 1px)` }} />
      </div>
      <div className="flex justify-between gap-2 text-[10.5px] mt-0.5"><span>85</span><span className="truncate">shaded 92–96: light roasts</span><span>100</span></div>
    </div>
  );
};

export function verdictWord(v: string) {
  return ({ under_extracted: 'Sour', balanced: 'Sweet', over_extracted: 'Bitter', channeling: 'Channeled', stalled: 'Stalled' } as Record<string, string>)[v] || v;
}
