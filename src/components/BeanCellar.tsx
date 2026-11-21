import React, { useCallback, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { Bean, RoastLevel, ProcessMethod } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import { Btn, Caps, Sheet } from '../brew/ui';
import { useLayout } from '../shell/LayoutContext';

const INPUT = 'w-full h-12 border border-rule bg-paper px-3 text-[15px] text-ink focus:border-ink';

const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="label-caps block mb-1">{label}</span>
    {children}
  </label>
);

const words = (s: string) => s.replace(/_/g, ' ');

export const BeanCellar: React.FC = () => {
  const { beans, addBean, updateBean, deleteBean } = useCoffee();
  const { mode } = useLayout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beanToEdit, setBeanToEdit] = useState<Bean | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [roaster, setRoaster] = useState('');
  const [origin, setOrigin] = useState('');
  const [region, setRegion] = useState('');
  const [varietal, setVarietal] = useState('');
  const [elevationMeters, setElevationMeters] = useState<number | undefined>(undefined);
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('light');
  const [processMethod, setProcessMethod] = useState<ProcessMethod>('washed');
  const [tastingNotesInput, setTastingNotesInput] = useState('');
  const [aroma, setAroma] = useState('');
  const [roastDate, setRoastDate] = useState(new Date().toISOString().split('T')[0]);
  const [degassingDaysIdeal, setDegassingDaysIdeal] = useState<number>(14);
  const [notes, setNotes] = useState('');

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleOpenAdd = () => {
    setBeanToEdit(null);
    setName('');
    setRoaster('');
    setOrigin('');
    setRegion('');
    setVarietal('');
    setElevationMeters(undefined);
    setRoastLevel('light');
    setProcessMethod('washed');
    setTastingNotesInput('');
    setAroma('');
    setRoastDate(new Date().toISOString().split('T')[0]);
    setDegassingDaysIdeal(14);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bean: Bean) => {
    setBeanToEdit(bean);
    setName(bean.name);
    setRoaster(bean.roaster);
    setOrigin(bean.origin);
    setRegion(bean.region || '');
    setVarietal(bean.varietal || '');
    setElevationMeters(bean.elevationMeters);
    setRoastLevel(bean.roastLevel);
    setProcessMethod(bean.processMethod);
    setTastingNotesInput(bean.tastingNotes.join(', '));
    setAroma(bean.aroma);
    setRoastDate(bean.roastDate);
    setDegassingDaysIdeal(bean.degassingDaysIdeal || 14);
    setNotes(bean.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tastingNotes = tastingNotesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const beanData = {
      name,
      roaster,
      origin,
      region,
      varietal,
      elevationMeters,
      roastLevel,
      processMethod,
      tastingNotes,
      aroma,
      roastDate,
      degassingDaysIdeal,
      notes,
    };

    if (beanToEdit) {
      updateBean(beanToEdit.id, beanData);
    } else {
      addBean(beanData);
    }

    setIsModalOpen(false);
  };

  // Helper to calculate days off roast
  const getDaysOffRoast = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(diff) ? 0 : diff;
  };

  const roastedOn = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* Header band: full-bleed inside the page padding */}
      <header className="-mx-4 sm:-mx-6 mb-4 bg-ink text-paper px-4 sm:px-6 py-4 flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-black tracking-[-0.02em] leading-tight">Beans</h1>
          <p className="text-[13px] opacity-80 mt-0.5">
            {beans.length} {beans.length === 1 ? 'bean' : 'beans'} · roast age, resting and tasting notes
          </p>
        </div>
        <Btn size="md" className="ml-auto !min-h-[48px] !border-paper" onClick={handleOpenAdd}>
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Add bean
        </Btn>
      </header>

      {beans.length === 0 ? (
        <div className="border-y border-ink py-8 text-center">
          <p className="text-[16px] font-bold">No beans yet</p>
          <p className="text-[13.5px] text-mute mt-1">Add the bag you are brewing with to track its rest and tasting notes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 border-t border-ink">
          {beans.map(bean => {
            const daysOff = getDaysOffRoast(bean.roastDate);
            const ideal = bean.degassingDaysIdeal || 7;
            const isResting = daysOff < ideal;
            const isPeak = daysOff >= ideal && daysOff <= 40;
            const isPastPeak = daysOff > 40;
            const origin = [bean.origin, bean.region].filter(Boolean).join(', ');
            const meta = [origin, words(bean.processMethod), `${words(bean.roastLevel)} roast`, bean.varietal].filter(Boolean).join(' · ');
            const roasted = roastedOn(bean.roastDate);

            return (
              <article key={bean.id} className="py-4 border-b border-rule flex flex-col gap-3 min-w-0">
                <div className="grid grid-cols-[1fr_auto] gap-x-4 items-start">
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-extrabold leading-tight break-words">{bean.name}</h3>
                    <p className="text-[13px] font-semibold mt-0.5 truncate">{bean.roaster || 'Specialty Roaster'}</p>
                    <p className="text-[13px] text-mute leading-snug mt-0.5 first-letter:uppercase">{meta}</p>
                  </div>
                  <div className="text-right">
                    <Caps>Off roast</Caps>
                    <div className="num font-bold text-[40px] leading-none mt-1">
                      {daysOff}
                      <span className="text-[15px] font-semibold text-mute ml-1 tracking-normal" style={{ fontStretch: '100%' }}>d</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[12.5px] font-bold whitespace-nowrap">
                      <i
                        aria-hidden
                        className={`w-2.5 h-2.5 ${isPeak ? 'bg-ok' : isPastPeak ? 'bg-bad' : 'border-[1.5px] border-ink'}`}
                      />
                      {isResting && <span>Resting · {ideal - daysOff} d to go</span>}
                      {isPeak && <span className="text-ok">Peak window</span>}
                      {isPastPeak && <span className="text-bad">Past peak</span>}
                    </div>
                  </div>
                </div>

                {bean.tastingNotes.length > 0 && (
                  <div>
                    <Caps className="mb-1">Tasting notes</Caps>
                    <ul className="flex flex-wrap gap-1.5" aria-label="Tasting notes">
                      {bean.tastingNotes.map((note, idx) => (
                        <li key={idx} className="border border-rule px-2 py-0.5 text-[12.5px] font-semibold">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(bean.aroma || bean.notes) && (
                  <dl className="grid grid-cols-[72px_1fr] text-[13px] leading-snug border-t border-rule">
                    {bean.aroma && (
                      <>
                        <dt className="label-caps py-1.5 border-b border-rule">Aroma</dt>
                        <dd className="py-1.5 border-b border-rule">{bean.aroma}</dd>
                      </>
                    )}
                    {bean.notes && (
                      <>
                        <dt className="label-caps py-1.5 border-b border-rule">Notes</dt>
                        <dd className="py-1.5 border-b border-rule text-mute">{bean.notes}</dd>
                      </>
                    )}
                  </dl>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] text-mute min-w-0 flex-1">
                    {roasted && <>Roasted {roasted} · </>}rest {ideal} d
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(bean)}
                    className="w-12 h-12 border border-rule flex items-center justify-center active:bg-tint"
                    aria-label={`Edit ${bean.name}`}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove bean "${bean.name}"?`)) deleteBean(bean.id);
                    }}
                    className="w-12 h-12 border border-rule flex items-center justify-center text-bad active:bg-tint"
                    aria-label={`Delete ${bean.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Add / Edit sheet */}
      {isModalOpen && (
        <Sheet
          side={mode !== 'simple'}
          title={beanToEdit ? 'Edit bean' : 'Add bean'}
          sub={beanToEdit ? beanToEdit.name : 'Roast date sets the resting clock.'}
          onClose={closeModal}
          footer={
            <>
              <Btn className="flex-1" onClick={closeModal}>Cancel</Btn>
              <Btn variant="primary" type="submit" form="bean-form" className="flex-[1.6]">
                {beanToEdit ? 'Save changes' : 'Add bean'}
              </Btn>
            </>
          }
        >
          <form id="bean-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Bean name / lot">
                <input
                  type="text"
                  required
                  placeholder="e.g. Chelchele Washed"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={INPUT}
                />
              </Field>
              <Field label="Roaster">
                <input
                  type="text"
                  required
                  placeholder="e.g. Manhattan Coffee Roasters"
                  value={roaster}
                  onChange={e => setRoaster(e.target.value)}
                  className={INPUT}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Origin country">
                <input
                  type="text"
                  placeholder="e.g. Ethiopia"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className={INPUT}
                />
              </Field>
              <Field label="Region">
                <input
                  type="text"
                  placeholder="e.g. Gedeb, Yirgacheffe"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className={INPUT}
                />
              </Field>
              <Field label="Varietal" className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="e.g. Heirloom 74112 / Geisha"
                  value={varietal}
                  onChange={e => setVarietal(e.target.value)}
                  className={INPUT}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SmartDropdownWithOthers
                label="Roast degree"
                value={roastLevel}
                onChange={val => setRoastLevel(val as RoastLevel)}
                options={[
                  { label: 'Light Roast (Filter / Nordic)', value: 'light' },
                  { label: 'Medium-Light', value: 'med_light' },
                  { label: 'Medium Roast', value: 'medium' },
                  { label: 'Medium-Dark', value: 'med_dark' },
                  { label: 'Dark Roast', value: 'dark' },
                  { label: 'Traditional Nanyang Wok Butter Roast', value: 'nanyang_wok' },
                ]}
                customVariableGroup="roast_levels"
              />

              <SmartDropdownWithOthers
                label="Processing method"
                value={processMethod}
                onChange={val => setProcessMethod(val as ProcessMethod)}
                options={[
                  { label: 'Washed', value: 'washed' },
                  { label: 'Natural', value: 'natural' },
                  { label: 'Honey / Pulped Natural', value: 'honey' },
                  { label: 'Anaerobic Fermentation', value: 'anaerobic_fermentation' },
                  { label: 'Carbonic Maceration', value: 'carbonic_maceration' },
                  { label: 'Thermal Shock', value: 'thermal_shock' },
                  { label: 'Fruit Co-Fermented', value: 'co_fermented' },
                  { label: 'Traditional Butter/Sugar Roast', value: 'traditional_butter_sugar_roast' },
                ]}
                customVariableGroup="process_methods"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Roast date">
                <input
                  type="date"
                  value={roastDate}
                  onChange={e => setRoastDate(e.target.value)}
                  className={INPUT}
                />
              </Field>
              <Field label="Rest days (ideal)">
                <input
                  type="number"
                  inputMode="numeric"
                  value={degassingDaysIdeal}
                  onChange={e => setDegassingDaysIdeal(parseInt(e.target.value) || 14)}
                  className={`${INPUT} num font-bold`}
                />
              </Field>
            </div>

            <Field label="Tasting notes · separate with commas">
              <input
                type="text"
                placeholder="e.g. Jasmine, White Peach, Bergamot, Honey"
                value={tastingNotesInput}
                onChange={e => setTastingNotesInput(e.target.value)}
                className={INPUT}
              />
            </Field>

            <Field label="Aroma">
              <input
                type="text"
                placeholder="e.g. Floral perfume, candied lemon"
                value={aroma}
                onChange={e => setAroma(e.target.value)}
                className={INPUT}
              />
            </Field>

            <Field label="Notes">
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Storage, cupping scores, anything else worth remembering"
                className="w-full border border-rule bg-paper p-3 text-[15px] text-ink focus:border-ink"
              />
            </Field>
          </form>
        </Sheet>
      )}
    </div>
  );
};
