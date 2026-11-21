import React, { useEffect, useState } from 'react';
import { BookOpen, Bean, Coffee, Menu, Timer, X } from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { CoffeeCategory } from '../types/coffee';
import { MODES, ALL_MODES, lotFor } from '../brew/modes';
import { useLayout } from './LayoutContext';
import { onBack } from '../platform/native';

export type Tab = 'brew' | 'recipes' | 'drinks' | 'kopi' | 'beans' | 'gear' | 'water' | 'history' | 'settings';

interface Props {
  tab: Tab;
  onTab: (t: Tab) => void;
  /** Daily driver tapped: load that discipline's default recipe and go to Brew. */
  onDriver: (c: CoffeeCategory) => void;
  brewState: 'ready' | 'running' | 'tasting';
  children: React.ReactNode;
}

const NAV: { id: Tab; label: string }[] = [
  { id: 'brew', label: 'Brew' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'drinks', label: 'Drink Lab' },
  { id: 'kopi', label: 'Kopi' },
  { id: 'beans', label: 'Beans' },
  { id: 'gear', label: 'Gear' },
  { id: 'water', label: 'Water' },
  { id: 'history', label: 'History' },
  { id: 'settings', label: 'Settings' },
];

function useCounts() {
  const { recipes, coffeeDrinks, beans, gearProfiles, waterProfiles, sessions } = useCoffee();
  return {
    recipes: recipes.length,
    drinks: coffeeDrinks.length,
    kopi: recipes.filter((r) => r.category === 'singaporean_kopi').length,
    beans: beans.length,
    gear: gearProfiles.length,
    water: waterProfiles.length,
    history: sessions.length,
  } as Partial<Record<Tab, number>>;
}

/** The six main methods, plus Others once the user has a recipe there. */
function useDrivers(): CoffeeCategory[] {
  const { recipes } = useCoffee();
  const hasOthers = recipes.some((r) => r.category === 'other');
  return ALL_MODES.filter((c) => c !== 'other' || hasOthers);
}

function useActiveDriver(): CoffeeCategory | undefined {
  const { selectedRecipeForBrew } = useCoffee();
  return selectedRecipeForBrew?.category;
}

