import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { BrewSession } from '../types/coffee';
import { MODES } from '../brew/modes';
import { grindShort } from '../brew/steps';
import { Caps } from '../brew/ui';
import { useSettings, Units } from '../settings/SettingsContext';
import * as F from '../settings/format';

const SENSORY: { key: 'acidity' | 'sweetness' | 'bitterness' | 'body' | 'overall'; label: string }[] = [
  { key: 'acidity', label: 'Acidity' },
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'bitterness', label: 'Bitterness' },
  { key: 'body', label: 'Body' },
  { key: 'overall', label: 'Overall' },
];

const TOOL_LABELS: { key: keyof NonNullable<BrewSession['toolsUsed']>; label: string }[] = [
  { key: 'machine', label: 'Machine' },
  { key: 'grinder', label: 'Grinder' },
  { key: 'dripper', label: 'Dripper' },
  { key: 'tamper', label: 'Tamper' },
  { key: 'portafilter', label: 'Portafilter' },
  { key: 'showerScreen', label: 'Shower screen' },
  { key: 'puckScreen', label: 'Puck screen' },
  { key: 'paper', label: 'Paper' },
  { key: 'water', label: 'Water' },
];

const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const DialInHistory: React.FC = () => {
  const { sessions, deleteSession } = useCoffee();
  const { settings } = useSettings();
  const u = settings.units;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header band */}
      <header className="bg-ink text-paper px-5 sm:px-7 py-4 flex flex-wrap items-end gap-x-4 gap-y-1">
        <h1 className="text-[28px] font-black tracking-[-0.02em] flex items-center gap-2.5">
          <History className="w-6 h-6 shrink-0" aria-hidden />
          History
        </h1>
        <p className="text-[13px] opacity-80 pb-1.5">
          <span className="num font-bold text-[15px]">{sessions.length}</span> brews logged · newest first
        </p>
      </header>

      {sessions.length > 0 ? (
        <div>
          {sessions.map((session) => (
            <SessionEntry
              key={session.id}
              session={session}
              u={u}
              onDelete={() => {
                if (confirm('Delete this brew session?')) deleteSession(session.id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 sm:px-7 py-12 border-b border-ink text-center">
          <History className="w-9 h-9 text-mute mx-auto mb-3" aria-hidden />
          <h2 className="text-[17px] font-extrabold">No brews logged yet</h2>
          <p className="text-[14px] text-mute mt-1 max-w-sm mx-auto leading-snug">
            Pick a recipe on the Brew screen, run the timer, then tap Save on the taste screen. Each brew lands here.
          </p>
        </div>
      )}
    </div>
  );
};

const SessionEntry: React.FC<{ session: BrewSession; u: Units; onDelete: () => void }> = ({ session, u, onDelete }) => {
  const mode = MODES[session.category];
  const scaleIsWater = mode?.scaleIsWater ?? false;
  const tools = TOOL_LABELS
    .map(({ key, label }) => ({ label, value: session.toolsUsed?.[key] }))
    .filter((t): t is { label: string; value: string } => !!t.value && t.value !== 'N/A');
  const skipped = (session.prepUsed || []).filter((p) => !p.use);
  const steps = session.stepTimes || [];
  const tags = session.flavourTags || [];
  const pour = session.pourNotes?.trim();
  const taste = session.sensoryNotes?.trim();
  const advice = session.dialInAdvice || [];

  const stat = (k: string, v: React.ReactNode, sub?: React.ReactNode, cls = '') => (
    <div className="px-4 py-2.5 border-r border-b border-rule min-w-0">
      <div className={`label-caps !text-[10.5px] whitespace-nowrap ${cls}`}>{k}</div>
      <div className={`num font-bold text-[20px] leading-tight mt-0.5 whitespace-nowrap ${cls}`}>{v}</div>
      {sub && <div className="text-[12px] text-mute">{sub}</div>}
    </div>
  );

  const hasAside = !!(pour || taste || advice.length || skipped.length);

  return (
    <article className="border-b border-ink">
      {/* Title row */}
      <div className="px-5 sm:px-7 pt-4 pb-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
            <span className="inline-flex items-center gap-1.5 font-bold">
              <i className={`w-3 h-3 block ${mode ? mode.bg : 'bg-mute'}`} aria-hidden />
              {mode ? mode.label : titleCase(session.category)}
            </span>
            <span className="text-mute">{session.formattedDateTime || new Date(session.timestamp).toLocaleString()}</span>
          </div>
          <h2 className="text-[20px] font-extrabold leading-tight mt-1">{session.recipeTitle}</h2>
          <p className="text-[13px] text-mute mt-1 leading-snug">
            Bean <b className="text-ink font-semibold">{session.beanName}</b>
            {tools.map((t) => (
              <React.Fragment key={t.label}> · {t.label} <b className="text-ink font-semibold">{t.value}</b></React.Fragment>
            ))}
          </p>
        </div>
        <div className="text-right shrink-0">
          <Caps>Verdict</Caps>
          <div className="text-[15px] font-bold">{titleCase(session.sensory.verdict)}</div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="w-12 h-12 shrink-0 border border-rule flex items-center justify-center hover:border-ink"
          aria-label={`Delete brew session ${session.recipeTitle}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Summary strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(128px,1fr))] border-t border-ink">
        {stat('In → out', `${F.coffee(session.actualDoseGrams, u).value} → ${F.text(F.scale(session.actualYieldGrams, u, scaleIsWater))}`, <>Ratio 1:{session.actualRatio}</>)}
        {stat('Time', F.clock(session.actualTotalTimeSeconds, u), session.actualPreInfusionSeconds ? <>{F.clock(session.actualPreInfusionSeconds, u)} pre-infusion</> : undefined)}
        {stat('Flow', F.text(F.flow(session.actualFlowRateGs, u)), undefined, 'text-flow !text-flow')}
        {session.grindSetting && stat('Grind', grindShort(session.grindSetting), <span className="block truncate" title={session.grindSetting}>{session.grindSetting}</span>)}
        {session.waterTempC !== undefined && stat('Water temp', F.text(F.temp(session.waterTempC, u)))}
        {stat('TDS', session.refractometerTdsPercent ? `${session.refractometerTdsPercent} %` : '—')}
        {stat('EY', session.calculatedExtractionYieldPercent ? `${session.calculatedExtractionYieldPercent} %` : '—')}
      </section>

      <div className={`grid grid-cols-1 ${hasAside ? 'lg:grid-cols-[1fr_380px]' : ''}`}>
        <div className="px-5 sm:px-7 py-3.5 min-w-0 flex flex-col gap-4">
          {/* Sensory */}
          <div>
            <Caps className="mb-1">Taste · out of 5</Caps>
            <dl className="grid grid-cols-5 border-y border-ink">
              {SENSORY.map(({ key, label }, i) => (
                <div key={key} className={`py-1.5 min-w-0 ${i ? 'border-l border-rule pl-2.5' : ''}`}>
                  <dt className="text-[12px] text-mute truncate">{label}</dt>
                  <dd className="num font-bold text-[22px] leading-none mt-0.5">{session.sensory[key]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Flavour tags */}
          {tags.length > 0 && (
            <div>
              <Caps className="mb-1.5">Flavour notes</Caps>
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <li key={t} className="border border-rule px-2 py-0.5 text-[13px] font-semibold">{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step times */}
          {steps.length > 0 && (
            <div>
              <Caps className="mb-1">Step times · actual / plan</Caps>
              <table className="w-full text-[13.5px] border-t border-ink">
                <tbody>
                  {steps.map((s, i) => {
                    const diff = Math.round(s.actualSeconds - s.plannedSeconds);
                    return (
                      <tr key={i} className="border-b border-rule">
                        <td className="py-1.5 pr-2 w-8 text-[11px] text-mute font-extrabold num">{String(i + 1).padStart(2, '0')}</td>
                        <td className="py-1.5 pr-2">{s.name}</td>
                        <td className="py-1.5 pr-2 text-right num font-bold whitespace-nowrap">{F.clock(s.actualSeconds, u)}</td>
                        <td className="py-1.5 pr-2 text-right num text-mute whitespace-nowrap">{F.clock(s.plannedSeconds, u)}</td>
                        <td className="py-1.5 text-right num text-mute whitespace-nowrap w-14">{diff === 0 ? 'on plan' : `${diff > 0 ? '+' : '−'}${Math.abs(diff)} s`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {hasAside && (
          <aside className="border-t lg:border-t-0 lg:border-l border-rule px-5 sm:px-7 lg:px-5 py-3.5 flex flex-col gap-3.5 min-w-0">
            {pour && (
              <div>
                <Caps className="mb-0.5">Pour notes</Caps>
                <p className="text-[14.5px] leading-snug whitespace-pre-line">{pour}</p>
              </div>
            )}
            {taste && (
              <div>
                <Caps className="mb-0.5">Taste notes</Caps>
                <p className="text-[14.5px] leading-snug whitespace-pre-line">{taste}</p>
              </div>
            )}
            {skipped.length > 0 && (
              <div>
                <Caps className="mb-0.5">Prep skipped</Caps>
                <ul className="text-[13.5px] border-t border-rule">
                  {skipped.map((p, i) => (
                    <li key={`${p.name}-${i}`} className="py-1.5 border-b border-rule">
                      <span className="font-semibold">{p.name}</span>
                      {p.tool && <span className="text-mute"> · {p.tool}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {advice.length > 0 && (
              <div className="border border-ink px-3.5 py-2.5">
                <b className="bg-ink text-paper text-[10.5px] tracking-[0.1em] uppercase px-1.5 py-0.5">Dial-in advice</b>
                <ul className="mt-2 text-[13.5px] leading-snug">
                  {advice.map((adv, idx) => (
                    <li key={idx} className={`py-1.5 ${idx ? 'border-t border-rule' : ''}`}>{adv}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>
    </article>
  );
};
