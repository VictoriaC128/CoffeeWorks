import React, { useCallback, useState } from 'react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { GearProfile, CoffeeCategory } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import { Btn, Caps, Sheet } from '../brew/ui';
import { MODES, MODE_ORDER } from '../brew/modes';
import { useLayout } from '../shell/LayoutContext';
import {
  ESPRESSO_MACHINE_OPTIONS,
  ESPRESSO_BASKET_OPTIONS,
  FILTER_DRIPPER_OPTIONS,
  FILTER_PAPER_OPTIONS,
  GRINDER_OPTIONS,
  WDT_OPTIONS,
  PUCK_SCREEN_OPTIONS,
  PORTAFILTER_OPTIONS,
  SHOWER_SCREEN_OPTIONS,
} from '../data/dropdownCatalog';

const INPUT = 'w-full h-12 border border-rule bg-paper px-3 text-[15px] text-ink focus:border-ink';

const isPressure = (c: CoffeeCategory) => c === 'espresso' || c === 'manual_lever';

const tamperLabel = (t: GearProfile['puckPrep']['tamperType']) =>
  t === 'calibrated_30lb' ? '30 lb spring tamper' : t === 'electronic_puqpress' ? 'Puqpress auto' : 'Flat tamper';

/** Ruled checkbox row with a 48px+ target. */
const CheckRow: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }> = ({ checked, onChange, label, sub }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="w-full grid grid-cols-[24px_1fr] gap-3 items-center min-h-[52px] py-2 border-b border-rule text-left active:bg-tint"
  >
    <i aria-hidden className={`w-6 h-6 border-[1.5px] border-ink flex items-center justify-center ${checked ? 'bg-ink text-paper' : ''}`}>
      {checked && <Check className="w-4 h-4" strokeWidth={3} />}
    </i>
    <span className="min-w-0">
      <b className="block text-[14.5px] leading-tight">{label}</b>
      {sub && <small className="block text-[12.5px] text-mute leading-snug">{sub}</small>}
    </span>
  </button>
);

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="flex flex-col gap-4">
    <h3 className="text-[16px] font-extrabold border-b border-ink pb-1.5 -mb-1">{title}</h3>
    {children}
  </section>
);

