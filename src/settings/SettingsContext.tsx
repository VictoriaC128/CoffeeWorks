import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { loadKey, saveKey } from '../platform/storage';
import { lockOrientation, setSystemBars } from '../platform/native';

export type ThemeId = 'paper' | 'oat' | 'olive' | 'roast' | 'night';
export type FontId = 'archivo' | 'atkinson' | 'lexend' | 'space' | 'fredoka';
export type LayoutPref = 'auto' | 'simple' | 'full';

export interface Units {
  coffee: 'g' | 'oz';
  water: 'ml' | 'g' | 'oz';
  temp: 'c' | 'f';
  hardness: 'ppm' | 'dh' | 'gpg';
  flow: 'gs' | 'mls';
  grind: 'dial' | 'um';
  time: 'ms' | 's';
}

export interface AppSettings {
  theme: ThemeId;
  font: FontId;
  layout: LayoutPref;
  units: Units;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'paper',
  font: 'archivo',
  layout: 'auto',
  units: { coffee: 'g', water: 'ml', temp: 'c', hardness: 'ppm', flow: 'gs', grind: 'dial', time: 'ms' },
};

export const THEMES: { id: ThemeId; name: string; note: string; dark: boolean; swatch: [string, string] }[] = [
  { id: 'paper', name: 'Paper', note: 'White · default', dark: false, swatch: ['#FFFFFF', '#151515'] },
  { id: 'oat', name: 'Oat', note: 'Rich cream', dark: false, swatch: ['#F0E4CC', '#2A2119'] },
  { id: 'olive', name: 'Olive', note: 'Soft, calm green', dark: false, swatch: ['#D5D7B5', '#262A17'] },
  { id: 'roast', name: 'Roast', note: 'Deep espresso brown', dark: true, swatch: ['#2B1C12', '#F6EFE6'] },
  { id: 'night', name: 'Night', note: 'Black, high contrast', dark: true, swatch: ['#000000', '#FFFFFF'] },
];

export const FONTS: { id: FontId; name: string; note: string; family: string }[] = [
  { id: 'archivo', name: 'Archivo', note: 'Modern · default', family: "'Archivo Variable', sans-serif" },
  { id: 'atkinson', name: 'Atkinson', note: 'Easiest to read', family: "'Atkinson Hyperlegible', sans-serif" },
  { id: 'lexend', name: 'Lexend', note: 'Friendly, open', family: "'Lexend Variable', sans-serif" },
  { id: 'space', name: 'Space Grotesk', note: 'Quirky', family: "'Space Grotesk Variable', sans-serif" },
  { id: 'fredoka', name: 'Fredoka', note: 'Rounded, playful', family: "'Fredoka Variable', sans-serif" },
];

interface SettingsCtx {
  settings: AppSettings;
  setTheme: (t: ThemeId) => void;
  setFont: (f: FontId) => void;
  setLayout: (l: LayoutPref) => void;
  setUnit: <K extends keyof Units>(key: K, value: Units[K]) => void;
  resetSettings: () => void;
}

const KEY = 'coffeeworks_settings_v1';
const Ctx = createContext<SettingsCtx | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = loadKey<Partial<AppSettings>>(KEY, {});
    return { ...DEFAULT_SETTINGS, ...saved, units: { ...DEFAULT_SETTINGS.units, ...(saved.units || {}) } };
  });

  useEffect(() => {
    saveKey(KEY, JSON.stringify(settings));
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.dataset.font = settings.font;
    const dark = THEMES.find((t) => t.id === settings.theme)?.dark ?? false;
    setSystemBars(!dark);
  }, [settings]);

  // Keep simple / Keep full pin the device orientation; Follow tilt releases it.
  useEffect(() => {
    lockOrientation(settings.layout === 'simple' ? 'portrait' : settings.layout === 'full' ? 'landscape' : 'auto');
  }, [settings.layout]);

  const value = useMemo<SettingsCtx>(() => ({
    settings,
    setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
    setFont: (font) => setSettings((s) => ({ ...s, font })),
    setLayout: (layout) => setSettings((s) => ({ ...s, layout })),
    setUnit: (key, value) => setSettings((s) => ({ ...s, units: { ...s.units, [key]: value } })),
    resetSettings: () => setSettings(DEFAULT_SETTINGS),
  }), [settings]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSettings = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSettings must be used within SettingsProvider');
  return c;
};
