import React, { useState } from 'react';
import { Plus, Sparkles, Calendar, MapPin, Layers, Coffee, Trash2, Edit2, X, AlertCircle } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { Bean, RoastLevel, ProcessMethod } from '../types/coffee';

export const BeanCellar: React.FC = () => {
  const { beans, addBean, updateBean, deleteBean } = useCoffee();

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2.5">
            <Sparkles className="w-7 h-7 text-amber-500" />
            <span>Bean Cellar & Inventory</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Track roast dates, degassing resting status, fermentation processes, and cupping aroma notes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coffee Bean</span>
        </button>
      </div>

      {/* Beans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {beans.map(bean => {
          const daysOff = getDaysOffRoast(bean.roastDate);
          const isResting = daysOff < (bean.degassingDaysIdeal || 7);
          const isPeak = daysOff >= (bean.degassingDaysIdeal || 7) && daysOff <= 40;
          const isPastPeak = daysOff > 40;

          return (
            <div
              key={bean.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Roaster & Actions */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-semibold text-amber-500 truncate">
                    {bean.roaster || 'Specialty Roaster'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(bean)}
                      className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove bean "${bean.name}"?`)) deleteBean(bean.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg text-white line-clamp-1">{bean.name}</h3>

                {/* Origin & Varietal */}
                <div className="flex items-center space-x-2 text-xs text-stone-400 mt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    <span>{bean.origin}{bean.region ? `, ${bean.region}` : ''}</span>
                  </span>
                  {bean.varietal && <span>• {bean.varietal}</span>}
                </div>

                {/* Degassing Status Badge */}
                <div className="my-3 p-2.5 bg-stone-950/70 rounded-xl border border-stone-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>{daysOff} days off roast</span>
                  </span>

                  {isResting && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                      Degassing (Resting)
                    </span>
                  )}
                  {isPeak && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Peak Flavor Window
                    </span>
                  )}
                  {isPastPeak && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                      Past Peak
                    </span>
                  )}
                </div>

                {/* Roast & Process */}
                <div className="flex flex-wrap gap-1.5 my-2">
                  <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded-md border border-stone-700/60 capitalize">
                    {bean.roastLevel.replace('_', ' ')} Roast
                  </span>
                  <span className="text-[10px] font-mono bg-stone-800 text-amber-300 px-2 py-0.5 rounded-md border border-stone-700/60 capitalize">
                    {bean.processMethod.replace('_', ' ')}
                  </span>
                </div>

                {/* Tasting Notes */}
                {bean.tastingNotes.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                      Tasting Notes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {bean.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-amber-950/40 text-amber-200 border border-amber-800/40 px-2 py-0.5 rounded-lg"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aroma */}
                {bean.aroma && (
                  <p className="text-xs text-stone-400 mt-2 italic">
                    👃 "{bean.aroma}"
                  </p>
                )}

                {/* User Notes */}
                {bean.notes && (
                  <p className="text-xs text-stone-400 mt-2 bg-stone-950/40 p-2 rounded-lg border border-stone-800/60">
                    📝 {bean.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-bold text-white">
                {beanToEdit ? 'Edit Bean Profile' : 'Add New Specialty Bean'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Bean Name / Lot:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chelchele Washed"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Roaster:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manhattan Coffee Roasters"
                    value={roaster}
                    onChange={e => setRoaster(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Origin Country:</label>
                  <input
                    type="text"
                    placeholder="e.g. Ethiopia"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Region:</label>
                  <input
                    type="text"
                    placeholder="e.g. Gedeb, Yirgacheffe"
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Varietal:</label>
                  <input
                    type="text"
                    placeholder="e.g. Heirloom 74112 / Geisha"
                    value={varietal}
                    onChange={e => setVarietal(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Roast Degree:</label>
                  <select
                    value={roastLevel}
                    onChange={e => setRoastLevel(e.target.value as RoastLevel)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="light">Light Roast (Filter / Nordic)</option>
                    <option value="med_light">Medium-Light</option>
                    <option value="medium">Medium Roast</option>
                    <option value="med_dark">Medium-Dark</option>
                    <option value="dark">Dark Roast</option>
                    <option value="nanyang_wok">Traditional Nanyang Wok Butter Roast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Processing Method:</label>
                  <select
                    value={processMethod}
                    onChange={e => setProcessMethod(e.target.value as ProcessMethod)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="washed">Washed</option>
                    <option value="natural">Natural</option>
                    <option value="honey">Honey / Pulped Natural</option>
                    <option value="anaerobic_fermentation">Anaerobic Fermentation</option>
                    <option value="carbonic_maceration">Carbonic Maceration</option>
                    <option value="thermal_shock">Thermal Shock</option>
                    <option value="co_fermented">Fruit Co-Fermented</option>
                    <option value="traditional_butter_sugar_roast">Traditional Butter/Sugar Roast</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Roast Date:</label>
                  <input
                    type="date"
                    value={roastDate}
                    onChange={e => setRoastDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Ideal Degassing Days:</label>
                  <input
                    type="number"
                    value={degassingDaysIdeal}
                    onChange={e => setDegassingDaysIdeal(parseInt(e.target.value) || 14)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">
                  Tasting Notes (comma-separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jasmine, White Peach, Bergamot, Honey"
                  value={tastingNotesInput}
                  onChange={e => setTastingNotesInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">Aroma Profile:</label>
                <input
                  type="text"
                  placeholder="e.g. Floral perfume, candied lemon"
                  value={aroma}
                  onChange={e => setAroma(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">Comments / Notes:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional observations, storage notes, or cupping scores..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

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
                  {beanToEdit ? 'Save Changes' : 'Add Bean'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
