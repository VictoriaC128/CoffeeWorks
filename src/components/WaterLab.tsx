import React, { useState } from 'react';
import { Plus, Droplets, Info, Trash2, Edit2, X, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { WaterProfile, WaterType } from '../types/coffee';

export const WaterLab: React.FC = () => {
  const { waterProfiles, addWaterProfile, updateWaterProfile, deleteWaterProfile } = useCoffee();

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2.5">
            <Droplets className="w-7 h-7 text-cyan-400" />
            <span>Water Chemistry & Global Profiling Lab</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Water makes up 98.5% of your brew. Track TDS, General Hardness (GH), and Carbonate Alkalinity buffer (KH) across international water sources.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Water Profile</span>
        </button>
      </div>

      {/* Water Mineral Science Explainer Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs font-mono font-bold text-cyan-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Magnesium (Mg²⁺) • Fruit & Florals</span>
          </span>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            Smaller and more charge-dense than calcium, magnesium extracts light aromatic esters, fruit acids (malic, citric), and perceived sweetness.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Calcium (Ca²⁺) • Body & Crema</span>
          </span>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            Extracts heavier roasted notes, giving espresso its syrupy mouthfeel and dense crema, but can cause boiler scale at high concentrations.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs font-mono font-bold text-rose-400 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-rose-400" />
            <span>Alkalinity (KH) • Acid Buffer</span>
          </span>
          <p className="text-xs text-stone-300 mt-2 leading-relaxed">
            Bicarbonate ions buffer acidity. Low KH (~20-40 ppm) allows sparkling, crisp vibrancy; high KH (&gt;100 ppm) mutes acidity into flat chalkiness.
          </p>
        </div>
      </div>

      {/* Water Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {waterProfiles.map(water => {
          const isSoft = water.tdsPpm < 100;
          const isMedium = water.tdsPpm >= 100 && water.tdsPpm <= 180;
          const isHard = water.tdsPpm > 180;

          return (
            <div
              key={water.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Type & Actions */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {water.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(water)}
                      className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete water profile "${water.name}"?`)) deleteWaterProfile(water.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name & Region */}
                <h3 className="font-bold text-base text-white line-clamp-1">{water.name}</h3>
                <p className="text-xs text-stone-400 mt-0.5">{water.countryRegion}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 my-3 p-3 bg-stone-950/70 rounded-xl border border-stone-800/80 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-stone-500 block">TDS</span>
                    <span className="text-sm font-bold text-cyan-400">{water.tdsPpm} ppm</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">GH (Ca/Mg)</span>
                    <span className="text-sm font-bold text-stone-200">{water.ghPpm} ppm</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">KH (Buffer)</span>
                    <span className="text-sm font-bold text-amber-400">{water.khPpm} ppm</span>
                  </div>
                </div>

                {/* Hardness Badge */}
                <div className="flex items-center justify-between text-xs font-mono">
                  {isSoft && (
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                      Ultra-Soft / Soft Water
                    </span>
                  )}
                  {isMedium && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      SCA Target Hardness
                    </span>
                  )}
                  {isHard && (
                    <span className="text-[10px] bg-rose-500/10 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      <span>Hard / Scale Risk</span>
                    </span>
                  )}

                  {water.ph && <span className="text-stone-400">pH {water.ph}</span>}
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300 mt-3 line-clamp-2 leading-relaxed">
                  {water.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Water Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-bold text-white">
                {waterToEdit ? 'Edit Water Profile' : 'Add New Water Chemistry Profile'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">Water Profile Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Melbourne Specialty Tap Water"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Water Source Type:</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as WaterType)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="tap">Municipal Tap Water</option>
                    <option value="bottled_spring">Bottled Spring / Mineral</option>
                    <option value="remineralized_ro">Remineralized RO (Third Wave / Lotus)</option>
                    <option value="filtration_jug">Filtration Jug (Peak Water / Brita)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">Country / Region:</label>
                  <input
                    type="text"
                    placeholder="e.g. Australia (Melbourne)"
                    value={countryRegion}
                    onChange={e => setCountryRegion(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">TDS (ppm):</label>
                  <input
                    type="number"
                    required
                    value={tdsPpm}
                    onChange={e => setTdsPpm(parseInt(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">GH (Ca/Mg):</label>
                  <input
                    type="number"
                    required
                    value={ghPpm}
                    onChange={e => setGhPpm(parseInt(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">KH (Buffer):</label>
                  <input
                    type="number"
                    required
                    value={khPpm}
                    onChange={e => setKhPpm(parseInt(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">pH Level:</label>
                <input
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={e => setPh(parseFloat(e.target.value) || 7.0)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">Flavor Impact & Notes:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="How does this water affect body, acidity, or boiler scaling?"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                >
                  {waterToEdit ? 'Save Changes' : 'Add Water Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
