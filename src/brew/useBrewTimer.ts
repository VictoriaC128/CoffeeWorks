import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrewStep } from '../types/coffee';
import { hapticDone, hapticStep, setKeepAwake } from '../platform/native';

export interface StepTime { name: string; plannedSeconds: number; actualSeconds: number }

interface Core {
  running: boolean;
  /** ms of brew time banked before the current run segment */
  bankedMs: number;
  /** performance.now() when the current run segment started */
  segStart: number;
  stepIndex: number;
  /** brew-time ms at which the current step started */
  stepStartMs: number;
  /** seconds added with +5 s, per step */
  ext: number[];
  /** actual seconds of finished steps */
  actual: number[];
  started: boolean;
}

const fresh = (n: number): Core => ({
  running: false, bankedMs: 0, segStart: 0, stepIndex: 0, stepStartMs: 0,
  ext: Array(n).fill(0), actual: [], started: false,
});

/**
 * Step-aware brew timer. Each step counts down; when its time runs out the
 * next one starts automatically (with a haptic tap). The last step keeps
 * counting into overtime until the barista finishes. Screen stays awake while running.
 */
export function useBrewTimer(steps: BrewStep[]) {
  const core = useRef<Core>(fresh(steps.length));
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => (t + 1) % 1e9);

  const now = () => performance.now();
  const elapsedMs = () => core.current.bankedMs + (core.current.running ? now() - core.current.segStart : 0);
  const plannedOf = (i: number) => (steps[i]?.durationSeconds ?? 0) + (core.current.ext[i] ?? 0);

  const advance = useCallback((atMs: number) => {
    const c = core.current;
    if (c.stepIndex >= steps.length - 1) return false;
    c.actual[c.stepIndex] = (atMs - c.stepStartMs) / 1000;
    c.stepIndex += 1;
    c.stepStartMs = atMs;
    hapticStep();
    return true;
  }, [steps.length]);

  // Reset when the schedule itself changes (different recipe or edited steps)
  const signature = steps.map((s) => `${s.id}:${s.durationSeconds}`).join('|');
  useEffect(() => { core.current = fresh(steps.length); rerender(); }, [signature]); // eslint-disable-line react-hooks/exhaustive-deps

  // 10 Hz clock while running; auto-advances finished steps
  useEffect(() => {
    if (!core.current.running) return;
    const id = window.setInterval(() => {
      const c = core.current;
      const e = elapsedMs();
      let guard = 0;
      while (guard++ < steps.length && c.stepIndex < steps.length - 1 && e - c.stepStartMs >= plannedOf(c.stepIndex) * 1000) {
        advance(c.stepStartMs + plannedOf(c.stepIndex) * 1000);
      }
      rerender();
    }, 100);
    return () => window.clearInterval(id);
  }); // re-armed every render on purpose: cheap, and always sees fresh steps

  useEffect(() => {
    setKeepAwake(core.current.running);
    return () => setKeepAwake(false);
  }, [core.current.running]);

  const start = () => { const c = core.current; if (c.running) return; c.running = true; c.started = true; c.segStart = now(); rerender(); };
  const pause = () => { const c = core.current; if (!c.running) return; c.bankedMs = elapsedMs(); c.running = false; rerender(); };
  const toggle = () => (core.current.running ? pause() : start());
  const next = () => { if (!core.current.started) start(); advance(elapsedMs()); rerender(); };
  const addTime = (sec = 5) => { core.current.ext[core.current.stepIndex] += sec; rerender(); };
  const reset = () => { core.current = fresh(steps.length); rerender(); };

  /** Stop the clock and return per-step times. */
  const finish = (): StepTime[] => {
    const c = core.current;
    const e = elapsedMs();
    c.bankedMs = e; c.running = false;
    c.actual[c.stepIndex] = (e - c.stepStartMs) / 1000;
    hapticDone();
    rerender();
    return steps.map((s, i) => ({ name: s.name, plannedSeconds: s.durationSeconds, actualSeconds: Math.round((c.actual[i] ?? 0) * 10) / 10 }));
  };

  const c = core.current;
  const e = elapsedMs();
  const i = Math.min(c.stepIndex, Math.max(0, steps.length - 1));
  const planned = plannedOf(i);
  const inStep = (e - c.stepStartMs) / 1000;
  const left = planned - inStep;
  const extTotal = c.ext.reduce((a, b) => a + b, 0);
  const totalPlanned = steps.reduce((a, s) => a + s.durationSeconds, 0) + extTotal;

  const timeline = useMemo(() => {
    // Planned segment widths (with +5 s extensions) for the bar
    let t = 0;
    return steps.map((s, k) => {
      const d = s.durationSeconds + (c.ext[k] ?? 0);
      const seg = { start: t, duration: d };
      t += d;
      return seg;
    });
  }, [signature, extTotal]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    running: c.running,
    started: c.started,
    elapsedSec: e / 1000,
    stepIndex: i,
    step: steps[i],
    plannedSec: planned,
    leftSec: left,
    overtime: left < 0 && i === steps.length - 1,
    totalPlanned,
    actual: c.actual,
    ext: c.ext,
    timeline,
    start, pause, toggle, next, addTime, reset, finish,
  };
}

export type BrewTimer = ReturnType<typeof useBrewTimer>;
