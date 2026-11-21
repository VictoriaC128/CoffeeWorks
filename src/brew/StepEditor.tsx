import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import { BrewStep, StepAction } from '../types/coffee';
import { BrewModel } from './model';
import { ACTION_LABEL, STEP_LIBRARY, finalWeight, newStepId, presetSteps, startsOf, totalOf } from './steps';
import { Btn, Caps, Stepper } from './ui';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { LayoutMode } from '../shell/LayoutContext';

export type SaveTarget = 'mine' | 'update' | 'once';

/** Edit, add, reorder and time the steps. Changes show in the mode colour next to the preset value. */
export const StepEditor: React.FC<{
  m: BrewModel;
  layout: LayoutMode;
  onCancel: () => void;
  onSave: (steps: BrewStep[], target: SaveTarget) => void;
}> = ({ m, layout, onCancel, onSave }) => {
  const { settings } = useSettings();
  const u = settings.units;
  const { recipe, mode } = m;
  const preset = useMemo(() => presetSteps(recipe, m.method), [recipe, m.method]);
  const [steps, setSteps] = useState<BrewStep[]>(() => m.steps.map((s) => ({ ...s })));
  const [target, setTarget] = useState<SaveTarget>(recipe.baseRecipeId ? 'update' : 'mine');
  const [library, setLibrary] = useState(false);
  const pressure = mode.pressure;
  const wide = layout !== 'simple';

  const byId = new Map(preset.map((s) => [s.id, s]));
  const starts = startsOf(steps);
  const total = totalOf(steps);
  const presetTotal = totalOf(preset);
  const lastW = finalWeight(steps);
  const changes = steps.reduce((n, s) => {
    const p = byId.get(s.id);
    if (!p) return n + 1;
    return n + (['name', 'durationSeconds', 'targetWeightGrams', 'action', 'target', 'endsWhen'] as const).filter((k) => p[k] !== s[k]).length;
  }, 0) + preset.filter((p) => !steps.some((s) => s.id === p.id)).length;

  const patch = (i: number, p: Partial<BrewStep>) => setSteps((a) => a.map((s, k) => (k === i ? { ...s, ...p } : s)));
  const move = (i: number, d: -1 | 1) => setSteps((a) => {
    const j = i + d;
    if (j < 0 || j >= a.length) return a;
    const b = [...a];
    [b[i], b[j]] = [b[j], b[i]];
    return b;
  });
  const dup = (i: number) => setSteps((a) => [...a.slice(0, i + 1), { ...a[i], id: newStepId(), name: `${a[i].name} (copy)` }, ...a.slice(i + 1)]);
  const del = (i: number) => setSteps((a) => (a.length > 1 ? a.filter((_, k) => k !== i) : a));
  const add = (s?: Omit<BrewStep, 'id'>) => setSteps((a) => [...a, { id: newStepId(), name: 'New step', durationSeconds: pressure ? 5 : 10, action: pressure ? 'wait' : 'pour', endsWhen: 'time', ...(s || {}) }]);

  const was = (i: number, key: keyof BrewStep, fmt: (v: any) => string = String) => {
    const p = byId.get(steps[i].id);
    if (!p || p[key] === steps[i][key]) return null;
    return <s className="block text-[11px] text-mute">{p[key] === undefined ? '—' : fmt(p[key])}</s>;
  };
  const isNew = (s: BrewStep) => !byId.has(s.id);
  const chg = (i: number, key: keyof BrewStep) => { const p = byId.get(steps[i].id); return p && p[key] !== steps[i][key] ? mode.text : ''; };

  const inputCls = 'h-11 border border-rule bg-paper px-2.5 text-[14px] font-semibold w-full';
  const dStep = pressure ? 1 : 5;

  const row = (s: BrewStep, i: number) => {
    const controls = (
      <>
        {pressure ? (
          <>
            <label className="min-w-0"><span className="sr-only">Control</span>
              <select value={s.control || 'pressure'} onChange={(e) => patch(i, { control: e.target.value as BrewStep['control'] })} className={inputCls}>
                <option value="pressure">Pressure (bar)</option><option value="flow">Flow (ml/s)</option>
              </select>
            </label>
            <label className={`min-w-0 ${chg(i, 'target')}`}><span className="sr-only">Target</span>
              <input inputMode="decimal" value={s.target ?? ''} onChange={(e) => patch(i, { target: e.target.value === '' ? undefined : parseFloat(e.target.value) })} className={`${inputCls} ${chg(i, 'target')}`} placeholder={s.control === 'flow' ? 'ml/s' : 'bar'} />
              {was(i, 'target')}
            </label>
          </>
        ) : (
          <>
            <label className="min-w-0"><span className="sr-only">Action</span>
              <select value={s.action || 'pour'} onChange={(e) => patch(i, { action: e.target.value as StepAction })} className={`${inputCls} ${chg(i, 'action')}`}>
                {Object.entries(ACTION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            {wide && <span className="text-[13px] text-mute num self-center">{F.clock(starts[i], u)}</span>}
          </>
        )}
        <div className="flex flex-col items-start">
          <Stepper label={`${s.name} duration`} onMinus={() => patch(i, { durationSeconds: Math.max(1, s.durationSeconds - dStep) })} onPlus={() => patch(i, { durationSeconds: s.durationSeconds + dStep })}>
            <span className={chg(i, 'durationSeconds')}>{F.clock(s.durationSeconds)}</span>
          </Stepper>
          {was(i, 'durationSeconds', (v) => F.clock(v))}
        </div>
        {pressure ? (
          <label className="min-w-0"><span className="sr-only">Ends when</span>
            <select value={s.endsWhen === 'weight' || s.endsWhen === 'first_drops' ? s.endsWhen : 'time'} onChange={(e) => {
              const v = e.target.value as 'time' | 'first_drops' | 'weight';
              patch(i, v === 'weight' ? { endsWhen: v, targetWeightGrams: s.targetWeightGrams || m.setup.water } : { endsWhen: v });
            }} className={`${inputCls} ${chg(i, 'endsWhen')}`}>
              <option value="time">Time</option>
              <option value="first_drops">First drops</option>
              <option value="weight">{`Weight ${s.targetWeightGrams ?? m.setup.water} g`}</option>
            </select>
            {was(i, 'endsWhen')}
          </label>
        ) : (
          <label className="min-w-0"><span className="sr-only">Pour to (g)</span>
            <input inputMode="numeric" value={s.targetWeightGrams ?? ''} onChange={(e) => patch(i, { targetWeightGrams: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} className={`${inputCls} ${chg(i, 'targetWeightGrams')}`} placeholder="—" aria-label="Pour to grams" />
            {was(i, 'targetWeightGrams', (v) => `${v} g`)}
          </label>
        )}
        <div className="flex items-center">
          <button type="button" onClick={() => dup(i)} className="w-11 h-11 flex items-center justify-center text-mute hover:text-ink" aria-label={`Duplicate ${s.name}`}><Copy className="w-4 h-4" /></button>
          <button type="button" onClick={() => del(i)} className="w-11 h-11 flex items-center justify-center text-mute hover:text-ink" aria-label={`Delete ${s.name}`} disabled={steps.length < 2}><Trash2 className="w-4 h-4" /></button>
        </div>
      </>
    );
    const order = (
      <div className="flex flex-col">
        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="w-9 h-6 flex items-center justify-center text-mute disabled:opacity-25" aria-label={`Move ${s.name} up`}><ArrowUp className="w-4 h-4" /></button>
        <button type="button" onClick={() => move(i, 1)} disabled={i === steps.length - 1} className="w-9 h-6 flex items-center justify-center text-mute disabled:opacity-25" aria-label={`Move ${s.name} down`}><ArrowDown className="w-4 h-4" /></button>
      </div>
    );
    const name = (
      <label className="min-w-0 block"><span className="sr-only">Step name</span>
        <div className="relative">
          <input value={s.name} onChange={(e) => patch(i, { name: e.target.value })} className={`${inputCls} ${chg(i, 'name')} pr-14`} />
          {isNew(s) && <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${mode.bg} ${mode.on} text-[10px] font-extrabold tracking-[0.08em] px-1.5 py-0.5`}>NEW</span>}
        </div>
      </label>
    );
    if (wide) {
      return (
        <div key={s.id} className={`grid items-center gap-2 pl-4 pr-3 py-1.5 border-b border-rule ${pressure ? 'grid-cols-[36px_minmax(150px,1.4fr)_minmax(130px,1fr)_96px_150px_minmax(130px,1fr)_92px]' : 'grid-cols-[36px_minmax(170px,1.6fr)_minmax(130px,1fr)_56px_150px_100px_92px]'} ${isNew(s) ? 'bg-tint' : ''}`}>
          {order}{name}{controls}
        </div>
      );
    }
    return (
      <div key={s.id} className={`px-3 py-2.5 border-b border-rule ${isNew(s) ? 'bg-tint' : ''}`}>
        <div className="grid grid-cols-[36px_1fr] gap-2 items-center">{order}{name}</div>
        <div className="grid grid-cols-2 gap-2 mt-2 pl-[44px] items-start">{controls}</div>
      </div>
    );
  };

  // timeline preview: yours vs preset
  const segBar = (list: BrewStep[], max: number, ghost?: boolean) => (
    <div className={`flex ${ghost ? 'h-2 mt-1' : 'h-9 border border-ink'}`} style={{ width: `${(totalOf(list) / max) * 100}%` }}>
      {list.map((s) => {
        const p = byId.get(s.id);
        const edited = p && (p.durationSeconds !== s.durationSeconds || p.targetWeightGrams !== s.targetWeightGrams || p.name !== s.name);
        return (
          <div key={s.id} style={{ width: `${(s.durationSeconds / totalOf(list)) * 100}%`, boxShadow: !ghost && edited ? `inset 0 -6px 0 rgb(var(${mode.cssVar}) / 0.55)` : undefined }}
            className={`${ghost ? 'bg-rule border-r-2 border-paper' : `${isNew(s) ? mode.bg : 'bg-ink'} text-paper border-r-2 border-paper text-[11px] font-bold px-1.5 py-1 truncate`} last:border-r-0`}>
            {!ghost && s.name}
          </div>
        );
      })}
    </div>
  );
  const max = Math.max(total, presetTotal);

  return (
    <div className="min-h-full flex flex-col">
      <header className={`${mode.bg} ${mode.on} px-5 sm:px-7 py-3.5 flex items-end gap-4`}>
        <button type="button" onClick={onCancel} className="w-11 h-11 -ml-2 flex items-center justify-center shrink-0" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-85">{m.lot} · {m.methodName} · edit steps</div>
          <h1 className="font-black text-[22px] sm:text-[26px] leading-tight tracking-[-0.02em] truncate" style={{ fontStretch: '106%' }}>{recipe.title}</h1>
        </div>
        {wide && <span className="text-[12px] font-bold tracking-[0.08em] uppercase border border-current px-2.5 py-1.5 whitespace-nowrap">Preset {F.clock(presetTotal)} · {changes} change{changes === 1 ? '' : 's'}</span>}
      </header>

      <section className="px-5 sm:px-7 py-3 border-b border-ink">
        <div className="flex justify-between text-[11px] text-mute font-semibold mb-1.5"><span>Your timeline · {F.clock(total)}</span><span>{pressure ? `line = yours · dashed = preset (${F.clock(presetTotal)})` : `colour block = new step · grey line = preset (${F.clock(presetTotal)})`}</span></div>
        {pressure ? <PressureProfile steps={steps} preset={preset} max={max} cssVar={mode.cssVar} /> : <>{segBar(steps, max)}{segBar(preset, max, true)}</>}
      </section>

      <section className="flex-1 flex flex-col">
        <div className="min-w-0 overflow-x-auto flex-1">
          {wide && (
            <div className={`grid gap-2 pl-4 pr-3 py-2 border-b border-ink label-caps !text-[10.5px] ${pressure ? 'grid-cols-[36px_minmax(150px,1.4fr)_minmax(130px,1fr)_96px_150px_minmax(130px,1fr)_92px]' : 'grid-cols-[36px_minmax(170px,1.6fr)_minmax(130px,1fr)_56px_150px_100px_92px]'}`}>
              <span /> <span>Step</span>{pressure ? <><span>Control</span><span>Target</span></> : <><span>Action</span><span>Starts</span></>}<span>Duration</span><span>{pressure ? 'Ends when' : 'Pour to'}</span><span />
            </div>
          )}
          {steps.map(row)}
          <div className="flex flex-wrap gap-2.5 px-4 sm:px-7 py-3">
            <Btn size="md" onClick={() => add()}><Plus className="w-4 h-4" />Add step</Btn>
            <Btn size="md" onClick={() => setLibrary((x) => !x)} aria-expanded={library}>From step library</Btn>
          </div>
          {library && (
            <div className="mx-4 sm:mx-7 mb-3 border border-ink grid grid-cols-2 sm:grid-cols-4">
              {STEP_LIBRARY.filter((s) => (pressure ? s.control === 'pressure' || s.action === 'wait' : !s.control)).map((s) => (
                <button key={s.name} type="button" onClick={() => { add(s); setLibrary(false); }} className="min-h-[52px] px-3 text-left border-b border-r border-rule hover:bg-tint">
                  <b className="block text-[14px]">{s.name}</b><span className="text-[12px] text-mute">{F.clock(s.durationSeconds)}{s.control === 'pressure' ? ` · ${s.target} bar` : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className={`border-t border-rule px-5 sm:px-7 py-3.5 grid gap-x-6 gap-y-3 ${wide ? 'grid-cols-3 max-w-[760px]' : 'grid-cols-1'}`}>
          <div className="flex flex-col border-b border-rule pb-2"><Caps>Total time</Caps><span className="text-[28px] font-bold num">{F.clock(total)}<small className="text-[13px] text-mute font-medium ml-1">preset {F.clock(presetTotal)}</small></span></div>
          <div className="flex flex-col border-b border-rule pb-2"><Caps>{pressure ? 'Yield' : 'Water'}</Caps>
            <span className="text-[28px] font-bold num">{lastW ?? '—'}<small className="text-[13px] text-mute font-medium ml-1">g</small>
              {lastW !== undefined && <span className={`text-[12px] font-bold ml-1.5 ${Math.abs(lastW - m.setup.water) <= 1 ? 'text-ok' : 'text-bad'}`}>{Math.abs(lastW - m.setup.water) <= 1 ? '✓ matches' : `recipe ${m.setup.water} g`}</span>}
            </span>
          </div>
          <div className="flex flex-col border-b border-rule pb-2"><Caps>Steps</Caps><span className="text-[28px] font-bold num">{steps.length}<small className="text-[13px] text-mute font-medium ml-1">preset {preset.length}</small></span></div>
          <div className="col-span-full">
          <Caps className="mb-1.5">Save these steps as</Caps>
          <div role="radiogroup" aria-label="Save these steps as" className={`grid gap-2 ${wide ? 'grid-cols-3' : 'grid-cols-1'}`}>
            {([
              ['mine', recipe.baseRecipeId ? 'Save as another version' : 'My version', 'Keeps the preset untouched'],
              ['update', recipe.baseRecipeId ? 'Update my version' : 'Update this recipe', "Replace this recipe's steps"],
              ['once', 'This brew only', 'Logged in History, not saved'],
            ] as [SaveTarget, string, string][]).map(([v, a, b]) => (
              <button key={v} type="button" role="radio" aria-checked={target === v} onClick={() => setTarget(v)}
                className={`text-left px-3 py-2.5 grid grid-cols-[18px_1fr] gap-2.5 text-[13px] leading-snug ${target === v ? 'border-2 border-ink' : 'border border-rule m-px'}`}>
                <i className={`w-4 h-4 mt-0.5 border-[1.5px] border-ink rounded-full ${target === v ? 'bg-[radial-gradient(circle,rgb(var(--ink))_0_4px,transparent_5px)]' : ''}`} />
                <span><b className="block text-[14px]">{a}</b>{b}</span>
              </button>
            ))}
          </div>
          </div>
        </aside>
      </section>

      <footer className="border-t border-ink flex flex-wrap items-center gap-3 px-5 sm:px-7 py-3">
        <Btn onClick={onCancel}>Cancel</Btn>
        <Btn variant="ghost" size="md" onClick={() => setSteps(preset.map((s) => ({ ...s })))}>Reset to preset</Btn>
        <Btn variant="primary" className="ml-auto px-8" onClick={() => onSave(steps, target)}>Save steps</Btn>
      </footer>
    </div>
  );
};

/** Pressure (or flow) target over time: yours solid in the mode colour, preset dashed. */
const PressureProfile: React.FC<{ steps: BrewStep[]; preset: BrewStep[]; max: number; cssVar: string }> = ({ steps, preset, max, cssVar }) => {
  const W = 1000, H = 96, top = 10, peak = 10; // bar scale 0..10
  const y = (bar: number) => H - 6 - (Math.max(0, Math.min(peak, bar)) / peak) * (H - top - 6);
  const pts = (list: BrewStep[]) => {
    let t = 0, prev = 0;
    const out: string[] = [];
    list.forEach((s, i) => {
      const x0 = (t / max) * W, x1 = ((t + s.durationSeconds) / max) * W;
      const target = s.target ?? prev;
      // ramps and declines move from the previous target; holds sit flat
      const from = /ramp|declin/i.test(s.name) ? prev : target;
      if (i === 0) out.push(`${x0},${y(from)}`); else out.push(`${x0},${y(from)}`);
      out.push(`${x1},${y(target)}`);
      prev = target; t += s.durationSeconds;
    });
    return out.join(' ');
  };
  return (
    <div className="relative">
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-24 border border-ink block" role="img" aria-label="Pressure profile">
      {[3, 6, 9].map((b) => <line key={b} x1="0" x2={W} y1={y(b)} y2={y(b)} stroke="rgb(var(--rule))" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
      <polyline points={pts(preset)} fill="none" stroke="rgb(var(--mute))" strokeWidth="2" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
      <polyline points={pts(steps)} fill="none" stroke={`rgb(var(${cssVar}))`} strokeWidth="3.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
      {[3, 6, 9].map((b) => <span key={b} className="absolute left-1.5 text-[10.5px] text-mute -translate-y-full" style={{ top: `${(y(b) / H) * 100}%` }}>{b} bar</span>)}
    </div>
  );
};
