import React, { useMemo, useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeCategory, CustomMethod } from '../types/coffee';
import { ALL_MODES, MODES, lotFor } from '../brew/modes';
import { newStepId, stepsFor } from '../brew/steps';
import { Btn, Caps, Segmented, Sheet } from '../brew/ui';
import { useLayout } from '../shell/LayoutContext';

/**
 * Create or edit one of the user's own brew methods. The user decides whether
 * it lives under a main method (sharing its colour and timer behaviour) or in
 * its own "Others" group.
 */
export const MethodEditor: React.FC<{
  method?: CustomMethod | null;
  defaultParent?: CoffeeCategory;
  onSaved: (m: CustomMethod) => void;
  onClose: () => void;
}> = ({ method, defaultParent = 'other', onSaved, onClose }) => {
  const { recipes, customMethods, addCustomMethod, updateCustomMethod, deleteCustomMethod } = useCoffee();
  const { mode: layout } = useLayout();
  const [name, setName] = useState(method?.name ?? '');
  const [parent, setParent] = useState<CoffeeCategory>(method?.parent ?? defaultParent);
  const [measures, setMeasures] = useState<'water' | 'cup'>(method?.measures ?? 'water');
  const [pressure, setPressure] = useState<'off' | 'on'>(method?.pressure ? 'on' : 'off');
  const [stepsFrom, setStepsFrom] = useState<string>(method?.steps?.length ? 'keep' : 'standard');
  const [notes, setNotes] = useState(method?.notes ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const usedBy = method ? recipes.filter((r) => r.methodId === method.id).length : 0;
  const sourceRecipes = useMemo(
    () => recipes.filter((r) => parent === 'other' || r.category === parent),
    [recipes, parent],
  );

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Give the method a name, for example "Hario Switch" or "Siphon".'); return; }
    const clash = customMethods.find((m) => m.name.toLowerCase() === trimmed.toLowerCase() && m.id !== method?.id);
    if (clash) { setError(`You already have a method called "${clash.name}".`); return; }

    let steps = method?.steps;
    if (stepsFrom === 'standard') steps = undefined;
    else if (stepsFrom !== 'keep') {
      const src = recipes.find((r) => r.id === stepsFrom);
      if (src) steps = stepsFor(src, customMethods.find((x) => x.id === src.methodId)).map((s) => ({ ...s, id: newStepId() }));
    }
    const data = {
      name: trimmed,
      parent,
      measures: parent === 'other' ? measures : undefined,
      pressure: parent === 'other' ? pressure === 'on' : undefined,
      steps,
      notes: notes.trim() || undefined,
    };
    if (method) {
      updateCustomMethod(method.id, data);
      onSaved({ ...method, ...data });
    } else {
      onSaved(addCustomMethod(data));
    }
  };

  const fieldCls = 'w-full h-12 border border-ink bg-paper px-3 text-[15px] font-semibold';

  return (
    <Sheet
      side={layout !== 'simple'}
      title={method ? 'Edit brew method' : 'New brew method'}
      sub="Your own way of brewing, with its own name and starting steps."
      onClose={onClose}
      footer={
        <>
          {method && !confirmDelete && <Btn size="md" variant="ghost" className="!px-0 text-bad mr-auto" onClick={() => setConfirmDelete(true)}>Delete…</Btn>}
          {!method && <span className="mr-auto" />}
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" className="px-7" onClick={save}>Save method</Btn>
        </>
      }
    >
      {confirmDelete && method && (
        <div className="border-2 border-bad p-3 mb-4 text-[14px] leading-snug">
          <b className="block">Delete "{method.name}"?</b>
          {usedBy > 0
            ? `${usedBy} recipe${usedBy === 1 ? '' : 's'} use it. They stay in ${MODES[method.parent].label} but lose the method name.`
            : 'No recipes use it.'}
          <div className="flex gap-2 mt-3">
            <Btn size="md" onClick={() => setConfirmDelete(false)}>Keep it</Btn>
            <Btn size="md" className="!bg-bad !border-bad text-[#fff]" onClick={() => { deleteCustomMethod(method.id); onClose(); }}>Delete method</Btn>
          </div>
        </div>
      )}

      <label className="block">
        <Caps className="mb-1.5">Method name</Caps>
        <input value={name} onChange={(e) => { setName(e.target.value); setError(''); }} className={fieldCls} placeholder="e.g. Hario Switch, Siphon, Cold brew" autoFocus={!method} />
      </label>
      {error && <p role="alert" className="text-bad text-[13.5px] font-semibold mt-1.5">{error}</p>}

      <Caps className="mt-5 mb-1.5" id="save-under">Save under</Caps>
      <div role="radiogroup" aria-labelledby="save-under" className="grid grid-cols-2 gap-2">
        {ALL_MODES.map((c) => {
          const m = MODES[c];
          const on = parent === c;
          return (
            <button key={c} type="button" role="radio" aria-checked={on} onClick={() => setParent(c)}
              className={`min-h-[52px] px-3 border text-left flex items-center gap-2.5 text-[14px] font-bold ${c === 'other' ? 'col-span-2' : ''} ${on ? `${m.bg} ${m.on} border-transparent` : 'border-rule'}`}>
              <i className={`w-3.5 h-3.5 shrink-0 ${m.bg} ${on ? 'border border-current' : ''}`} aria-hidden />
              <span className="leading-tight">
                {c === 'other' ? 'Others · keep it in its own group' : m.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[12.5px] text-mute mt-1.5 leading-snug">
        {parent === 'other'
          ? 'It gets its own place in Others, with the settings below.'
          : `It sits under ${MODES[parent].label}: same colour, timer and step style, shown as "${MODES[parent].label} · ${name.trim() || 'your method'}".`}
      </p>

      {parent === 'other' && (
        <div className="mt-4 flex flex-col gap-3">
          <div>
            <Caps className="mb-1.5">The scale shows</Caps>
            <Segmented label="The scale shows" value={measures} onChange={setMeasures} className="w-full"
              options={[{ value: 'water', label: 'Water poured' }, { value: 'cup', label: 'Coffee in the cup' }]} />
          </div>
          <div>
            <Caps className="mb-1.5">Pressure profile</Caps>
            <Segmented label="Pressure profile" value={pressure} onChange={setPressure} className="w-full"
              options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On · bar targets per step' }]} />
          </div>
        </div>
      )}

      <label className="block mt-5">
        <Caps className="mb-1.5">Starting steps</Caps>
        <select value={stepsFrom} onChange={(e) => setStepsFrom(e.target.value)} className={fieldCls}>
          {method?.steps?.length ? <option value="keep">Keep its current steps ({method.steps.length})</option> : null}
          <option value="standard">Standard {parent === 'other' ? 'prepare · brew · finish' : `${MODES[parent].label} steps`}</option>
          {sourceRecipes.length > 0 && (
            <optgroup label="Copy the steps of a recipe">
              {sourceRecipes.map((r) => <option key={r.id} value={r.id}>{lotFor(r, recipes)} · {r.title}</option>)}
            </optgroup>
          )}
        </select>
      </label>
      <p className="text-[12.5px] text-mute mt-1.5">New recipes of this method start with these steps. You can still change them per recipe with Edit steps.</p>

      <label className="block mt-5">
        <Caps className="mb-1.5">Notes</Caps>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-ink bg-paper p-3 text-[15px]" placeholder="Gear, technique, what makes it different" />
      </label>
    </Sheet>
  );
};

/** Overview of the six main methods with the user's own methods under each, plus Others. */
export const BrewMethodsSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { recipes, customMethods } = useCoffee();
  const { mode: layout } = useLayout();
  const [editing, setEditing] = useState<CustomMethod | 'new' | null>(null);
  const [newParent, setNewParent] = useState<CoffeeCategory>('other');

  if (editing) {
    return (
      <MethodEditor
        method={editing === 'new' ? null : editing}
        defaultParent={newParent}
        onSaved={() => setEditing(null)}
        onClose={() => setEditing(null)}
      />
    );
  }

  return (
    <Sheet
      side={layout !== 'simple'}
      title="Brew methods"
      sub="The six main methods, plus the ones you make."
      onClose={onClose}
      footer={<Btn variant="primary" className="flex-1" onClick={() => { setNewParent('other'); setEditing('new'); }}><Plus className="w-5 h-5" />New method</Btn>}
    >
      {ALL_MODES.map((c) => {
        const m = MODES[c];
        const mine = customMethods.filter((x) => x.parent === c);
        const count = recipes.filter((r) => r.category === c).length;
        return (
          <section key={c} className="mb-4">
            <div className="flex items-center gap-2.5 border-b border-ink pb-1.5">
              <i className={`w-3.5 h-3.5 ${m.bg}`} aria-hidden />
              <b className="text-[15px]">{m.label}</b>
              <span className="text-[12px] text-mute">{count} recipe{count === 1 ? '' : 's'}</span>
              <button type="button" onClick={() => { setNewParent(c); setEditing('new'); }}
                className="ml-auto min-h-[40px] px-2 text-[12.5px] font-bold underline underline-offset-4" aria-label={`Add a method under ${m.label}`}>
                + Add here
              </button>
            </div>
            {mine.length === 0 && (
              <p className="text-[13px] text-mute py-2">
                {c === 'other' ? 'Methods you keep separate from the six main ones show here.' : 'No methods of your own here yet.'}
              </p>
            )}
            {mine.map((x) => {
              const used = recipes.filter((r) => r.methodId === x.id).length;
              return (
                <button key={x.id} type="button" onClick={() => setEditing(x)}
                  className="w-full min-h-[52px] flex items-center gap-3 border-b border-rule text-left">
                  <span className="min-w-0 flex-1">
                    <b className="block text-[14.5px] truncate">{x.name}</b>
                    <span className="text-[12px] text-mute">
                      {used} recipe{used === 1 ? '' : 's'}
                      {x.steps?.length ? ` · ${x.steps.length} starting steps` : ''}
                      {x.parent === 'other' ? ` · scale shows ${x.measures === 'cup' ? 'coffee in cup' : 'water'}${x.pressure ? ' · pressure' : ''}` : ''}
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-mute" aria-hidden />
                </button>
              );
            })}
          </section>
        );
      })}
    </Sheet>
  );
};
