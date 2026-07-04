import { scenes } from "../data/scenes";
import type { AbilityImpact, GameSave } from "../types";

export const storageKey = "shenzhen-cowhorse-save-v1";

export const emptyImpact: AbilityImpact = {
  communication: 0,
  collaboration: 0,
  judgment: 0,
  resilience: 0,
  learning: 0,
};

export const initialSave: GameSave = {
  phase: "home",
  profile: null,
  currentSceneIndex: 0,
  selectedSceneId: null,
  choices: {},
  variants: {},
  completedSceneIds: [],
};

export const loadSave = (): GameSave => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return initialSave;
    return { ...initialSave, ...JSON.parse(raw) };
  } catch {
    return initialSave;
  }
};

export const persistSave = (save: GameSave) => {
  localStorage.setItem(storageKey, JSON.stringify(save));
};

export const resetSave = () => {
  localStorage.removeItem(storageKey);
};

export const pickVariantId = (sceneId: string) => {
  const scene = scenes.find((item) => item.id === sceneId);
  if (!scene) return "";
  return scene.variants[Math.floor(Math.random() * scene.variants.length)].id;
};

export const getAbilityTotals = (choices: Record<string, string>): AbilityImpact => {
  return scenes.reduce<AbilityImpact>((totals, scene) => {
    const choiceId = choices[scene.id];
    const choice = scene.choices.find((item) => item.id === choiceId);
    if (!choice) return totals;
    return {
      communication: totals.communication + choice.impact.communication,
      collaboration: totals.collaboration + choice.impact.collaboration,
      judgment: totals.judgment + choice.impact.judgment,
      resilience: totals.resilience + choice.impact.resilience,
      learning: totals.learning + choice.impact.learning,
    };
  }, emptyImpact);
};

export const getRadarScores = (choices: Record<string, string>): AbilityImpact => {
  const totals = getAbilityTotals(choices);
  const score = (value: number) => Math.max(28, Math.min(96, 48 + value * 8));
  return {
    communication: score(totals.communication),
    collaboration: score(totals.collaboration),
    judgment: score(totals.judgment),
    resilience: score(totals.resilience),
    learning: score(totals.learning),
  };
};
