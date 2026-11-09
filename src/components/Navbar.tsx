import React, { useState } from 'react';
import {
  Coffee,
  Timer,
  BookOpen,
  Droplets,
  Layers,
  History,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Milestone
} from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';

export type NavTab = 'recipes' | 'brew' | 'kopi' | 'beans' | 'gear' | 'water' | 'history';

interface Props {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSetup?: () => void;
}

export const Navbar: React.FC<Props> = ({ currentTab, onSelectTab, onOpenSetup }) => {
  const { exportDataAsJSON, importDataFromJSON, resetToDefaults } = useCoffee();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = () => {
    const json = exportDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CoffeeWorks-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Backup exported successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importDataFromJSON(importText);
    if (success) {
      setStatusMessage('Data restored successfully!');
      setImportText('');
      setTimeout(() => {
        setStatusMessage('');
        setShowBackupModal(false);
      }, 1500);
    } else {
      setStatusMessage('Invalid JSON format. Please verify the backup file.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => onSelectTab('recipes')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/50 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-stone-100">
                    Coffee<span className="text-amber-500">Works</span>
                  </span>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-amber-500/30">
                    2026 PRO
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono hidden sm:block">
                  Dial-in & Recipe Vault
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => onSelectTab('recipes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'recipes'
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Recipe Vault</span>
              </button>

              <button
                onClick={() => onSelectTab('brew')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'brew'
                    ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-900/30'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-500/20'
                }`}
              >
                <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Live Brew Station</span>
              </button>

              <button
                onClick={() => onSelectTab('kopi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'kopi'
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Milestone className="w-4 h-4 text-red-400" />
                <span>Kopi Lab 🇸🇬</span>
              </button>

              <button
                onClick={() => onSelectTab('beans')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'beans'
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Bean Cellar</span>
              </button>

              <button
                onClick={() => onSelectTab('gear')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'gear'
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Gear Locker</span>
              </button>

              <button
                onClick={() => onSelectTab('water')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'water'
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Water Lab</span>
              </button>

              <button
                onClick={() => onSelectTab('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  currentTab === 'history'
                    ? 'bg-stone-800 text-amber-400 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Dial-in History</span>
              </button>
            </nav>

            {/* Setup & Backup Trigger */}
            <div className="flex items-center space-x-2">
              {onOpenSetup && (
                <button
                  onClick={onOpenSetup}
                  title="Configure Default Brewing Method & Rig"
                  className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Daily Defaults</span>
                </button>
              )}

              <button
                onClick={() => setShowBackupModal(true)}
                title="Backup & Restore Data"
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center space-x-1 px-4 py-2 border-t border-stone-800/80 overflow-x-auto scrollbar-none bg-stone-950">
          <button
            onClick={() => onSelectTab('recipes')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'recipes' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => onSelectTab('brew')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium flex items-center space-x-1 ${
              currentTab === 'brew' ? 'bg-amber-600 text-white font-semibold' : 'text-amber-400'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Stopwatch</span>
          </button>
          <button
            onClick={() => onSelectTab('kopi')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'kopi' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
            }`}
          >
            Kopi 🇸🇬
          </button>
          <button
            onClick={() => onSelectTab('beans')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'beans' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
            }`}
          >
            Beans
          </button>
          <button
            onClick={() => onSelectTab('gear')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'gear' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
            }`}
          >
            Gear
          </button>
          <button
            onClick={() => onSelectTab('water')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'water' ? 'bg-stone-800 text-cyan-400' : 'text-stone-400'
            }`}
          >
            Water
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              currentTab === 'history' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'
            }`}
          >
            History
          </button>
        </div>
      </header>

      {/* Backup / Export / Import Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-100 flex items-center space-x-2">
              <Download className="w-5 h-5 text-amber-500" />
              <span>Data Backup & Sync</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Export your custom coffee recipes, water matrices, gear lockers, and dial-in logs to a portable JSON file, or restore a previous backup.
            </p>

            {statusMessage && (
              <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                {statusMessage}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <button
                onClick={handleExport}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-amber-950/40"
              >
                <Download className="w-4 h-4" />
                <span>Export Full Backup (JSON)</span>
              </button>

              <div className="border-t border-stone-800 pt-4">
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Paste JSON Backup to Restore:
                </label>
                <textarea
                  rows={4}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder="Paste exported JSON here..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-300 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="mt-2 w-full py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-stone-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restore from JSON</span>
                </button>
              </div>

              <div className="border-t border-stone-800 pt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Reset all recipes, gear, water, and beans back to defaults? Custom entries will be removed.')) {
                      resetToDefaults();
                      setShowBackupModal(false);
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Defaults</span>
                </button>

                <button
                  onClick={() => setShowBackupModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-medium hover:bg-stone-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