/* Full layout: left rail with sections and daily drivers */
const Rail: React.FC<Props> = ({ tab, onTab, onDriver, brewState }) => {
  const counts = useCounts();
  const active = useActiveDriver();
  const drivers = useDrivers();
  const { defaultRecipeLabel } = useDriverLabels();
  return (
    <aside className="w-[212px] shrink-0 border-r border-rule flex flex-col pt-safe pl-safe h-full overflow-y-auto scrollbar-none">
      <div className="px-5 pt-5 pb-4 border-b border-rule">
        <div className="font-black text-[20px] tracking-[-0.02em]" style={{ fontStretch: '112%' }}>CoffeeWorks</div>
        <div className="label-caps mt-1 !text-[10px]">Brew station</div>
      </div>
      <nav className="py-2 border-b border-rule" aria-label="Sections">
        {NAV.map((n) => {
          const on = tab === n.id;
          const note = n.id === 'brew' ? (brewState === 'running' ? 'running' : brewState === 'tasting' ? 'tasting' : '') : counts[n.id];
          return (
            <button
              key={n.id}
              onClick={() => onTab(n.id)}
              aria-current={on ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-5 min-h-[44px] text-[15px] text-left ${on ? 'bg-ink text-paper font-bold' : 'font-medium hover:bg-tint'}`}
            >
              <span>{n.label}</span>
              {note !== undefined && note !== '' && <span className={`text-[11px] ${on ? 'opacity-70' : 'text-mute'}`}>{note}</span>}
            </button>
          );
        })}
      </nav>
      <div className="label-caps px-5 pt-4 pb-2 !text-[10.5px]">Daily drivers</div>
      {drivers.map((c) => (
        <button
          key={c}
          onClick={() => onDriver(c)}
          className={`grid grid-cols-[14px_1fr_auto] gap-2.5 items-center px-5 min-h-[40px] text-[13px] text-left ${active === c && tab === 'brew' ? 'bg-tint' : 'hover:bg-tint'}`}
        >
          <i className={`block w-3.5 h-3.5 ${MODES[c].bg}`} aria-hidden />
          <b className="font-semibold">{MODES[c].label}</b>
          <em className="not-italic text-[11px] text-mute">{defaultRecipeLabel(c)}</em>
        </button>
      ))}
    </aside>
  );
};

function useDriverLabels() {
  const { recipes, userPreferences } = useCoffee();
  return {
    defaultRecipeLabel: (c: CoffeeCategory) => {
      const id = userPreferences.defaultRecipePerCategory[c];
      const r = recipes.find((x) => x.id === id) || recipes.find((x) => x.category === c);
      return r ? lotFor(r, recipes) : '';
    },
  };
}

/* Compact layout: phone held sideways. Mode squares stay one tap away. */
const SlimRail: React.FC<Props & { onMenu: () => void }> = ({ onDriver, onMenu, tab }) => {
  const active = useActiveDriver();
  const drivers = useDrivers();
  return (
    <nav className="w-16 shrink-0 border-r border-rule flex flex-col pl-safe h-full" aria-label="Brewing modes">
      <div className="h-11 flex items-center justify-center font-black text-[13px] border-b border-rule" style={{ fontStretch: '112%' }}>CW</div>
      {drivers.map((c) => (
        <button
          key={c}
          onClick={() => onDriver(c)}
          className={`flex-1 max-h-[52px] min-h-[44px] flex flex-col items-center justify-center gap-1 text-[10px] font-bold ${active === c && tab === 'brew' ? 'bg-tint shadow-[inset_3px_0_0_rgb(var(--ink))]' : ''}`}
        >
          <i className={`block w-4 h-4 ${MODES[c].bg}`} aria-hidden />
          {MODES[c].short}
        </button>
      ))}
      <button onClick={onMenu} className="mt-auto h-12 border-t border-rule flex items-center justify-center" aria-label="All sections">
        <Menu className="w-5 h-5" />
      </button>
    </nav>
  );
};

/* Simple layout: bottom navigation bar */
const TABS: { id: Tab | 'more'; label: string; icon: React.ElementType }[] = [
  { id: 'brew', label: 'Brew', icon: Timer },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'kopi', label: 'Kopi', icon: Coffee },
  { id: 'beans', label: 'Beans', icon: Bean },
  { id: 'more', label: 'More', icon: Menu },
];

const BottomTabs: React.FC<{ tab: Tab; onTab: (t: Tab) => void; onMore: () => void }> = ({ tab, onTab, onMore }) => {
  const inMore = !TABS.some((t) => t.id === tab);
  return (
    <nav className="shrink-0 border-t border-ink grid grid-cols-5 pb-safe bg-paper" aria-label="Sections">
      {TABS.map(({ id, label, icon: Icon }) => {
        const on = id === 'more' ? inMore : tab === id;
        return (
          <button
            key={id}
            onClick={() => (id === 'more' ? onMore() : onTab(id as Tab))}
            aria-current={on ? 'page' : undefined}
            className={`h-16 flex flex-col items-center justify-center gap-1 text-[12px] ${on ? 'text-ink font-bold shadow-[inset_0_3px_0_rgb(var(--ink))]' : 'text-mute font-semibold'}`}
          >
            <Icon className="w-5 h-5" strokeWidth={on ? 2.4 : 1.8} />
            {label}
          </button>
        );
      })}
    </nav>
  );
};

/* Sheet listing every section plus the daily drivers */
const MenuSheet: React.FC<Props & { onClose: () => void }> = ({ tab, onTab, onDriver, onClose }) => {
  const counts = useCounts();
  const drivers = useDrivers();
  useEffect(() => onBack(() => { onClose(); return true; }), [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="All sections">
      <button className="absolute inset-0 bg-scrim/40" aria-label="Close" onClick={onClose} />
      <div className="relative bg-paper border-t-2 border-ink max-h-[85vh] overflow-y-auto pb-safe pl-safe pr-safe">
        <div className="flex items-center justify-between px-5 h-14 border-b border-rule">
          <b className="text-[17px]">CoffeeWorks</b>
          <button onClick={onClose} className="w-12 h-12 -mr-3 flex items-center justify-center" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { onTab(n.id); onClose(); }}
              className={`flex items-center justify-between px-5 min-h-[52px] border-b border-rule text-[15px] text-left odd:border-r ${tab === n.id ? 'bg-ink text-paper font-bold' : 'font-medium'}`}
            >
              {n.label}
              {counts[n.id] !== undefined && <span className="text-[11px] opacity-60">{counts[n.id]}</span>}
            </button>
          ))}
        </div>
        <div className="label-caps px-5 pt-4 pb-2">Daily drivers</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 border-t border-rule">
          {drivers.map((c) => (
            <button key={c} onClick={() => { onDriver(c); onClose(); }} className="min-h-[56px] flex flex-col items-center justify-center gap-1.5 text-[12px] font-bold border-b border-r border-rule">
              <i className={`block w-4 h-4 ${MODES[c].bg}`} aria-hidden />
              {MODES[c].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AppShell: React.FC<Props> = (props) => {
  const { mode } = useLayout();
  const [menu, setMenu] = useState(false);
  const close = React.useCallback(() => setMenu(false), []);

  if (mode === 'simple') {
    return (
      <div className="h-[100dvh] flex flex-col bg-paper text-ink">
        <main className="flex-1 min-h-0 overflow-y-auto pt-safe pl-safe pr-safe">{props.children}</main>
        <BottomTabs tab={props.tab} onTab={props.onTab} onMore={() => setMenu(true)} />
        {menu && <MenuSheet {...props} onClose={close} />}
      </div>
    );
  }
  return (
    <div className="h-[100dvh] flex bg-paper text-ink">
      {mode === 'full' ? <Rail {...props} /> : <SlimRail {...props} onMenu={() => setMenu(true)} />}
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto pt-safe pr-safe pb-safe">{props.children}</main>
      {menu && <MenuSheet {...props} onClose={close} />}
    </div>
  );
};

