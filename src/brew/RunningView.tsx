import React from 'react';
import { Check, Pause, Play, Plus, SkipForward } from 'lucide-react';
import { BrewModel, finishLabel, runningAdvice } from './model';
import { LabelBand, LockChip } from './LabelBand';
import { Timeline } from './Timeline';
import { Btn } from './ui';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { grindShort } from './steps';
import { LayoutMode } from '../shell/LayoutContext';

/* ---------- shared derived values ---------- */
function useView(m: BrewModel) {
  const { settings } = useSettings();
  const u = settings.units;
  const t = m.timer;
  const step = m.steps[t.stepIndex];
  const prevTarget = (() => {
    for (let i = t.stepIndex - 1; i >= 0; i--) if (m.steps[i].targetWeightGrams) return m.steps[i].targetWeightGrams!;
    return 0;
  })();
  const inStep = t.plannedSec - t.leftSec;
  const aimFlow = step?.targetWeightGrams ? (step.targetWeightGrams - prevTarget) / Math.max(1, step.durationSeconds) : undefined;
  const w = (g: number) => F.text(F.scale(g, u, m.mode.scaleIsWater));
  const target = step?.targetWeightGrams
    ? `${m.mode.scaleIsWater ? 'Pour to' : 'Yield to'} ${w(step.targetWeightGrams)}`
    : step?.control === 'pressure' && step.target !== undefined
      ? `Hold ${step.target} bar`
      : step?.notes?.split('.')[0] || '';
  const count = !t.started ? F.clock(step?.durationSeconds ?? 0, u) : t.overtime ? `+${F.clock(-t.leftSec, u)}` : F.countdown(t.leftSec, u);
  const nextStep = m.steps[t.stepIndex + 1];
  return { u, t, step, inStep, aimFlow, target, count, nextStep, w };
}

const StepCaption: React.FC<{ m: BrewModel; started: boolean; idx: number }> = ({ m, started, idx }) => (
  <div className="label-caps">
    Step {idx + 1} of {m.steps.length} · {started ? 'time left in this step' : 'ready'}
  </div>
);