export const GearLocker: React.FC = () => {
  const { gearProfiles, addGear, updateGear, deleteGear } = useCoffee();
  const { mode } = useLayout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gearToEdit, setGearToEdit] = useState<GearProfile | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CoffeeCategory>('espresso');
  const [machineModel, setMachineModel] = useState('Lelit Bianca V3');
  const [grinderModel, setGrinderModel] = useState('Option-O Lagom P64');
  const [hasFlowControl, setHasFlowControl] = useState(false);
  const [hasPreInfusion, setHasPreInfusion] = useState(false);
  const [basketType, setBasketType] = useState('WAFO Spirit');
  const [portafilter, setPortafilter] = useState('MHW-3BOMBER 58mm Bottomless');
  const [showerScreen, setShowerScreen] = useState('Pesado High-Extraction Screen');
  const [dripperModel, setDripperModel] = useState('Orea V4 Modular (Apex Base)');
  const [filterPaperType, setFilterPaperType] = useState('Sibarist FAST Flat');
  const [isCeramicFilter, setIsCeramicFilter] = useState(false);
  const [hasImmersionValve, setHasImmersionValve] = useState(false);
  const [usesNegotiator, setUsesNegotiator] = useState(false);

  // Puck Prep states
  const [wdt, setWdt] = useState(true);
  const [wdtNeedleSize, setWdtNeedleSize] = useState('Subminimal Flick 0.25mm');
  const [distributor, setDistributor] = useState(true);
  const [tamperType, setTamperType] = useState<GearProfile['puckPrep']['tamperType']>('calibrated_30lb');
  const [puckScreen, setPuckScreen] = useState(true);
  const [puckScreenThickness, setPuckScreenThickness] = useState('0.2mm Sworks Billet');
  const [bottomPaperFilter, setBottomPaperFilter] = useState(true);
  const [topPaperFilter, setTopPaperFilter] = useState(false);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleOpenAdd = () => {
    setGearToEdit(null);
    setName('');
    setCategory('espresso');
    setMachineModel('Lelit Bianca V3');
    setGrinderModel('Option-O Lagom P64');
    setHasFlowControl(true);
    setHasPreInfusion(true);
    setBasketType('WAFO Spirit');
    setPortafilter('MHW-3BOMBER 58mm Bottomless');
    setShowerScreen('Pesado High-Extraction Screen');
    setDripperModel('Orea V4 Modular (Apex Base)');
    setFilterPaperType('Sibarist FAST Flat');
    setIsCeramicFilter(false);
    setHasImmersionValve(false);
    setUsesNegotiator(false);
    setWdt(true);
    setWdtNeedleSize('Subminimal Flick 0.25mm');
    setDistributor(true);
    setTamperType('calibrated_30lb');
    setPuckScreen(true);
    setPuckScreenThickness('0.2mm Sworks Billet');
    setBottomPaperFilter(true);
    setTopPaperFilter(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gear: GearProfile) => {
    setGearToEdit(gear);
    setName(gear.name);
    setCategory(gear.category);
    setMachineModel(gear.machineModel);
    setGrinderModel(gear.grinderModel);
    setHasFlowControl(gear.hasFlowControl || false);
    setHasPreInfusion(gear.hasPreInfusion || false);
    setBasketType(gear.basketType || '');
    setPortafilter(gear.portafilter || 'N/A');
    setShowerScreen(gear.showerScreen || 'N/A');
    setDripperModel(gear.dripperModel || '');
    setFilterPaperType(gear.filterPaperType || '');
    setIsCeramicFilter(gear.isCeramicFilter || false);
    setHasImmersionValve(gear.hasImmersionValve || false);
    setUsesNegotiator(gear.usesNegotiator || false);

    setWdt(gear.puckPrep.wdt);
    setWdtNeedleSize(gear.puckPrep.wdtNeedleSize || 'Subminimal Flick 0.25mm');
    setDistributor(gear.puckPrep.distributor);
    setTamperType(gear.puckPrep.tamperType);
    setPuckScreen(gear.puckPrep.puckScreen);
    setPuckScreenThickness(gear.puckPrep.puckScreenThickness || '0.2mm Sworks Billet');
    setBottomPaperFilter(gear.puckPrep.bottomPaperFilter);
    setTopPaperFilter(gear.puckPrep.topPaperFilter);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const gearData = {
      name,
      category,
      machineModel,
      grinderModel,
      hasFlowControl: category === 'espresso' || category === 'manual_lever' ? hasFlowControl : undefined,
      hasPreInfusion: category === 'espresso' || category === 'manual_lever' ? hasPreInfusion : undefined,
      basketType: category === 'espresso' || category === 'manual_lever' ? basketType : undefined,
      portafilter: (category === 'espresso' || category === 'manual_lever') && portafilter !== 'N/A' ? portafilter : undefined,
      showerScreen: (category === 'espresso' || category === 'manual_lever') && showerScreen !== 'N/A' ? showerScreen : undefined,
      dripperModel: category === 'filter' ? dripperModel : undefined,
      filterPaperType: category === 'filter' ? filterPaperType : undefined,
      isCeramicFilter: category === 'filter' ? isCeramicFilter : undefined,
      hasImmersionValve: category === 'filter' ? hasImmersionValve : undefined,
      usesNegotiator: category === 'filter' ? usesNegotiator : undefined,
      puckPrep: {
        wdt,
        wdtNeedleSize,
        distributor,
        tamperType,
        puckScreen,
        puckScreenThickness,
        bottomPaperFilter,
        topPaperFilter,
      },
    };

    if (gearToEdit) {
      updateGear(gearToEdit.id, gearData);
    } else {
      addGear(gearData);
    }

    setIsModalOpen(false);
  };

  // Group rigs by discipline, in mode order; anything unrecognised goes last.
  const groups: { key: string; label: string; swatch: string; list: GearProfile[] }[] = MODE_ORDER.map(c => ({
    key: c,
    label: MODES[c].label,
    swatch: MODES[c].bg,
    list: gearProfiles.filter(g => g.category === c),
  }));
  const other = gearProfiles.filter(g => !MODES[g.category]);
  if (other.length) groups.push({ key: 'other', label: 'Other', swatch: 'border-[1.5px] border-ink', list: other });

  const renderRig = (gear: GearProfile) => {
    const pressure = isPressure(gear.category);
    const specs: [string, string][] = [
      [gear.dripperModel ? 'Dripper' : 'Machine', gear.dripperModel || gear.machineModel],
      ['Grinder', gear.grinderModel],
    ];
    if (pressure) {
      if (gear.basketType) specs.push(['Basket', gear.basketType]);
      if (gear.portafilter && gear.portafilter !== 'N/A') specs.push(['Portafilter', gear.portafilter]);
      if (gear.showerScreen && gear.showerScreen !== 'N/A') specs.push(['Shower screen', gear.showerScreen]);
    }
    if (gear.category === 'filter' && gear.filterPaperType) specs.push(['Paper', gear.filterPaperType]);

    const flags: string[] = [];
    if (pressure) {
      if (gear.hasFlowControl) flags.push('Flow control');
      if (gear.hasPreInfusion) flags.push('Pre-infusion');
    }
    if (gear.category === 'filter') {
      if (gear.usesNegotiator) flags.push('Orea Negotiator');
      if (gear.isCeramicFilter) flags.push('Ceramic micro-filter');
      if (gear.hasImmersionValve) flags.push('Immersion valve');
    }

    const prep: { label: string; tool?: string; on: boolean }[] = [
      { label: 'Bottom paper', on: gear.puckPrep.bottomPaperFilter },
      { label: 'WDT', tool: gear.puckPrep.wdtNeedleSize || 'Needles', on: gear.puckPrep.wdt },
      { label: 'Distributor', tool: 'Surface leveller', on: gear.puckPrep.distributor },
      { label: 'Tamp', tool: tamperLabel(gear.puckPrep.tamperType), on: true },
      { label: 'Puck screen', tool: gear.puckPrep.puckScreenThickness, on: gear.puckPrep.puckScreen },
    ];

    return (
      <article key={gear.id} className="py-4 border-b border-rule flex flex-col gap-3 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="flex-1 min-w-0 text-[18px] font-extrabold leading-tight break-words pt-3">{gear.name}</h3>
          <button
            type="button"
            onClick={() => handleOpenEdit(gear)}
            className="w-12 h-12 shrink-0 border border-rule flex items-center justify-center active:bg-tint"
            aria-label={`Edit ${gear.name}`}
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete gear rig "${gear.name}"?`)) deleteGear(gear.id);
            }}
            className="w-12 h-12 shrink-0 border border-rule flex items-center justify-center text-bad active:bg-tint"
            aria-label={`Delete ${gear.name}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <dl className="grid grid-cols-[104px_1fr] text-[13.5px] leading-snug border-t border-rule">
          {specs.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="label-caps py-2 pr-2 border-b border-rule">{k}</dt>
              <dd className="py-2 border-b border-rule font-semibold min-w-0 break-words">{v}</dd>
            </React.Fragment>
          ))}
        </dl>

        {flags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Features">
            {flags.map(f => (
              <li key={f} className="border border-rule px-2 py-0.5 text-[12.5px] font-semibold">{f}</li>
            ))}
          </ul>
        )}

        {pressure && (
          <div>
            <Caps className="mb-1">Puck prep, in order</Caps>
            <ul className="border-t border-ink">
              {prep.map((p, i) => (
                <li
                  key={p.label}
                  className={`grid grid-cols-[20px_22px_1fr] gap-2 items-center py-1.5 border-b border-rule text-[13.5px] ${p.on ? '' : 'text-mute'}`}
                >
                  <i
                    aria-hidden
                    className={`w-5 h-5 border-[1.5px] flex items-center justify-center ${p.on ? 'bg-ink border-ink text-paper' : 'border-rule'}`}
                  >
                    {p.on && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </i>
                  <span className="text-[11px] font-extrabold text-mute num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="sr-only">{p.on ? 'Used: ' : 'Not used: '}</span>
                    <b className={p.on ? '' : 'font-semibold line-through'}>{p.label}</b>
                    {p.tool && <span className="text-mute"> · {p.tool}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    );
  };

  const machineDropdown =
    category === 'espresso' ? (
      <SmartDropdownWithOthers
        label="Espresso machine"
        value={machineModel}
        onChange={setMachineModel}
        options={ESPRESSO_MACHINE_OPTIONS}
        customVariableGroup="machines"
      />
    ) : category === 'filter' ? (
      <SmartDropdownWithOthers
        label="Filter dripper"
        value={dripperModel}
        onChange={setDripperModel}
        options={FILTER_DRIPPER_OPTIONS}
        customVariableGroup="drippers"
      />
    ) : (
      <SmartDropdownWithOthers
        label="Machine / manual vessel"
        value={machineModel}
        onChange={setMachineModel}
        options={[
          { label: 'Flair 58+ (Electric Chamber)', value: 'Flair 58+' },
          { label: 'Flair 58x (Non-Electric)', value: 'Flair 58x' },
          { label: 'Cafelat Robot (Manual Lever with Gauge)', value: 'Cafelat Robot' },
          { label: 'Odyssey Argos (Spring / Direct Lever)', value: 'Odyssey Argos' },
          { label: 'Wacaco Picopresso (Handheld Precision 18 bar)', value: 'Wacaco Picopresso' },
          { label: '9Barista Twin Boiler 9-Bar Stovetop', value: '9Barista Stovetop' },
          { label: 'Bialetti Brikka 4-Cup (Crema Valve)', value: 'Bialetti Brikka' },
          { label: 'Bialetti Moka Express Classic', value: 'Bialetti Moka Express' },
          { label: 'AeroPress Clear (Upright/Inverted)', value: 'AeroPress Clear' },
          { label: 'AeroPress Original / XL / Go', value: 'AeroPress Go' },
          { label: 'Singapore Stainless Kettle & Pull Sock', value: 'Traditional Pull Sock' },
        ]}
        customVariableGroup="machines"
      />
    );

  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* Header band: full-bleed across the page padding */}
      <header className="-mx-4 sm:-mx-6 mb-2 bg-ink text-paper px-4 sm:px-6 py-4 flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-black tracking-[-0.02em] leading-tight">Gear</h1>
          <p className="text-[13px] opacity-80 mt-0.5">
            {gearProfiles.length} {gearProfiles.length === 1 ? 'rig' : 'rigs'} · machines, grinders, drippers and puck prep tools
          </p>
        </div>
        <Btn size="md" className="ml-auto !min-h-[48px] !border-paper" onClick={handleOpenAdd}>
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          Add rig
        </Btn>
      </header>

      {gearProfiles.length === 0 && (
        <div className="border-y border-ink py-8 mt-4 text-center">
          <p className="text-[16px] font-bold">No gear yet</p>
          <p className="text-[13.5px] text-mute mt-1">Add your machine or dripper and grinder so recipes and prep can use them.</p>
        </div>
      )}

      {groups.filter(g => g.list.length > 0).map(g => (
        <section key={g.key} className="mt-5">
          <div className="flex items-center gap-2.5 border-b border-ink pb-1.5">
            <i aria-hidden className={`w-4 h-4 shrink-0 ${g.swatch}`} />
            <h2 className="text-[17px] font-extrabold">{g.label}</h2>
            <span className="num font-bold text-[15px] text-mute">{g.list.length}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
            {g.list.map(renderRig)}
          </div>
        </section>
      ))}

      {/* Add / Edit sheet */}
      {isModalOpen && (
        <Sheet
          side={mode !== 'simple'}
          title={gearToEdit ? 'Edit rig' : 'Add rig'}
          sub={gearToEdit ? gearToEdit.name : 'Recipes and prep checklists use these tools.'}
          onClose={closeModal}
          footer={
            <>
              <Btn className="flex-1" onClick={closeModal}>Cancel</Btn>
              <Btn variant="primary" type="submit" form="gear-form" className="flex-[1.6]">
                {gearToEdit ? 'Save changes' : 'Add rig'}
              </Btn>
            </>
          }
        >
          <form id="gear-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="block">
                <span className="label-caps block mb-1">Rig name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home Bianca 30lb Rig"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={INPUT}
                />
              </label>

              <div>
                <Caps className="mb-1">Discipline</Caps>
                <div role="radiogroup" aria-label="Discipline" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MODE_ORDER.map(c => {
                    const on = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setCategory(c)}
                        className={`min-h-[48px] px-3 flex items-center gap-2.5 text-left text-[14.5px] font-bold ${on ? 'border-2 border-ink' : 'border border-rule m-px'}`}
                      >
                        <i aria-hidden className={`w-3.5 h-3.5 shrink-0 ${MODES[c].bg}`} />
                        {MODES[c].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {machineDropdown}
                <SmartDropdownWithOthers
                  label="Grinder & burrs"
                  value={grinderModel}
                  onChange={setGrinderModel}
                  options={GRINDER_OPTIONS}
                  customVariableGroup="grinders"
                />
              </div>
            </div>

            {/* Espresso & Lever Controls */}
            {isPressure(category) && (
              <>
                <FormSection title="Machine">
                  <div className="border-t border-rule -mt-1">
                    <CheckRow checked={hasFlowControl} onChange={setHasFlowControl} label="Flow control" sub="Needle valve or paddle" />
                    <CheckRow checked={hasPreInfusion} onChange={setHasPreInfusion} label="Pre-infusion" />
                  </div>

                  <SmartDropdownWithOthers
                    label="Basket"
                    value={basketType || 'WAFO Spirit'}
                    onChange={setBasketType}
                    options={ESPRESSO_BASKET_OPTIONS}
                    customVariableGroup="baskets"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SmartDropdownWithOthers
                      label="Portafilter"
                      value={portafilter}
                      onChange={setPortafilter}
                      options={PORTAFILTER_OPTIONS}
                      customVariableGroup="portafilters"
                    />
                    <SmartDropdownWithOthers
                      label="Shower screen"
                      value={showerScreen}
                      onChange={setShowerScreen}
                      options={SHOWER_SCREEN_OPTIONS}
                      customVariableGroup="shower_screens"
                    />
                  </div>
                </FormSection>

                <FormSection title="Puck prep tools">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SmartDropdownWithOthers
                      label="WDT tool"
                      value={wdtNeedleSize || 'Subminimal Flick 0.25mm'}
                      onChange={setWdtNeedleSize}
                      options={WDT_OPTIONS}
                      customVariableGroup="wdt_tools"
                    />
                    <SmartDropdownWithOthers
                      label="Puck screen"
                      value={puckScreenThickness || '0.2mm Sworks Billet'}
                      onChange={setPuckScreenThickness}
                      options={PUCK_SCREEN_OPTIONS}
                      customVariableGroup="puck_screens"
                    />
                  </div>

                  <div>
                    <Caps className="mb-1">Use in every shot</Caps>
                    <div className="border-t border-ink">
                      <CheckRow checked={bottomPaperFilter} onChange={setBottomPaperFilter} label="Bottom paper" sub="Paper disc under the puck" />
                      <CheckRow checked={wdt} onChange={setWdt} label="WDT" sub={wdtNeedleSize || undefined} />
                      <CheckRow checked={distributor} onChange={setDistributor} label="Distributor" sub="Surface leveller or wedge" />
                      <CheckRow checked={puckScreen} onChange={setPuckScreen} label="Puck screen" sub={puckScreenThickness || undefined} />
                    </div>
                  </div>
                </FormSection>
              </>
            )}

            {/* Filter Tooling Controls */}
            {category === 'filter' && (
              <FormSection title="Filter papers">
                <SmartDropdownWithOthers
                  label="Filter paper"
                  value={filterPaperType}
                  onChange={setFilterPaperType}
                  options={FILTER_PAPER_OPTIONS}
                  customVariableGroup="papers"
                />
                <div className="border-t border-rule">
                  <CheckRow checked={usesNegotiator} onChange={setUsesNegotiator} label="Orea Negotiator" sub="Zero-bypass insert" />
                  <CheckRow checked={isCeramicFilter} onChange={setIsCeramicFilter} label="Porous ceramic micro-filter" />
                </div>
              </FormSection>
            )}
          </form>
        </Sheet>
      )}
    </div>
  );
};
