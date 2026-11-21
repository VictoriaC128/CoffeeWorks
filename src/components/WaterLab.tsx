import React, { useCallback, useState } from 'react';
import { Plus, Droplets, Trash2, Pencil, ShieldAlert } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { WaterProfile, WaterType } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import { WATER_SOURCE_OPTIONS } from '../data/dropdownCatalog';
import { useSettings, Units } from '../settings/SettingsContext';
import * as F from '../settings/format';
import { useLayout } from '../shell/LayoutContext';
import { Btn, Caps, Segmented, Sheet } from '../brew/ui';

const HARDNESS_OPTIONS: { value: Units['hardness']; label: string }[] = [
  { value: 'ppm', label: 'ppm' },
  { value: 'dh', label: '°dH' },
  { value: 'gpg', label: 'gpg' },
];

const inputCls = 'w-full h-12 border border-ink bg-paper px-3 text-[16px]';
const numberCls = `${inputCls} num font-bold text-[20px]`;

export const WaterLab: React.FC = () => {
  const { waterProfiles, addWaterProfile, updateWaterProfile, deleteWaterProfile } = useCoffee();
  const { settings, setUnit } = useSettings();
  const { mode } = useLayout();
  const u = settings.units;
  const wide = mode !== 'simple';
  const hard = (ppm: number) => F.text(F.hardness(ppm, u));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waterToEdit, setWaterToEdit] = useState<WaterProfile | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<WaterType>('tap');
  const [countryRegion, setCountryRegion] = useState('');
  const [tdsPpm, setTdsPpm] = useState<number>(75);
  const [ghPpm, setGhPpm] = useState<number>(50);
  const [khPpm, setKhPpm] = useState<number>(35);
  const [ph, setPh] = useState<number>(7.0);
  const [description, setDescription] = useState('');

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleOpenAdd = () => {
    setWaterToEdit(null);
    setName('');
    setType('tap');
    setCountryRegion('');
    setTdsPpm(75);
    setGhPpm(50);
    setKhPpm(35);
    setPh(7.0);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (water: WaterProfile) => {
    setWaterToEdit(water);
    setName(water.name);
    setType(water.type);
    setCountryRegion(water.countryRegion);
    setTdsPpm(water.tdsPpm);
    setGhPpm(water.ghPpm);
    setKhPpm(water.khPpm);
    setPh(water.ph || 7.0);
    setDescription(water.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name,
      type,
      countryRegion,
      tdsPpm,
      ghPpm,
      khPpm,
      ph,
      description,
    };

    if (waterToEdit) {
      updateWaterProfile(waterToEdit.id, data);
    } else {
      addWaterProfile(data);
    }

    setIsModalOpen(false);
  };

  const minerals: [string, string, string][] = [
    ['Magnesium (Mg²⁺)', 'Fruit and florals', 'Smaller and more charge-dense than calcium, magnesium pulls out light aromatics, fruit acids (malic, citric) and perceived sweetness.'],
    ['Calcium (Ca²⁺)', 'Body and crema', 'Pulls out heavier roast notes, giving espresso its syrupy mouthfeel and dense crema, but scales boilers at high levels.'],
    ['Alkalinity (KH)', 'Acid buffer', `Bicarbonate buffers acidity. Low KH (about ${F.hardness(20, u).value}–${hard(40)}) keeps a crisp, sparkling cup; high KH (over ${hard(100)}) flattens acidity into chalkiness.`],
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header band */}
      <header className="bg-ink text-paper px-5 sm:px-7 py-4 flex flex-wrap items-end gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] font-black tracking-[-0.02em] flex items-center gap-2.5">
            <Droplets className="w-6 h-6 shrink-0" aria-hidden />
            Water
          </h1>
          <p className="text-[13px] opacity-80 mt-0.5">
            <span className="num font-bold">{waterProfiles.length}</span> profiles · water is about 98.5% of the cup
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="ml-auto min-h-[48px] px-4 bg-paper text-ink border border-paper font-bold text-[14px] inline-flex items-center gap-2 active:translate-y-px"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Add water profile
        </button>
      </header>

      {/* Mineral explainer */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-ink">
        {minerals.map(([k, sub, body], i) => (
          <div key={k} className={`px-5 sm:px-7 md:px-5 py-3.5 border-b md:border-b-0 border-rule ${i < 2 ? 'md:border-r' : ''} last:border-b-0`}>
            <div className="text-[15px] font-bold">{k}</div>
            <Caps className="mt-0.5">{sub}</Caps>
            <p className="text-[13.5px] text-mute leading-snug mt-1.5">{body}</p>
          </div>
        ))}
      </section>

      {/* Profiles */}
      <div className="flex flex-wrap items-center gap-3 px-5 sm:px-7 pt-5 pb-2 border-b border-ink">
        <h2 className="text-[17px] font-extrabold">Your water</h2>
        <span className="text-[12.5px] text-mute">GH and KH shown in</span>
        <Segmented small label="Hardness unit" value={u.hardness} options={HARDNESS_OPTIONS} onChange={(v) => setUnit('hardness', v)} className="ml-auto" />
      </div>

      {waterProfiles.length === 0 ? (
        <p className="px-5 sm:px-7 py-8 text-[14px] text-mute border-b border-rule">No water profiles yet. Add the water you brew with to see its hardness on the prep screen.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {waterProfiles.map((water) => {
            const isSoft = water.tdsPpm < 100;
            const isMedium = water.tdsPpm >= 100 && water.tdsPpm <= 180;
            const isHard = water.tdsPpm > 180;
            const gh = F.hardness(water.ghPpm, u);
            const kh = F.hardness(water.khPpm, u);

            return (
              <article key={water.id} className="px-5 sm:px-7 md:px-5 py-4 border-b border-rule md:border-r min-w-0 flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <Caps>{water.type.replace(/_/g, ' ')}</Caps>
                    <h3 className="text-[17px] font-bold leading-tight mt-0.5 line-clamp-2">{water.name}</h3>
                    {water.countryRegion && <p className="text-[13px] text-mute mt-0.5">{water.countryRegion}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0 -mr-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(water)}
                      className="w-12 h-12 border border-rule flex items-center justify-center hover:border-ink"
                      aria-label={`Edit ${water.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete water profile "${water.name}"?`)) deleteWaterProfile(water.id);
                      }}
                      className="w-12 h-12 border border-rule flex items-center justify-center hover:border-ink"
                      aria-label={`Delete ${water.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Readings */}
                <dl className="grid grid-cols-3 border-y border-ink mt-3">
                  {([
                    ['TDS', String(water.tdsPpm), 'ppm'],
                    ['GH · Ca/Mg', gh.value, gh.unit],
                    ['KH · buffer', kh.value, kh.unit],
                  ] as const).map(([k, v, unit], i) => (
                    <div key={k} className={`py-2 min-w-0 ${i ? 'border-l border-rule pl-3' : 'pr-2'}`}>
                      <dt className="label-caps !text-[10px] whitespace-nowrap">{k}</dt>
                      <dd className="num font-bold text-[26px] leading-none mt-1 whitespace-nowrap">
                        {v}<span className="text-[12px] font-semibold text-mute ml-0.5 tracking-normal" style={{ fontStretch: '100%' }}>{unit}</span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex items-center justify-between gap-2 mt-2.5 text-[13px]">
                  {isSoft && <span className="font-bold">Soft water</span>}
                  {isMedium && <span className="font-bold text-ok">SCA target hardness</span>}
                  {isHard && (
                    <span className="font-bold text-bad inline-flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4" aria-hidden />
                      Hard · scale risk
                    </span>
                  )}
                  {water.ph && <span className="text-mute">pH <b className="num text-ink">{water.ph}</b></span>}
                </div>

                {water.description && (
                  <p className="text-[13.5px] text-mute leading-snug mt-2 line-clamp-3">{water.description}</p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Add / edit sheet */}
      {isModalOpen && (
        <Sheet
          side={wide}
          title={waterToEdit ? 'Edit water profile' : 'Add water profile'}
          sub="Enter readings in ppm (mg/L as CaCO₃)"
          onClose={closeModal}
          footer={
            <>
              <Btn onClick={closeModal}>Cancel</Btn>
              <Btn variant="primary" type="submit" form="water-profile-form" className="flex-1">
                {waterToEdit ? 'Save changes' : 'Add water profile'}
              </Btn>
            </>
          }
        >
          <form id="water-profile-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="block">
              <Caps className="mb-1">Name</Caps>
              <input
                type="text"
                required
                placeholder="e.g. Melbourne tap water"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Caps className="mb-1">Source</Caps>
                <SmartDropdownWithOthers
                  options={WATER_SOURCE_OPTIONS}
                  value={type}
                  onChange={(val) => setType(val)}
                  customVariableGroup="waters"
                  placeholder="Select or enter a water type"
                />
              </div>
              <label className="block">
                <Caps className="mb-1">Country / region</Caps>
                <input
                  type="text"
                  placeholder="e.g. Australia (Melbourne)"
                  value={countryRegion}
                  onChange={(e) => setCountryRegion(e.target.value)}
                  className={inputCls}
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="block min-w-0">
                <Caps className="mb-1 whitespace-nowrap">TDS · ppm</Caps>
                <input
                  type="number"
                  inputMode="numeric"
                  required
                  value={tdsPpm}
                  onChange={(e) => setTdsPpm(parseInt(e.target.value) || 0)}
                  className={numberCls}
                />
              </label>
              <label className="block min-w-0">
                <Caps className="mb-1 whitespace-nowrap">GH · ppm</Caps>
                <input
                  type="number"
                  inputMode="numeric"
                  required
                  value={ghPpm}
                  onChange={(e) => setGhPpm(parseInt(e.target.value) || 0)}
                  className={numberCls}
                />
              </label>
              <label className="block min-w-0">
                <Caps className="mb-1 whitespace-nowrap">KH · ppm</Caps>
                <input
                  type="number"
                  inputMode="numeric"
                  required
                  value={khPpm}
                  onChange={(e) => setKhPpm(parseInt(e.target.value) || 0)}
                  className={numberCls}
                />
              </label>
            </div>
            {u.hardness !== 'ppm' && (
              <p className="text-[12.5px] text-mute -mt-2">
                That is GH <b className="text-ink num">{hard(ghPpm)}</b> · KH <b className="text-ink num">{hard(khPpm)}</b>.
              </p>
            )}

            <label className="block">
              <Caps className="mb-1">pH</Caps>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value) || 7.0)}
                className={`${numberCls} max-w-[140px]`}
              />
            </label>

            <label className="block">
              <Caps className="mb-1">Flavour impact and notes</Caps>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How does this water change body, acidity or boiler scale?"
                className="w-full border border-ink bg-paper p-3 text-[15px] leading-snug"
              />
            </label>
          </form>
        </Sheet>
      )}
    </div>
  );
};
