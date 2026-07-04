export type Gender = "male" | "female";

export type AbilityKey =
  | "communication"
  | "collaboration"
  | "judgment"
  | "resilience"
  | "learning";

export type AbilityImpact = Record<AbilityKey, number>;

export interface Choice {
  id: string;
  text: string;
  result: string;
  mentor: string;
  impact: AbilityImpact;
}

export interface PersonalityVariant {
  id: string;
  label: string;
  note: string;
}

export interface SceneNpc {
  id: string;
  name: string;
  image: string;
  kind: "boss" | "hr" | "coworker";
  x: number;
  y: number;
  scale?: number;
}

export interface Scene {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  background: string;
  mapX: number;
  npcs: SceneNpc[];
  description: string;
  mentorBefore: string;
  transition: string;
  variants: PersonalityVariant[];
  choices: Choice[];
}

export interface PlayerProfile {
  name: string;
  gender: Gender;
}

export interface GameSave {
  phase: "home" | "profile" | "prologue" | "map" | "scene" | "summary";
  profile: PlayerProfile | null;
  currentSceneIndex: number;
  selectedSceneId: string | null;
  choices: Record<string, string>;
  variants: Record<string, string>;
  completedSceneIds: string[];
}
