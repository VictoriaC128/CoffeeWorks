import React, { useCallback, useEffect, useState } from 'react';
import { CoffeeProvider, useCoffee } from './context/CoffeeContext';
import { SettingsProvider } from './settings/SettingsContext';
import { LayoutProvider } from './shell/LayoutContext';
import { AppShell, Tab } from './shell/AppShell';
import { BrewStation, BrewState } from './brew/BrewStation';
import { RecipeVault } from './components/RecipeVault';
import { DrinkLab } from './components/DrinkLab';
import { KopiCalculator } from './components/KopiCalculator';
import { BeanCellar } from './components/BeanCellar';
import { GearLocker } from './components/GearLocker';
import { WaterLab } from './components/WaterLab';
import { DialInHistory } from './components/DialInHistory';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsPage } from './components/SettingsPage';
import { Recipe, CoffeeCategory } from './types/coffee';
import { onBack } from './platform/native';

const MainContent: React.FC = () => {
  const [tab, setTab] = useState<Tab>('brew');
  const [brewState, setBrewState] = useState<BrewState>('ready');
  const { setSelectedRecipeForBrew, userPreferences, recipes } = useCoffee();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!userPreferences.hasCompletedOnboarding);

  const go = useCallback((t: Tab) => {
    setTab(t);
    document.querySelector('main')?.scrollTo({ top: 0 });
  }, []);

  // Android back: from any other section, go back to Brew before leaving the app.
  useEffect(() => onBack(() => {
    if (tab !== 'brew') { go('brew'); return true; }
    return false;
  }), [tab, go]);

  const handleLaunchBrew = (recipe: Recipe) => {
    setSelectedRecipeForBrew(recipe);
    go('brew');
  };

  const handleLaunchBrewFromDrink = (category: CoffeeCategory, dose: number, yieldGrams: number, title: string) => {
    const match = recipes.find((r) => r.category === category) || recipes[0];
    if (match) {
      setSelectedRecipeForBrew({ ...match, title: `${title} Base (${yieldGrams}g yield)`, doseGrams: dose, yieldGrams });
    }
    go('brew');
  };

  const handleDriver = (c: CoffeeCategory) => {
    if (brewState !== 'running') {
      const id = userPreferences.defaultRecipePerCategory[c];
      const r = recipes.find((x) => x.id === id) || recipes.find((x) => x.category === c);
      if (r) setSelectedRecipeForBrew(r);
    }
    go('brew');
  };

  const onState = useCallback((s: BrewState) => setBrewState(s), []);

  return (
    <AppShell tab={tab} onTab={go} onDriver={handleDriver} brewState={brewState}>
      <BrewStation visible={tab === 'brew'} onState={onState} onGoTo={go} />
      {tab !== 'brew' && (
        <div className="pb-safe">
          {tab === 'recipes' && <RecipeVault onLaunchBrew={handleLaunchBrew} onOpenSetup={() => setIsOnboardingOpen(true)} />}
          {tab === 'drinks' && <DrinkLab onLaunchBrew={handleLaunchBrewFromDrink} />}
          {tab === 'kopi' && <KopiCalculator />}
          {tab === 'beans' && <BeanCellar />}
          {tab === 'gear' && <GearLocker />}
          {tab === 'water' && <WaterLab />}
          {tab === 'history' && <DialInHistory />}
          {tab === 'settings' && <SettingsPage onOpenSetup={() => setIsOnboardingOpen(true)} />}
        </div>
      )}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </AppShell>
  );
};

export function App() {
  return (
    <SettingsProvider>
      <CoffeeProvider>
        <LayoutProvider>
          <MainContent />
        </LayoutProvider>
      </CoffeeProvider>
    </SettingsProvider>
  );
}

export default App;
