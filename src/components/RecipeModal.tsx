import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Scale, Droplets, Thermometer, Layers, Save } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { Recipe, CoffeeCategory, PourStage } from '../types/coffee';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe | null;
}

export const RecipeModal: React.FC<Props> = ({ isOpen, onClose, recipeToEdit }) => {
  const { beans, gearProfiles, waterProfiles, addRecipe, updateRecipe } = useCoffee();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CoffeeCategory>('espresso');
  const [beanId, setBeanId] = useState<string>('');
  const [gearId, setGearId] = useState<string>('');
  const [waterProfileId, setWaterProfileId] = useState<string>('');

  const [doseGrams, setDoseGrams] = useState<number>(18);
  const [yieldGrams, setYieldGrams] = useState<number>(36);
  const [waterTempC, setWaterTempC] = useState<number>(93);
  const [grindSetting, setGrindSetting] = useState<string>('');
  const [grindMicrons, setGrindMicrons] = useState<number | undefined>(undefined);

  const [preInfusionSeconds, setPreInfusionSeconds] = useState<number>(0);
  const [targetTotalTimeSeconds, setTargetTotalTimeSeconds] = useState<number>(30);
  const [targetTdsPercent, setTargetTdsPercent] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');

  const [pourStages, setPourStages] = useState<PourStage[]>([]);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCategory(recipeToEdit.category);
      setBeanId(recipeToEdit.beanId || '');
      setGearId(recipeToEdit.gearId || '');
      setWaterProfileId(recipeToEdit.waterProfileId || '');
      setDoseGrams(recipeToEdit.doseGrams);
      setYieldGrams(recipeToEdit.yieldGrams);
      setWaterTempC(recipeToEdit.waterTempC);
      setGrindSetting(recipeToEdit.grindSetting);
      setGrindMicrons(recipeToEdit.grindMicrons);
      setPreInfusionSeconds(recipeToEdit.preInfusionSeconds || 0);
      setTargetTotalTimeSeconds(recipeToEdit.targetTotalTimeSeconds);
      setTargetTdsPercent(recipeToEdit.targetTdsPercent);
      setNotes(recipeToEdit.notes || '');
      setPourStages(recipeToEdit.pourStages || []);
    } else {
      setTitle('');
      setCategory('espresso');
      setBeanId(beans[0]?.id || '');
      setGearId(gearProfiles[0]?.id || '');
      setWaterProfileId(waterProfiles[0]?.id || '');
      setDoseGrams(18);
      setYieldGrams(36);
      setWaterTempC(93);
      setGrindSetting('Setting #1.5');
      setGrindMicrons(280);
      setPreInfusionSeconds(5);
      setTargetTotalTimeSeconds(30);
      setTargetTdsPercent(9.5);
      setNotes('');
      setPourStages([]);
    }
  }, [recipeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddPourStage = () => {
    const newStage: PourStage = {
      id: `stage-${Date.now()}`,
      name: `Pour ${pourStages.length + 1}`,
      targetWeightGrams: Math.round(yieldGrams * ((pourStages.length + 1) / (pourStages.length + 2))),
      startTimeSeconds: pourStages.length * 30,
      durationSeconds: 15,
      agitation: 'gentle_pour',
    };
    setPourStages([...pourStages, newStage]);
  };

  const handleRemovePourStage = (id: string) => {
    setPourStages(pourStages.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const recipeData = {
      title,
      category,
      beanId: beanId || undefined,
      gearId: gearId || undefined,
      waterProfileId: waterProfileId || undefined,
      doseGrams,
      yieldGrams,
      ratio: Number((yieldGrams / (doseGrams || 1)).toFixed(2)),
      waterTempC,
      grindSetting,
      grindMicrons,
      preInfusionSeconds: category === 'espresso' || category === 'manual_lever' ? preInfusionSeconds : 0,
      targetTotalTimeSeconds,
      targetFlowRateGs: Number((yieldGrams / (targetTotalTimeSeconds || 1)).toFixed(2)),
      targetTdsPercent,
      targetExtractionYieldPercent: targetTdsPercent
        ? Number(((yieldGrams * targetTdsPercent) / (doseGrams || 1)).toFixed(2))
        : undefined,
      pourStages: category === 'filter' || category === 'immersion' ? pourStages : undefined,
      notes,
      tags: [category.replace('_', ' ')],
    };

    if (recipeToEdit) {
      updateRecipe(recipeToEdit.id, recipeData);
    } else {
      addRecipe(recipeData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <h3 className="text-lg font-bold text-white">
            {recipeToEdit ? 'Edit Coffee Recipe' : 'Create Custom Coffee Recipe'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Recipe Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Orea V4 Apex 5-Pour Profile"
                value={title}
                onChange={e => setTitle(e.target.value)}
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

          {/* Bean, Gear, Water Linkers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Linked Bean:</label>
              <select
                value={beanId}
                onChange={e => setBeanId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">-- None / Any Bean --</option>
                {beans.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.roastLevel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Linked Gear Profile:</label>
              <select
                value={gearId}
                onChange={e => setGearId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">-- None / Default Gear --</option>
                {gearProfiles.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Water Profile:</label>
              <select
                value={waterProfileId}
                onChange={e => setWaterProfileId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Default Water --</option>
                {waterProfiles.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.tdsPpm} ppm)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dose, Yield, Temp, Time Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Dose In (g):</label>
              <input
                type="number"
                step="0.1"
                required
                value={doseGrams}
                onChange={e => setDoseGrams(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Yield Out (g):</label>
              <input
                type="number"
                step="0.5"
                required
                value={yieldGrams}
                onChange={e => setYieldGrams(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Water Temp (°C):</label>
              <input
                type="number"
                value={waterTempC}
                onChange={e => setWaterTempC(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-red-400 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Target Time (s):</label>
              <input
                type="number"
                value={targetTotalTimeSeconds}
                onChange={e => setTargetTotalTimeSeconds(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Grind Setting & Micron Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                Grind Setting (e.g. Ode 5.1 / Comandante 24):
              </label>
              <input
                type="text"
                placeholder="e.g. Fellow Ode Gen 2 #5.1"
                value={grindSetting}
                onChange={e => setGrindSetting(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">
                Estimated Microns (µm):
              </label>
              <input
                type="number"
                placeholder="e.g. 650"
                value={grindMicrons || ''}
                onChange={e => setGrindMicrons(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pour Schedule Builder for Filter & Immersion */}
          {(category === 'filter' || category === 'immersion') && (
            <div className="pt-2 border-t border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-stone-200">
                  Pour Stages & Drawdown Schedule:
                </span>
                <button
                  type="button"
                  onClick={handleAddPourStage}
                  className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stage</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pourStages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-2 p-2 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono"
                  >
                    <span className="w-4 text-stone-500 font-bold">{idx + 1}</span>
                    <input
                      type="text"
                      value={stage.name}
                      onChange={e => {
                        const updated = [...pourStages];
                        updated[idx].name = e.target.value;
                        setPourStages(updated);
                      }}
                      className="bg-transparent text-stone-200 flex-1 focus:outline-none"
                    />
                    <div className="flex items-center space-x-1">
                      <span className="text-stone-400">Target:</span>
                      <input
                        type="number"
                        value={stage.targetWeightGrams}
                        onChange={e => {
                          const updated = [...pourStages];
                          updated[idx].targetWeightGrams = parseFloat(e.target.value) || 0;
                          setPourStages(updated);
                        }}
                        className="w-16 bg-stone-900 border border-stone-700 rounded px-1.5 py-0.5 text-cyan-400 text-right focus:outline-none"
                      />
                      <span className="text-cyan-400">g</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span className="text-stone-400">@</span>
                      <input
                        type="number"
                        value={stage.startTimeSeconds}
                        onChange={e => {
                          const updated = [...pourStages];
                          updated[idx].startTimeSeconds = parseInt(e.target.value) || 0;
                          setPourStages(updated);
                        }}
                        className="w-12 bg-stone-900 border border-stone-700 rounded px-1.5 py-0.5 text-stone-200 text-right focus:outline-none"
                      />
                      <span className="text-stone-400">s</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePourStage(stage.id)}
                      className="p-1 text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1">
              Barista Notes & Preparation Steps:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. WDT thoroughly, 30lb spring tamp, top puck screen..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-stone-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-950/40"
            >
              <Save className="w-4 h-4" />
              <span>{recipeToEdit ? 'Save Changes' : 'Create Recipe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
