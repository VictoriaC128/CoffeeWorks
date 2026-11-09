import React, { useState } from 'react';
import { CoffeeProvider, useCoffee } from './context/CoffeeContext';
import { Navbar, NavTab } from './components/Navbar';
import { RecipeVault } from './components/RecipeVault';
import { DrinkLab } from './components/DrinkLab';
import { LiveBrewStopwatch } from './components/LiveBrewStopwatch';
import { KopiCalculator } from './components/KopiCalculator';
import { BeanCellar } from './components/BeanCellar';
import { GearLocker } from './components/GearLocker';
import { WaterLab } from './components/WaterLab';
import { DialInHistory } from './components/DialInHistory';
import { OnboardingModal } from './components/OnboardingModal';
import { Recipe, CoffeeCategory } from './types/coffee';

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('recipes');
  const { setSelectedRecipeForBrew, userPreferences, recipes } = useCoffee();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(
    !userPreferences.hasCompletedOnboarding
  );

  const handleLaunchBrew = (recipe: Recipe) => {
    setSelectedRecipeForBrew(recipe);
    setCurrentTab('brew');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchBrewFromDrink = (category: CoffeeCategory, dose: number, yieldGrams: number, title: string) => {
    const match = recipes.find(r => r.category === category) || recipes[0];
    if (match) {
      setSelectedRecipeForBrew({
        ...match,
        title: `${title} Base (${yieldGrams}g yield)`,
        doseGrams: dose,
        yieldGrams: yieldGrams,
      });
    }
    setCurrentTab('brew');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSetup={() => setIsOnboardingOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'recipes' && <RecipeVault onLaunchBrew={handleLaunchBrew} />}
        {currentTab === 'drinks' && <DrinkLab onLaunchBrew={handleLaunchBrewFromDrink} />}
        {currentTab === 'brew' && <LiveBrewStopwatch />}
        {currentTab === 'kopi' && <KopiCalculator />}
        {currentTab === 'beans' && <BeanCellar />}
        {currentTab === 'gear' && <GearLocker />}
        {currentTab === 'water' && <WaterLab />}
        {currentTab === 'history' && <DialInHistory />}
      </main>

      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-400 font-mono">
        <p>CoffeeWorks © 2026 • Precision Coffee Dial-in & Recipe Vault</p>
        <p className="text-[11px] text-stone-400 mt-1">
          Engineered for Benchtop Espresso, Orea/UFO Filter, Levers, 9Barista & Singapore Heritage Kopi
        </p>
      </footer>

      {/* First-Time User Experience & Daily Driver Setup Wizard */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <CoffeeProvider>
      <MainContent />
    </CoffeeProvider>
  );
}

export default App;
