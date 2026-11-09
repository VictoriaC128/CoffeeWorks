import React from 'react';
import { History, Calendar, Trash2, Lightbulb } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';

export const DialInHistory: React.FC = () => {
  const { sessions, deleteSession } = useCoffee();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2.5">
            <History className="w-7 h-7 text-amber-500" />
            <span>Dial-in Session History</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Review past extraction yields, flow rate metrics, refractometer measurements, and sensory logs to iterate your cups.
          </p>
        </div>

        <div className="text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl">
          Total Brews Logged: <span className="text-amber-400 font-bold">{sessions.length}</span>
        </div>
      </div>

      {/* History List */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {session.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-stone-400 flex items-center space-x-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(session.timestamp).toLocaleString()}</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white mt-1">{session.recipeTitle}</h3>
                  <p className="text-xs text-stone-400">Bean: {session.beanName}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                      Verdict
                    </span>
                    <span className="text-xs font-bold text-amber-300 capitalize">
                      {session.sensory.verdict.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this brew session?')) deleteSession(session.id);
                    }}
                    className="p-2 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-800"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-stone-950/70 rounded-xl border border-stone-800/80 text-xs font-mono text-center">
                <div>
                  <span className="text-[10px] text-stone-500 block">Dose / Yield</span>
                  <span className="font-bold text-stone-200">
                    {session.actualDoseGrams}g → {session.actualYieldGrams}g
                  </span>
                  <span className="text-[10px] text-stone-500 block">1:{session.actualRatio}</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Time</span>
                  <span className="font-bold text-stone-200">{session.actualTotalTimeSeconds}s</span>
                  {session.actualPreInfusionSeconds ? (
                    <span className="text-[10px] text-stone-500 block">
                      {session.actualPreInfusionSeconds}s Pre-inf
                    </span>
                  ) : null}
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Flow Rate</span>
                  <span className="font-bold text-cyan-400">{session.actualFlowRateGs} g/s</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Refractometer TDS</span>
                  <span className="font-bold text-stone-200">
                    {session.refractometerTdsPercent ? `${session.refractometerTdsPercent}%` : '--'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Extraction Yield</span>
                  <span className="font-bold text-amber-400">
                    {session.calculatedExtractionYieldPercent
                      ? `${session.calculatedExtractionYieldPercent}% EY`
                      : '--'}
                  </span>
                </div>
              </div>

              {/* Sensory Sliders Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-stone-950 p-2 rounded-lg border border-stone-800 flex justify-between">
                  <span className="text-stone-400">Acidity:</span>
                  <span className="text-amber-400 font-bold">{session.sensory.acidity}/5</span>
                </div>
                <div className="bg-stone-950 p-2 rounded-lg border border-stone-800 flex justify-between">
                  <span className="text-stone-400">Sweetness:</span>
                  <span className="text-amber-400 font-bold">{session.sensory.sweetness}/5</span>
                </div>
                <div className="bg-stone-950 p-2 rounded-lg border border-stone-800 flex justify-between">
                  <span className="text-stone-400">Bitterness:</span>
                  <span className="text-amber-400 font-bold">{session.sensory.bitterness}/5</span>
                </div>
                <div className="bg-stone-950 p-2 rounded-lg border border-stone-800 flex justify-between">
                  <span className="text-stone-400">Body:</span>
                  <span className="text-amber-400 font-bold">{session.sensory.body}/5</span>
                </div>
              </div>

              {/* Tasting Notes */}
              {session.sensoryNotes && (
                <p className="text-xs text-stone-300 italic bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/60">
                  💬 "{session.sensoryNotes}"
                </p>
              )}

              {/* Diagnostic Advice */}
              {session.dialInAdvice.length > 0 && (
                <div className="pt-2 border-t border-stone-800/60">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1 flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dial-in Recommendations Recorded:</span>
                  </span>
                  <ul className="space-y-1 text-xs text-stone-400">
                    {session.dialInAdvice.map((adv, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-900/50 border border-stone-800/80 rounded-3xl p-8">
          <History className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-300">No Brew Sessions Yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Open the Live Brew Station, select a recipe, time your extraction, and tap "Save to Dial-in History".
          </p>
        </div>
      )}
    </div>
  );
};