/* ---------- step boxes (full layout) ---------- */
const StepBoxes: React.FC<{ m: BrewModel; dense?: boolean }> = ({ m, dense }) => {
  const { t, u, w } = { ...useView(m) };
  return (
    <section className="grid border-b border-rule" style={{ gridTemplateColumns: `${dense ? 92 : 150}px repeat(${m.steps.length}, minmax(0,1fr))` }}>
      <button type="button" onClick={() => m.open('prep')} className={`text-left border-r border-rule bg-tint ${dense ? 'px-2.5 py-1.5' : 'px-4 py-3'}`} style={{ boxShadow: `inset 0 -5px 0 rgb(var(${m.mode.cssVar}))` }}>
        <div className="label-caps !text-[10px] truncate">00 {m.setup.prepDone.length ? '✓ ' : ''}prep</div>
        {dense ? (
          <div className="text-[15px] font-extrabold underline underline-offset-2 mt-1">Prep</div>
        ) : (
          <>
            <div className="text-[14px] font-semibold underline underline-offset-2 mt-0.5">{m.recipe.category === 'espresso' || m.recipe.category === 'manual_lever' ? 'Beans prep' : 'Brew prep'}</div>
            <div className="text-[24px] font-extrabold num mt-1.5 leading-none">{F.text(F.coffee(m.setup.dose, u))}</div>
            <div className="text-[12px] text-mute mt-1 truncate">{grindShort(m.setup.grind)} · {F.text(F.temp(m.setup.tempC, u))}</div>
          </>
        )}
      </button>
      {m.steps.map((s, i) => {
        const done = t.started && i < t.stepIndex;
        const now = t.started && i === t.stepIndex;
        const actual = t.actual[i];
        return (
          <div key={s.id} className={`min-w-0 border-r border-rule last:border-r-0 ${dense ? 'px-2.5 py-1.5' : 'px-4 py-3'} ${now ? `${m.mode.bg} ${m.mode.on}` : ''}`}>
            <div className={`text-[10.5px] tracking-[0.08em] uppercase font-bold truncate ${now ? 'opacity-85' : 'text-mute'}`}>
              {String(i + 1).padStart(2, '0')}{done ? ' ✓' : now ? ' · now' : ''}{dense ? ` ${s.name}` : ''}
            </div>
            {!dense && <div className={`text-[14px] font-semibold mt-0.5 truncate ${done ? 'line-through text-mute' : ''}`}>{s.name}</div>}
            <div className={`num font-extrabold leading-none ${dense ? 'text-[20px] mt-0.5' : 'text-[36px] mt-1.5'} ${done ? 'text-mute' : ''}`}>
              {F.clock(done && actual !== undefined ? actual : s.durationSeconds + (t.ext[i] || 0), u)}
            </div>
            {!dense && (
              <div className={`text-[12.5px] mt-1 truncate ${now ? 'opacity-85' : 'text-mute'}`}>
                {done ? `plan ${F.clock(s.durationSeconds, u)}` : s.targetWeightGrams ? `to ${w(s.targetWeightGrams)}` : s.control === 'pressure' && s.target !== undefined ? `${s.target} bar` : ''}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

const Advice: React.FC<{ m: BrewModel; className?: string; small?: boolean }> = ({ m, className = '', small }) => (
  <div className={`border border-ink flex items-start gap-3 ${small ? 'px-2.5 py-2 text-[13px]' : 'px-4 py-3 text-[15px]'} leading-snug ${className}`}>
    <b className="shrink-0 bg-ink text-paper text-[10.5px] tracking-[0.1em] uppercase px-1.5 py-1 leading-none mt-0.5">Dial-in</b>
    <span>{runningAdvice(m.history, grindShort(m.setup.grind))}</span>
  </div>
);

/* ---------- controls ---------- */
const Controls: React.FC<{ m: BrewModel; layout: LayoutMode }> = ({ m, layout }) => {
  const t = m.timer;
  const last = t.stepIndex >= m.steps.length - 1;
  if (!t.started) {
    return (
      <>
        <Btn onClick={() => m.open('prep')} size={layout === 'compact' ? 'md' : 'lg'}>{m.setup.prepDone.length ? 'Prep ✓' : 'Prep'}</Btn>
        <Btn onClick={() => m.open('steps')} size={layout === 'compact' ? 'md' : 'lg'}>Edit steps</Btn>
        <Btn variant="primary" onClick={t.start} size={layout === 'compact' ? 'md' : 'lg'} className={layout === 'simple' ? 'col-span-full' : 'ml-auto px-9'}>
          <Play className="w-5 h-5 fill-current" /> Start brew
        </Btn>
      </>
    );
  }
  const sz = layout === 'compact' ? 'md' : 'lg';
  return (
    <>
      <Btn onClick={t.toggle} size={sz} aria-label={t.running ? 'Pause' : 'Resume'}>
        {t.running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}{t.running ? 'Pause' : 'Resume'}
      </Btn>
      <Btn onClick={() => t.addTime(5)} size={sz} aria-label="Add 5 seconds to this step"><Plus className="w-4 h-4" />5 s</Btn>
      <Btn onClick={t.next} size={sz} disabled={last}><SkipForward className="w-4 h-4" />Next step</Btn>
      <Btn variant="primary" onClick={m.finish} size={sz} className={layout === 'simple' ? 'col-span-full' : 'ml-auto px-8'}>
        <Check className="w-5 h-5" />{finishLabel(m.recipe.category)}
      </Btn>
    </>
  );
};

/* ---------- side panels ---------- */
const SidePanels: React.FC<{ m: BrewModel; compact?: boolean }> = ({ m, compact }) => {
  const { t, u, aimFlow, nextStep, w } = useView(m);
  const step = m.steps[t.stepIndex];
  const v = compact ? 'text-[24px]' : 'text-[44px]';
  const third = m.mode.pressure
    ? { k: 'Pressure', v: step?.control === 'pressure' && step.target !== undefined ? step.target.toFixed(1) : '—', u: step?.control === 'pressure' ? 'bar · target' : '' }
    : nextStep
      ? { k: 'Next', v: nextStep.name, u: nextStep.targetWeightGrams ? `${F.clock(nextStep.durationSeconds, u)} → ${w(nextStep.targetWeightGrams)}` : F.clock(nextStep.durationSeconds, u), small: true }
      : { k: 'Next', v: 'Finish', u: 'taste & log', small: true };
  return (
    <div className="border-l border-rule grid grid-rows-3 min-h-0">
      <div className={`${compact ? 'px-3.5 py-1' : 'px-5 py-3'} border-b border-rule flex flex-col justify-center`}>
        <span className="label-caps">Total time</span>
        <span className={`${v} font-bold num leading-tight`}>{F.clock(t.elapsedSec, u)}<span className="text-[14px] text-mute font-medium ml-1">/ {F.clock(t.totalPlanned, u)}</span></span>
      </div>
      <div className={`${compact ? 'px-3.5 py-1' : 'px-5 py-3'} border-b border-rule flex flex-col justify-center text-flow`}>
        <span className="label-caps !text-flow">Flow · aim</span>
        <span className={`${v} font-bold num leading-tight`}>
          {aimFlow !== undefined ? F.flow(aimFlow, u).value : '—'}
          <span className="text-[14px] font-medium ml-1">{aimFlow !== undefined ? F.flow(aimFlow, u).unit : 'no pour this step'}</span>
        </span>
      </div>
      <div className={`${compact ? 'px-3.5 py-1' : 'px-5 py-3'} flex flex-col justify-center min-w-0`}>
        <span className="label-caps">{third.k}</span>
        <span className={`${'small' in third && third.small ? (compact ? 'text-[18px]' : 'text-[26px]') : v} font-bold leading-tight truncate`}>
          {third.v}<span className="text-[13px] text-mute font-medium ml-1.5">{third.u}</span>
        </span>
      </div>
    </div>
  );
};

/* ---------- layouts ---------- */
export const RunningView: React.FC<{ m: BrewModel; layout: LayoutMode }> = ({ m, layout }) => {
  const { t, u, step, inStep, target, count, w } = useView(m);
  const caption = (
    <span>Timeline · planned · <button type="button" className="underline font-bold text-ink" onClick={() => m.open('steps')}>Edit steps</button></span>
  );
  const timeline = (h?: number, names?: boolean) => (
    <Timeline steps={m.steps} segments={t.timeline} stepIndex={t.stepIndex} inStepSec={inStep} elapsedSec={t.elapsedSec} started={t.started} modeBg={m.mode.bg} height={h} showNames={names} caption={layout === 'full' ? caption : undefined} />
  );

  if (layout === 'full') {
    return (
      <div className="min-h-full flex flex-col">
        <LabelBand m={m} variant="full" />
        <section className="grid grid-cols-[1fr_300px] border-b border-ink flex-1 min-h-[300px]">
          <div className="px-7 pt-4 pb-4 flex flex-col">
            <StepCaption m={m} started={t.started} idx={t.stepIndex} />
            <div className="text-[22px] font-bold mt-1.5">{step?.name}</div>
            <div className="num font-extrabold leading-[0.82] my-auto py-2 whitespace-nowrap text-[clamp(110px,min(21vh,15vw),190px)]">
              {count}<span className="text-[38px] font-semibold text-mute tracking-normal ml-3" style={{ fontStretch: '100%' }}>of {F.clock(t.plannedSec, u)}</span>
            </div>
            <div className="text-[20px] font-semibold">{target}</div>
          </div>
          <SidePanels m={m} />
        </section>
        <StepBoxes m={m} />
        <div className="px-7 pt-2">{timeline(26)}</div>
        <Advice m={m} className="mx-7 mt-2" />
        <footer className="border-t border-ink mt-3 flex items-center gap-3 px-7 py-3">
          <Controls m={m} layout={layout} />
          {t.started && <span className="order-last sm:order-none text-[12px] text-mute whitespace-nowrap hidden xl:inline">{m.lot} · brew {m.brewNumber}</span>}
          <LockChip className="order-none" />
        </footer>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="h-full flex flex-col">
        <LabelBand m={m} variant="compact" />
        <section className="grid grid-cols-[1fr_236px] border-b border-ink flex-1 min-h-0">
          <div className="px-4 py-2 flex flex-col min-w-0">
            <div className="label-caps !text-[10px]">Step {t.stepIndex + 1} of {m.steps.length} <b className="text-ink normal-case tracking-normal text-[13px] ml-1.5">{step?.name}</b></div>
            <div className="num font-extrabold leading-[0.86] my-auto whitespace-nowrap text-[clamp(64px,27vh,120px)]">
              {count}<span className="text-[22px] font-semibold text-mute tracking-normal ml-2" style={{ fontStretch: '100%' }}>/ {F.clock(t.plannedSec, u)}</span>
            </div>
            <div className="text-[14px] font-semibold truncate">{target}</div>
          </div>
          <SidePanels m={m} compact />
        </section>
        <StepBoxes m={m} dense />
        <div className="px-4 pt-1">{timeline(14)}</div>
        <footer className="border-t border-ink flex items-center gap-2 px-3 py-1.5">
          <Controls m={m} layout={layout} />
        </footer>
      </div>
    );
  }

  // simple (upright phone or tablet)
  const wide = typeof window !== 'undefined' && window.innerWidth >= 700;
  return (
    <div className="min-h-full flex flex-col">
      <LabelBand m={m} variant="simple" />
      <section className="px-4 pt-3 pb-2.5 border-b border-ink">
        <StepCaption m={m} started={t.started} idx={t.stepIndex} />
        <div className="text-[18px] font-bold mt-1">{step?.name}</div>
        <div className="num font-extrabold leading-[0.85] mt-2 mb-1.5 whitespace-nowrap text-[clamp(72px,min(17vh,33vw),200px)]">
          {count}<span className="text-[28px] font-semibold text-mute tracking-normal ml-2" style={{ fontStretch: '100%' }}>/ {F.clock(t.plannedSec, u)}</span>
        </div>
        <div className="text-[16px] font-semibold">{target}</div>
      </section>
      <div className={`grid ${wide ? 'grid-cols-3' : 'grid-cols-2'} border-b border-rule`}>
        <div className="px-4 py-2.5 border-r border-rule">
          <div className="label-caps">Total</div>
          <div className="text-[30px] font-bold num leading-tight">{F.clock(t.elapsedSec, u)}<span className="text-[13px] text-mute font-medium ml-1">/ {F.clock(t.totalPlanned, u)}</span></div>
        </div>
        <FlowCell m={m} />
        {wide && (
          <div className="px-4 py-2.5 border-l border-rule min-w-0">
            <div className="label-caps">Next</div>
            <div className="text-[26px] font-bold leading-tight truncate">{m.steps[t.stepIndex + 1]?.name ?? 'Finish'}</div>
          </div>
        )}
      </div>
      <div className="px-4 pt-2.5 pb-2 border-b border-rule">{timeline(30, true)}</div>
      <ol className="flex-1">
        <li>
          <button type="button" onClick={() => m.open('prep')} className="w-full grid grid-cols-[28px_1fr_auto_64px] items-baseline px-4 py-2 border-b border-rule text-[14px] text-left">
            <span className="text-mute">00</span>
            <span className="underline underline-offset-2 font-semibold">{m.recipe.category === 'espresso' || m.recipe.category === 'manual_lever' ? 'Beans prep' : 'Brew prep'}{m.setup.prepDone.length ? ' ✓' : ''}</span>
            <span className="num text-[20px] font-extrabold">{F.text(F.coffee(m.setup.dose, u))}</span>
            <span className="text-right text-mute text-[13px]">{grindShort(m.setup.grind)}</span>
          </button>
        </li>
        {m.steps.map((s, i) => {
          const done = t.started && i < t.stepIndex;
          const now = t.started && i === t.stepIndex;
          return (
            <li key={s.id} className={`grid grid-cols-[28px_1fr_auto_64px] items-baseline px-4 py-2 border-b border-rule text-[14px] ${now ? `${m.mode.bg} ${m.mode.on} font-bold` : done ? 'text-mute' : ''}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span className={done ? 'line-through' : ''}>{s.name}</span>
              <span className="num text-[20px] font-extrabold">{F.clock(done && t.actual[i] !== undefined ? t.actual[i] : s.durationSeconds + (t.ext[i] || 0), u)}</span>
              <span className={`text-right text-[13px] ${now ? 'opacity-85' : 'text-mute'}`}>{s.targetWeightGrams ? w(s.targetWeightGrams) : ''}</span>
            </li>
          );
        })}
      </ol>
      <Advice m={m} small className="mx-4 my-2.5" />
      <div className={`grid gap-2 px-4 pb-3 ${t.started ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <Controls m={m} layout="simple" />
      </div>
    </div>
  );
};

const FlowCell: React.FC<{ m: BrewModel }> = ({ m }) => {
  const { u, aimFlow } = useView(m);
  return (
    <div className="px-4 py-2.5 text-flow">
      <div className="label-caps !text-flow">Flow · aim</div>
      <div className="text-[30px] font-bold num leading-tight">
        {aimFlow !== undefined ? F.flow(aimFlow, u).value : '—'}
        <span className="text-[13px] font-medium ml-1">{aimFlow !== undefined ? F.flow(aimFlow, u).unit : 'no pour'}</span>
      </div>
    </div>
  );
};
