import React, { useState } from 'react';
import { Plus, Layers, ShieldCheck, Check, Trash2, Edit2, X, Zap } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { GearProfile, CoffeeCategory } from '../types/coffee';
import { SmartDropdownWithOthers } from './SmartDropdownWithOthers';
import {
  ESPRESSO_MACHINE_OPTIONS,
  ESPRESSO_BASKET_OPTIONS,
  FILTER_DRIPPER_OPTIONS,
  FILTER_PAPER_OPTIONS,
  GRINDER_OPTIONS,
  WDT_OPTIONS,
  PUCK_SCREEN_OPTIONS,
} from '../data/dropdownCatalog';

export const GearLocker: React.FC = () => {
  const { gearProfiles, addGear, updateGear, deleteGear } = useCoffee();

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

  const handleOpenAdd = () => {
    setGearToEdit(null);
    setName('');
    setCategory('espresso');
    setMachineModel('Lelit Bianca V3');
    setGrinderModel('Option-O Lagom P64');
    setHasFlowControl(true);
    setHasPreInfusion(true);
    setBasketType('WAFO Spirit');
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2.5">
            <Layers className="w-7 h-7 text-amber-500" />
            <span>Gear Locker & Tooling Suite</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Configure machines, precision baskets, needle WDT tools, 30lb spring tampers, Orea negotiators, and filter papers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gear Rig</span>
        </button>
      </div>

      {/* Gear Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {gearProfiles.map(gear => (
          <div
            key={gear.id}
            className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Category & Actions */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {gear.category.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(gear)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete gear rig "${gear.name}"?`)) deleteGear(gear.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-base text-white line-clamp-1">{gear.name}</h3>

              {/* Machine & Grinder */}
              <div className="mt-2 space-y-1 text-xs text-stone-300 font-mono">
                <p className="truncate">
                  <span className="text-stone-500">Machine/Dripper:</span>{' '}
                  <span className="text-stone-200">{gear.dripperModel || gear.machineModel}</span>
                </p>
                <p className="truncate">
                  <span className="text-stone-500">Grinder:</span>{' '}
                  <span className="text-stone-200">{gear.grinderModel}</span>
                </p>
              </div>

              {/* Espresso & Puck Prep Attributes */}
              {(gear.category === 'espresso' || gear.category === 'manual_lever') && (
                <div className="mt-3 pt-3 border-t border-stone-800 space-y-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                    Puck Preparation Workflow:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {gear.puckPrep.wdt && (
                      <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-300 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>WDT ({gear.puckPrep.wdtNeedleSize || 'Needles'})</span>
                      </span>
                    )}

                    {gear.puckPrep.distributor && (
                      <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-300 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Surface Leveler</span>
                      </span>
                    )}

                    <span className="bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 text-amber-300 font-semibold flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>
                        {gear.puckPrep.tamperType === 'calibrated_30lb'
                          ? '30 lb Spring Tamper'
                          : gear.puckPrep.tamperType === 'electronic_puqpress'
                          ? 'Puqpress Auto'
                          : 'Flat Tamper'}
                      </span>
                    </span>

                    {gear.puckPrep.puckScreen && (
                      <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-300 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>{gear.puckPrep.puckScreenThickness || 'Puck Screen'}</span>
                      </span>
                    )}

                    {gear.puckPrep.bottomPaperFilter && (
                      <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-300 flex items-center space-x-1">
                        <Check className="w-3 h-3 text-purple-400" />
                        <span>Bottom Basket Paper</span>
                      </span>
                    )}
                  </div>

                  {gear.basketType && (
                    <p className="text-[11px] font-mono text-stone-400 mt-1">
                      Basket: <span className="text-amber-400/90 font-semibold">{gear.basketType}</span>
                    </p>
                  )}

                  <div className="flex gap-2 text-[10px] font-mono text-stone-400 pt-1">
                    {gear.hasFlowControl && (
                      <span className="bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20">
                        Flow Profiling Needle
                      </span>
                    )}
                    {gear.hasPreInfusion && (
                      <span className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Pre-Infusion
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Filter Tooling Attributes */}
              {gear.category === 'filter' && (
                <div className="mt-3 pt-3 border-t border-stone-800 space-y-1.5">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                    Filter Extraction Engine:
                  </span>
                  {gear.filterPaperType && (
                    <p className="text-xs font-mono text-amber-300 flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{gear.filterPaperType}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    {gear.usesNegotiator && (
                      <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                        Orea Negotiator (Zero Bypass)
                      </span>
                    )}
                    {gear.isCeramicFilter && (
                      <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                        Porous Ceramic Micro-Filter
                      </span>
                    )}
                    {gear.hasImmersionValve && (
                      <span className="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                        Hybrid Immersion Valve
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Gear Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-bold text-white">
                {gearToEdit ? 'Edit Gear Profile' : 'Add New Coffee Gear Rig'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Rig Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home Bianca 30lb Rig"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as CoffeeCategory)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="espresso">Benchtop Espresso</option>
                    <option value="manual_lever">Manual Lever & Alternative Pressure</option>
                    <option value="moka_stovetop">Stovetop & Moka Pot</option>
                    <option value="filter">Modern Filter Coffee</option>
                    <option value="immersion">Immersion & AeroPress</option>
                    <option value="singaporean_kopi">Singaporean Kopi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {category === 'espresso' ? (
                  <SmartDropdownWithOthers
                    label="Espresso Machine:"
                    value={machineModel}
                    onChange={setMachineModel}
                    options={ESPRESSO_MACHINE_OPTIONS}
                    customVariableGroup="machines"
                  />
                ) : category === 'filter' ? (
                  <SmartDropdownWithOthers
                    label="Filter Dripper:"
                    value={dripperModel}
                    onChange={setDripperModel}
                    options={FILTER_DRIPPER_OPTIONS}
                    customVariableGroup="drippers"
                  />
                ) : (
                  <div>
                    <label className="block text-xs font-mono text-stone-300 mb-1">Machine / Vessel:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flair 58+ / 9Barista"
                      value={machineModel}
                      onChange={e => setMachineModel(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <SmartDropdownWithOthers
                  label="Grinder & Burrs:"
                  value={grinderModel}
                  onChange={setGrinderModel}
                  options={GRINDER_OPTIONS}
                  customVariableGroup="grinders"
                />
              </div>

              {/* Espresso & Lever Controls */}
              {(category === 'espresso' || category === 'manual_lever') && (
                <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    Puck Preparation & Machine Controls
                  </span>

                  <div className="flex items-center space-x-4 text-xs text-stone-300">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasFlowControl}
                        onChange={e => setHasFlowControl(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Flow Control Needle Valve</span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasPreInfusion}
                        onChange={e => setHasPreInfusion(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Pre-Infusion</span>
                    </label>
                  </div>

                  <SmartDropdownWithOthers
                    label="Precision Basket Model:"
                    value={basketType || 'WAFO Spirit'}
                    onChange={setBasketType}
                    options={ESPRESSO_BASKET_OPTIONS}
                    customVariableGroup="baskets"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <SmartDropdownWithOthers
                      label="Needle WDT Tool:"
                      value={wdtNeedleSize || 'Subminimal Flick 0.25mm'}
                      onChange={setWdtNeedleSize}
                      options={WDT_OPTIONS}
                      customVariableGroup="wdt_tools"
                    />

                    <SmartDropdownWithOthers
                      label="Top Puck Screen:"
                      value={puckScreenThickness || '0.2mm Sworks Billet'}
                      onChange={setPuckScreenThickness}
                      options={PUCK_SCREEN_OPTIONS}
                      customVariableGroup="puck_screens"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-300 pt-1">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wdt}
                        onChange={e => setWdt(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Use WDT Tool</span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={distributor}
                        onChange={e => setDistributor(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Surface Leveler (Wedge)</span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={puckScreen}
                        onChange={e => setPuckScreen(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Use Puck Screen</span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bottomPaperFilter}
                        onChange={e => setBottomPaperFilter(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Bottom Basket Paper Disc</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Filter Tooling Controls */}
              {category === 'filter' && (
                <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    Filter Geometry & Papers
                  </span>

                  <SmartDropdownWithOthers
                    label="Filter Paper Model:"
                    value={filterPaperType}
                    onChange={setFilterPaperType}
                    options={FILTER_PAPER_OPTIONS}
                    customVariableGroup="papers"
                  />

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-300 pt-1">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={usesNegotiator}
                        onChange={e => setUsesNegotiator(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Uses Orea Negotiator</span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCeramicFilter}
                        onChange={e => setIsCeramicFilter(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span>Porous Ceramic Micro-Filter</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-stone-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  {gearToEdit ? 'Save Changes' : 'Add Gear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
