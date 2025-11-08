// Foundry VTT Character Data Types

export interface AbilityScore {
  value: number;
  mod?: number;
  proficient?: boolean;
}

export interface AbilityScores {
  str?: AbilityScore;
  dex?: AbilityScore;
  con?: AbilityScore;
  int?: AbilityScore;
  wis?: AbilityScore;
  cha?: AbilityScore;
}

export interface Skill {
  value: number;
  ability?: string;
  proficient?: boolean;
  expertise?: boolean;
  bonus?: number;
}

export interface Skills {
  [key: string]: Skill;
}

export interface Spell {
  name: string;
  level: number;
  school?: string;
  prepared?: boolean;
  ritual?: boolean;
  description?: string;
  components?: {
    verbal?: boolean;
    somatic?: boolean;
    material?: boolean;
    materials?: string;
  };
  range?: string;
  duration?: string;
  castingTime?: string;
  concentration?: boolean;
}

export interface Item {
  name: string;
  type: string;
  quantity?: number;
  weight?: number;
  description?: string;
  equipped?: boolean;
  attunement?: boolean;
  rarity?: string;
  properties?: string[];
  containerId?: string | null;
}

export interface SpellSlot {
  level: number;
  value: number;
  max: number;
}

export interface CharacterData {
  name?: string;
  level?: number;
  race?: string;
  class?: string;
  background?: string;
  alignment?: string;
  hp?: {
    value: number;
    max: number;
    temp?: number;
  };
  ac?: number;
  speed?: number;
  abilityScores?: AbilityScores;
  skills?: Skills;
  spells?: Spell[];
  spellSlots?: SpellSlot[];
  items?: Item[];
  proficiencies?: {
    armor?: string[];
    weapons?: string[];
    tools?: string[];
    languages?: string[];
    savingThrows?: string[];
  };
  features?: Array<{
    name: string;
    description: string;
  }>;
  traits?: Array<{
    name: string;
    description: string;
  }>;
  containers?: Array<{
    id: string;
    name: string;
  }>;
  // Raw data for flexible parsing
  [key: string]: any;
}

