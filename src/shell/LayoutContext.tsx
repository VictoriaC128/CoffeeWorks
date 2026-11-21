import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSettings } from '../settings/SettingsContext';
import { lockOrientation } from '../platform/native';

/**
 * simple  = one column + bottom tabs (device upright)
 * full    = left rail + wide brew layout (device sideways, tablet height)
 * compact = full layout squeezed for a phone held sideways (slim mode rail)
 */
export type LayoutMode = 'simple' | 'full' | 'compact';

interface LayoutCtx {
  mode: LayoutMode;
  landscape: boolean;
  /** Quick lock from the brew screen: pins the layout showing right now. */
  locked: boolean;
  toggleLock: () => void;
}

const Ctx = createContext<LayoutCtx | undefined>(undefined);

const readLandscape = () => window.matchMedia('(orientation: landscape)').matches;
const readShort = () => window.innerHeight < 560;

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [landscape, setLandscape] = useState(readLandscape);
  const [short, setShort] = useState(readShort);
  const [lockedMode, setLockedMode] = useState<LayoutMode | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');
    const onChange = () => { setLandscape(mq.matches); setShort(readShort()); };
    mq.addEventListener('change', onChange);
    window.addEventListener('resize', onChange);
    return () => { mq.removeEventListener('change', onChange); window.removeEventListener('resize', onChange); };
  }, []);

  const wide: LayoutMode = short ? 'compact' : 'full';
  let mode: LayoutMode;
  if (settings.layout === 'simple') mode = 'simple';
  else if (settings.layout === 'full') mode = wide;
  else mode = lockedMode ?? (landscape ? wide : 'simple');

  const toggleLock = () => {
    if (lockedMode) {
      setLockedMode(null);
      lockOrientation(settings.layout === 'auto' ? 'auto' : settings.layout === 'simple' ? 'portrait' : 'landscape');
    } else {
      setLockedMode(mode);
      lockOrientation(landscape ? 'landscape' : 'portrait');
    }
  };

  return (
    <Ctx.Provider value={{ mode, landscape, locked: settings.layout !== 'auto' || lockedMode !== null, toggleLock }}>
      {children}
    </Ctx.Provider>
  );
};

export const useLayout = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useLayout must be used within LayoutProvider');
  return c;
};
