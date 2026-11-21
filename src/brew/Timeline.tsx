import React from 'react';
import { BrewStep } from '../types/coffee';
import { clock } from '../settings/format';

/**
 * Step-proportional timeline. Done steps are ink, the current step fills with
 * the mode colour, the playhead is flow orange. Ticks mark every 1 s (short
 * brews) or 5 s.
 */
export const Timeline: React.FC<{
  steps: BrewStep[];
  segments: { start: number; duration: number }[];
  stepIndex: number;
  inStepSec: number;
  elapsedSec: number;
  started: boolean;
  modeBg: string;
  showNames?: boolean;
  height?: number;
  caption?: React.ReactNode;
}> = ({ steps, segments, stepIndex, inStepSec, elapsedSec, started, modeBg, showNames, height = 26, caption }) => {
  const total = Math.max(1, segments.reduce((a, s) => a + s.duration, 0));
  const tick = total <= 60 ? 1 : 5;
  const tickPct = (tick / total) * 100;
  // Playhead sits on the plan: start of current step + time spent in it
  const cur = segments[stepIndex];
  const head = started && cur ? Math.min(100, ((cur.start + Math.min(inStepSec, cur.duration)) / total) * 100) : 0;

  // Time labels at step boundaries, dropping any closer than 6% to the previous
  const marks: { pct: number; t: number }[] = [];
  [...segments.map((s) => s.start), total].forEach((t) => {
    const pct = (t / total) * 100;
    const last = marks[marks.length - 1];
    if (!last || pct - last.pct >= 6 || t === total) {
      if (last && t === total && pct - last.pct < 6 && marks.length > 1) marks.pop();
      marks.push({ pct, t });
    }
  });

  return (
    <div aria-label={`Brew timeline, ${clock(elapsedSec)} of ${clock(total)}`} role="img">
      {caption && <div className="flex justify-between text-[11px] text-mute font-semibold mb-1">{caption}<span>each tick = {tick} s</span></div>}
      {showNames && (
        <div className="flex text-[11px] font-bold text-mute mb-1">
          {segments.map((s, i) => (
            <span key={i} style={{ width: `${(s.duration / total) * 100}%` }} className={`truncate pl-1 ${i === stepIndex && started ? 'text-ink' : ''}`}>
              {i === stepIndex && started ? `${i + 1} now` : steps[i]?.name.split(' ')[0]}
            </span>
          ))}
        </div>
      )}
      <div className="relative flex border border-ink" style={{ height, backgroundImage: `repeating-linear-gradient(90deg, transparent 0 calc(${tickPct}% - 1px), rgb(var(--rule)) calc(${tickPct}% - 1px) ${tickPct}%)` }}>
        {segments.map((s, i) => {
          const done = started && i < stepIndex;
          const now = started && i === stepIndex;
          return (
            <div
              key={i}
              className={`relative h-full ${i < segments.length - 1 ? 'border-r-2' : ''} ${done ? 'bg-ink border-paper' : 'border-ink'}`}
              style={{ width: `${(s.duration / total) * 100}%` }}
            >
              {now && <i className={`absolute inset-y-0 left-0 ${modeBg}`} style={{ width: `${Math.min(100, (inStepSec / s.duration) * 100)}%` }} />}
            </div>
          );
        })}
        {started && <div className="absolute -top-1.5 -bottom-1.5 w-[3px] bg-flow" style={{ left: `calc(${head}% - 1px)` }} />}
      </div>
      <div className="relative h-4 mt-1 text-[11px] text-mute">
        {marks.map((m, i) => (
          <span
            key={i}
            className="absolute whitespace-nowrap"
            style={{ left: `${m.pct}%`, transform: i === 0 ? 'none' : i === marks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}
          >
            {clock(m.t)}
          </span>
        ))}
      </div>
    </div>
  );
};
