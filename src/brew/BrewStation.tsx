import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { useLayout } from '../shell/LayoutContext';
import { onBack } from '../platform/native';
import { BrewModel, BrewSetup, scaleSteps, setupFrom } from './model';
import { lotFor, methodLabel, modeFor } from './modes';
import { stepsFor } from './steps';
import { useBrewTimer, StepTime } from './useBrewTimer';
import { RunningView } from './RunningView';
import { PrepView } from './PrepView';
import { StepEditor, SaveTarget } from './StepEditor';
import { TasteView } from './TasteView';
import { ChangeSheet, RecipePicker } from './Sheets';
import { BrewStep, Recipe } from '../types/coffee';
import { Btn } from './ui';

type Phase = 'brew' | 'prep' | 'steps' | 'taste';
export type BrewState = 'ready' | 'running' | 'tasting';

/**
 * The Live Brew Station. Stays mounted while other tabs are open so a running
 * brew keeps its time; `visible` only hides it.
 */
export const BrewStation: React.FC<{ visible: boolean; onState: (s: BrewState) => void; onGoTo: (tab: 'recipes') => void }> = ({ visible, onState, onGoTo }) => {
  const { recipes, selectedRecipeForBrew, setSelectedRecipeForBrew, beans, gearProfiles, waterProfiles, sessions, addRecipe, updateRecipe, customMethods } = useCoffee();
  const { mode: layout } = useLayout();

  // Prefer the live copy from the vault (picks up edits); keep ad-hoc variants (Drink Lab) as given.
  const recipe: Recipe | undefined = useMemo(() => {
    const sel = selectedRecipeForBrew;
    if (!sel) return recipes[0];
    const live = recipes.find((r) => r.id === sel.id);
    return live && live.title === sel.title && live.doseGrams === sel.doseGrams ? live : sel;
  }, [recipes, selectedRecipeForBrew]);

  const gear = gearProfiles.find((g) => g.id === recipe?.gearId);
  const method = customMethods.find((x) => x.id === recipe?.methodId);
  const [setup, setSetupState] = useState<BrewSetup | null>(() => (recipe ? setupFrom(recipe, gear) : null));
  const [resetToken, setResetToken] = useState(0);
  useEffect(() => { if (recipe) setSetupState(setupFrom(recipe, gearProfiles.find((g) => g.id === recipe.gearId))); }, [recipe?.id, resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const setSetup = useCallback((fn: (s: BrewSetup) => BrewSetup) => setSetupState((s) => (s ? fn(s) : s)), []);

  const [phase, setPhase] = useState<Phase>('brew');
  const [overlay, setOverlay] = useState<null | 'change' | 'picker'>(null);
  const [finished, setFinished] = useState<{ stepTimes: StepTime[]; totalSec: number } | null>(null);

  const baseSteps: BrewStep[] = recipe ? setup?.stepsOverride ?? stepsFor(recipe, method) : [];
  const steps = recipe && setup ? scaleSteps(baseSteps, setup.water / (recipe.yieldGrams || setup.water || 1)) : baseSteps;
  const timer = useBrewTimer(steps);

  const history = useMemo(() => (recipe ? sessions.filter((s) => s.recipeId === recipe.id) : []), [sessions, recipe]);

  useEffect(() => {
    onState(phase === 'taste' ? 'tasting' : timer.started ? 'running' : 'ready');
  }, [phase, timer.started, onState]);

  // Android back: leave sub-screens first; a running brew is never dropped by Back.
  useEffect(() => {
    if (!visible) return;
    return onBack(() => {
      if (overlay) { setOverlay(null); return true; }
      if (phase === 'prep' || phase === 'steps') { setPhase('brew'); return true; }
      return false;
    });
  }, [visible, phase, overlay]);

  if (!recipe || !setup) {
    return (
      <div className={visible ? 'p-8 max-w-lg' : 'hidden'}>
        <h1 className="text-[28px] font-extrabold">No recipe to brew yet</h1>
        <p className="text-mute mt-2 text-[15px]">Add a recipe in Recipes, then come back here to run it.</p>
        <Btn variant="primary" className="mt-5" onClick={() => onGoTo('recipes')}>Open Recipes</Btn>
      </div>
    );
  }

  const mode = modeFor(recipe.category, method);
  const m: BrewModel = {
    recipe,
    lot: lotFor(recipe, recipes),
    mode,
    method,
    methodName: methodLabel(recipe.category, method),
    steps,
    setup,
    setSetup,
    bean: beans.find((b) => b.id === setup.beanId),
    gear,
    water: waterProfiles.find((w) => w.id === setup.waterProfileId),
    timer,
    history,
    brewNumber: history.length + 1,
    open: (v) => (v === 'change' || v === 'picker' ? setOverlay(v) : setPhase(v)),
    finish: () => {
      const stepTimes = timer.finish();
      setFinished({ stepTimes, totalSec: timer.elapsedSec });
      setPhase('taste');
    },
  };

  const saveSteps = (list: BrewStep[], target: SaveTarget) => {
    if (target === 'once') setSetup((s) => ({ ...s, stepsOverride: list }));
    else if (target === 'update') {
      updateRecipe(recipe.id, { customSteps: list });
      setSetup((s) => ({ ...s, stepsOverride: undefined }));
    } else {
      const { id, createdAt, updatedAt, ...rest } = recipe;
      const mine = addRecipe({ ...rest, title: `${recipe.title}, my version`, customSteps: list, baseRecipeId: recipe.baseRecipeId || id, isDefault: false });
      setSelectedRecipeForBrew(mine);
    }
    setPhase('brew');
  };

  const side = layout !== 'simple';

  return (
    <div className={visible ? 'h-full' : 'hidden'}>
      {phase === 'brew' && <RunningView m={m} layout={layout} />}
      {phase === 'prep' && <PrepView m={m} layout={layout} onBack={() => setPhase('brew')} onDone={() => { setPhase('brew'); if (!timer.started) timer.start(); }} />}
      {phase === 'steps' && <StepEditor m={m} layout={layout} onCancel={() => setPhase('brew')} onSave={saveSteps} />}
      {phase === 'taste' && finished && (
        <TasteView m={m} layout={layout} stepTimes={finished.stepTimes} totalSec={finished.totalSec}
          onDone={() => { timer.reset(); setFinished(null); setPhase('brew'); setResetToken((t) => t + 1); }} />
      )}
      {overlay === 'change' && <ChangeSheet m={m} side={side} onClose={() => setOverlay(null)} />}
      {overlay === 'picker' && <RecipePicker m={m} side={side} onPick={(r) => setSelectedRecipeForBrew(r)} onClose={() => setOverlay(null)} />}
    </div>
  );
};
