import React from 'react';
import { ChevronDown, Lock, RotateCw } from 'lucide-react';
import { BrewModel, beanAgeDays } from './model';
import { useSettings } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { useLayout } from '../shell/LayoutContext';

const catLabel = (m: BrewModel) => m.methodName;

/** Rotation lock chip: "Auto" follows tilt, tap to keep the current layout. */
export const LockChip: React.FC<{ className?: string; compact?: boolean }> = ({ className = '', compact }) => {
  const { locked, toggleLock } = useLayout();
  return (
    <button
      type="button"
      onClick={toggleLock}
      aria-pressed={locked}
      aria-label={locked ? 'Layout locked. Tap to follow tilt' : 'Layout follows tilt. Tap to lock'}
      className={`inline-flex items-center gap-1.5 border border-current font-extrabold uppercase tracking-[0.06em] ${compact ? 'h-8 px-2 text-[10px]' : 'min-h-[40px] px-3 text-[11px]'} ${className}`}
    >
      {locked ? <Lock className="w-3.5 h-3.5" /> : <RotateCw className="w-3.5 h-3.5" />}
      <span className={compact ? '' : 'hidden min-[500px]:inline'}>{locked ? 'Locked' : 'Auto'}</span>
    </button>
  );
};

export const LabelBand: React.FC<{ m: BrewModel; variant: 'full' | 'simple' | 'compact' }> = ({ m, variant }) => {
  const { settings } = useSettings();
  const u = settings.units;
  const { recipe, mode, setup, bean, water } = m;
  const age = beanAgeDays(bean);
  const scaleW = F.text(F.scale(setup.water, u, mode.scaleIsWater));
  const lotLine = `${m.lot} · ${catLabel(m)} · ${F.text(F.coffee(setup.dose, u))} → ${scaleW} · 1:${(setup.water / (setup.dose || 1)).toFixed(1)} · ${F.text(F.temp(setup.tempC, u))}`;
  const band = `${mode.bg} ${mode.on}`;

  const Title = (
    <button type="button" onClick={() => m.open('picker')} className="text-left min-w-0 group" aria-label={`Recipe: ${recipe.title}. Tap to switch recipe`}>
      <span className="flex items-start gap-1.5">
        <span className={`font-black tracking-[-0.025em] leading-[1.04] ${variant === 'full' ? 'text-[28px] line-clamp-2' : variant === 'compact' ? 'text-[16px] truncate' : 'text-[19px] line-clamp-1'}`} style={{ fontStretch: '106%' }}>
          {recipe.title}
        </span>
        <ChevronDown className={`shrink-0 opacity-80 ${variant === 'full' ? 'w-6 h-6 mt-1' : 'w-4 h-4 mt-0.5'}`} />
      </span>
    </button>
  );

  const changeBtn = (what: string) => (
    <button type="button" onClick={() => m.open('change')} className="shrink-0 h-[18px] px-1.5 border border-current text-[9.5px] font-extrabold uppercase tracking-[0.08em] leading-none" aria-label={`Change ${what}`}>
      Change
    </button>
  );

  if (variant === 'compact') {
    return (
      <header className={`${band} h-11 flex items-center gap-3 pl-4 pr-3`}>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] opacity-85 whitespace-nowrap">{m.lot}</span>
        <div className="flex-1 min-w-0">{Title}</div>
        <LockChip compact />
        <button type="button" onClick={() => m.open('change')} className="h-8 px-2 border border-current text-[10px] font-extrabold uppercase tracking-[0.06em]">Change</button>
      </header>
    );
  }

  if (variant === 'simple') {
    return (
      <header className={`${band} px-4 pt-3.5 pb-3 flex items-start gap-3`}>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-85 truncate">{lotLine}</div>
          <div className="mt-1">{Title}</div>
        </div>
        <div className="flex gap-2 shrink-0">
          <LockChip />
          <button type="button" onClick={() => m.open('change')} className="min-h-[40px] px-3 border border-current text-[11px] font-extrabold uppercase tracking-[0.06em]">Change</button>
        </div>
      </header>
    );
  }

  // full
  const rows: [string, React.ReactNode, boolean][] = [
    ['Bean', bean ? `${bean.name}${age !== undefined ? ` · ${age} d` : ''}` : 'No bean set', true],
    ['Grind', `${setup.grind}`, true],
  ];
  if (mode.pressure) {
    rows.push(['Machine', m.gear?.machineModel?.split('/')[0].trim() || '—', false]);
  }
  rows.push(['Water', water ? `${water.name.split('(')[0].trim()} · ${F.text(F.hardness(water.ghPpm, u))} · ${F.text(F.temp(setup.tempC, u))}` : F.text(F.temp(setup.tempC, u)), false]);

  return (
    <header className={`${band} px-7 py-4 grid grid-cols-[1fr_minmax(280px,340px)] gap-6 items-end`}>
      <div className="min-w-0">
        <div className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-85">{lotLine}</div>
        <div className="mt-2">{Title}</div>
      </div>
      <dl className="grid grid-cols-[72px_1fr] text-[12.5px] border-t rule-on">
        {rows.map(([k, v, change]) => (
          <React.Fragment key={k}>
            <dt className="uppercase text-[10.5px] tracking-[0.1em] opacity-80 py-1 border-b rule-on flex items-center">{k}</dt>
            <dd className="font-semibold py-1 border-b rule-on flex items-center gap-2 min-w-0">
              <span className="truncate flex-1">{k === 'Grind' && settings.units.grind === 'um' ? F.grind(setup.grind, recipe.grindMicrons, u) : v}</span>
              {change && changeBtn(k.toLowerCase())}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </header>
  );
};

