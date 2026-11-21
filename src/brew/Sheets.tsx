import React, { useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { BrewModel, beanAgeDays } from './model';
import { Btn, Caps, Sheet } from './ui';
import { useCoffee } from '../context/CoffeeContext';
import { shiftGrind, grindShort } from './steps';
import { MODES, ALL_MODES, lotFor } from './modes';
import { Recipe } from '../types/coffee';
import * as F from '../settings/format';
import { useSettings } from '../settings/SettingsContext';

/** Change bean or grind mid-brew. The timer keeps running. */
export const ChangeSheet: React.FC<{ m: BrewModel; side: boolean; onClose: () => void }> = ({ m, side, onClose }) => {
  const { beans, updateRecipe } = useCoffee();
  const { settings } = useSettings();
  const [beanId, setBeanId] = useState(m.setup.beanId);
  const [grind, setGrind] = useState(m.setup.grind);
  const [alsoRecipe, setAlsoRecipe] = useState(false);
  const steppable = shiftGrind(grind, 1) !== null;
  const t = m.timer;

  const apply = () => {
    m.setSetup((s) => ({ ...s, beanId, grind }));
    if (alsoRecipe) updateRecipe(m.recipe.id, { beanId, grindSetting: grind });
    onClose();
  };

  return (
    <Sheet
      side={side}
      title="Change bean or grind"
      sub={t.started ? <>For brew {m.brewNumber} only. The timer keeps running: {F.clock(t.elapsedSec, settings.units)}</> : <>For brew {m.brewNumber}.</>}
      onClose={onClose}
      footer={<><Btn className="flex-1" onClick={onClose}>Cancel</Btn><Btn variant="primary" className="flex-[1.6]" onClick={apply}>{t.running ? 'Apply · keep brewing' : 'Apply'}</Btn></>}
    >
      <Caps className="mb-1">Bean · from your Beans</Caps>
      <div role="radiogroup" aria-label="Bean">
        {beans.map((b) => {
          const on = b.id === beanId;
          const age = beanAgeDays(b);
          return (
            <button key={b.id} type="button" role="radio" aria-checked={on} onClick={() => setBeanId(b.id)}
              className="w-full grid grid-cols-[22px_1fr_auto] gap-3 items-center py-2.5 border-b border-rule text-left min-h-[52px]">
              <i className={`w-[18px] h-[18px] border-[1.5px] border-ink rounded-full ${on ? 'bg-[radial-gradient(circle,rgb(var(--ink))_0_4.5px,transparent_5.5px)]' : ''}`} />
              <span className="min-w-0"><b className="block text-[14px] truncate">{b.name}</b><small className="text-[12px] text-mute">{b.origin} · {b.processMethod.replace(/_/g, ' ')} · {b.roastLevel.replace(/_/g, '-')}</small></span>
              <em className={`not-italic text-[12px] text-right ${on ? 'font-bold' : 'text-mute'}`}>{age !== undefined ? `${age} d` : ''}{on && m.setup.beanId === b.id ? <><br />in use</> : null}</em>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-5 mb-1.5"><Caps>Grind</Caps>{grind !== m.setup.grind && <Caps>was {grindShort(m.setup.grind)}</Caps>}</div>
      {steppable ? (
        <div className="grid grid-cols-[64px_1fr_64px] border border-ink h-[76px]">
          <button type="button" onClick={() => setGrind(shiftGrind(grind, -1)!)} className="flex items-center justify-center" aria-label="Finer"><Minus className="w-6 h-6" strokeWidth={2.5} /></button>
          <div className={`border-x border-ink flex flex-col items-center justify-center num font-extrabold text-[42px] leading-none ${grind !== m.setup.grind ? m.mode.text : ''}`}>
            {grindShort(grind)}
            {grind !== m.setup.grind && <s className="text-[13px] text-mute font-semibold mt-1" style={{ fontStretch: '100%' }}>{grindShort(m.setup.grind)}</s>}
          </div>
          <button type="button" onClick={() => setGrind(shiftGrind(grind, 1)!)} className="flex items-center justify-center" aria-label="Coarser"><Plus className="w-6 h-6" strokeWidth={2.5} /></button>
        </div>
      ) : (
        <input value={grind} onChange={(e) => setGrind(e.target.value)} className="w-full h-12 border border-ink px-3 text-[16px] font-semibold" aria-label="Grind setting" />
      )}
      <p className="text-[12.5px] text-mute mt-1.5 leading-snug">{grind}. Ground at a different setting than planned? Fix it here so History and dial-in use what you really ground.</p>

      <div className="mt-4 flex flex-col gap-1">
        <div className="grid grid-cols-[24px_1fr] gap-2.5 py-1.5 text-[13.5px]">
          <i className="w-5 h-5 bg-ink text-paper flex items-center justify-center"><Check className="w-3.5 h-3.5" strokeWidth={3} /></i>
          <span><b className="block">Log on this brew</b><small className="text-mute">Brew {m.brewNumber} saves with this bean and grind</small></span>
        </div>
        <button type="button" role="checkbox" aria-checked={alsoRecipe} onClick={() => setAlsoRecipe((x) => !x)} className="grid grid-cols-[24px_1fr] gap-2.5 py-1.5 text-[13.5px] text-left min-h-[48px]">
          <i className={`w-5 h-5 border-[1.5px] border-ink flex items-center justify-center ${alsoRecipe ? 'bg-ink text-paper' : ''}`}>{alsoRecipe && <Check className="w-3.5 h-3.5" strokeWidth={3} />}</i>
          <span><b className="block">Also update recipe {m.lot}</b><small className="text-mute">Next brews start with this bean and grind</small></span>
        </button>
      </div>
    </Sheet>
  );
};

/** Fast recipe switching from the label band (café mode: one tap per recipe). */
export const RecipePicker: React.FC<{ m: BrewModel; side: boolean; onPick: (r: Recipe) => void; onClose: () => void }> = ({ m, side, onPick, onClose }) => {
  const { recipes, userPreferences, customMethods } = useCoffee();
  const { settings } = useSettings();
  const running = m.timer.started;
  return (
    <Sheet side={side} title="Switch recipe" sub={running ? 'Finish or reset the running brew to switch.' : `${recipes.length} recipes`} onClose={onClose}>
      {ALL_MODES.map((c) => {
        const list = recipes.filter((r) => r.category === c);
        if (!list.length) return null;
        return (
          <section key={c} className="mb-4">
            <div className="flex items-center gap-2 mb-1"><i className={`w-3.5 h-3.5 ${MODES[c].bg}`} /><Caps>{MODES[c].label}</Caps></div>
            {list.map((r) => {
              const on = r.id === m.recipe.id;
              const isDefault = userPreferences.defaultRecipePerCategory[c] === r.id;
              return (
                <button key={r.id} type="button" disabled={running && !on} onClick={() => { onPick(r); onClose(); }}
                  className={`w-full text-left py-2.5 border-b border-rule grid grid-cols-[1fr_auto] gap-3 items-baseline min-h-[52px] disabled:opacity-40 ${on ? 'font-bold' : ''}`}>
                  <span className="min-w-0">
                    <span className="block text-[14.5px] truncate">{r.title}</span>
                    <span className="text-[12px] text-mute">{lotFor(r, recipes)}{r.methodId ? ` · ${customMethods.find((x) => x.id === r.methodId)?.name ?? ''}` : ''}{isDefault ? ' · daily driver' : ''} · {F.text(F.coffee(r.doseGrams, settings.units))} → {F.text(F.scale(r.yieldGrams, settings.units, MODES[c].scaleIsWater))}</span>
                  </span>
                  {on && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </section>
        );
      })}
    </Sheet>
  );
};
