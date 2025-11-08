import { CharacterData, Spell, Item, AbilityScores, Skills } from '@/types/character';

/**
 * Parses Foundry VTT character JSON data into a standardized format
 */
export function parseCharacterData(rawData: any): CharacterData {
  const character: CharacterData = {
    ...rawData,
  };

  // Extract basic info
  character.name = extractName(rawData);
  character.level = extractLevel(rawData);
  character.race = extractRace(rawData);
  character.class = extractClass(rawData);
  character.background = extractBackground(rawData);
  character.alignment = extractAlignment(rawData);

  // Extract HP
  character.hp = extractHP(rawData);

  // Extract AC
  character.ac = extractAC(rawData);

  // Extract Speed
  character.speed = extractSpeed(rawData);

  // Extract Ability Scores
  character.abilityScores = extractAbilityScores(rawData);

  // Extract Skills
  character.skills = extractSkills(rawData);

  // Extract Spells
  character.spells = extractSpells(rawData);

  // Extract Spell Slots
  character.spellSlots = extractSpellSlots(rawData);

  // Extract Items
  character.items = extractItems(rawData);

  // Extract Containers (for mapping container IDs to names)
  character.containers = extractContainers(rawData);

  // Extract Proficiencies
  character.proficiencies = extractProficiencies(rawData);

  // Extract Features and Traits
  character.features = extractFeatures(rawData);
  character.traits = extractTraits(rawData);

  return character;
}

function extractName(data: any): string {
  return data.name || '';
}

function extractLevel(data: any): number {
  // Calculate level from XP (D&D 5e XP thresholds)
  const xp = data.system?.details?.xp?.value || 0;
  if (xp >= 355000) return 20;
  if (xp >= 305000) return 19;
  if (xp >= 265000) return 18;
  if (xp >= 225000) return 17;
  if (xp >= 195000) return 16;
  if (xp >= 165000) return 15;
  if (xp >= 140000) return 14;
  if (xp >= 120000) return 13;
  if (xp >= 100000) return 12;
  if (xp >= 85000) return 11;
  if (xp >= 64000) return 10;
  if (xp >= 48000) return 9;
  if (xp >= 34000) return 8;
  if (xp >= 23000) return 7;
  if (xp >= 14000) return 6;
  if (xp >= 6500) return 5;
  if (xp >= 2700) return 4;
  if (xp >= 900) return 3;
  if (xp >= 300) return 2;
  return 1;
}

function extractRace(data: any): string {
  // Race is stored as an ID, try to find the race item
  const raceId = data.system?.details?.race;
  if (raceId && data.items) {
    const raceItem = data.items.find((item: any) => item._id === raceId || item.type === 'race');
    if (raceItem) return raceItem.name || '';
  }
  return '';
}

function extractClass(data: any): string {
  // Class is stored as an ID, try to find the class item
  const classId = data.system?.details?.originalClass;
  if (classId && data.items) {
    const classItem = data.items.find((item: any) => item._id === classId || item.type === 'class');
    if (classItem) return classItem.name || '';
  }
  return '';
}

function extractBackground(data: any): string {
  // Background is stored as an ID, try to find the background item
  const bgId = data.system?.details?.background;
  if (bgId && data.items) {
    const bgItem = data.items.find((item: any) => item._id === bgId || item.type === 'background');
    if (bgItem) return bgItem.name || '';
  }
  return '';
}

function extractAlignment(data: any): string {
  return data.system?.details?.alignment || '';
}

function extractHP(data: any): { value: number; max: number; temp?: number } | undefined {
  const hp = data.system?.attributes?.hp;
  
  if (!hp) return undefined;

  return {
    value: hp.value ?? 0,
    max: hp.max ?? hp.value ?? 0,
    temp: hp.temp ?? 0,
  };
}

function extractAC(data: any): number | undefined {
  return data.system?.attributes?.ac?.flat ?? undefined;
}

function extractSpeed(data: any): number | undefined {
  return data.system?.attributes?.movement?.walk ?? undefined;
}

function extractAbilityScores(data: any): AbilityScores | undefined {
  const abilities = data.system?.abilities;

  if (!abilities) return undefined;

  const scores: AbilityScores = {};
  const abilityNames: Array<keyof AbilityScores> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

  abilityNames.forEach(ability => {
    const abilityData = abilities[ability];
    if (abilityData) {
      const value = abilityData.value ?? 10;
      scores[ability] = {
        value: value,
        mod: calculateModifier(value),
        proficient: abilityData.proficient === 1,
      };
    }
  });

  return Object.keys(scores).length > 0 ? scores : undefined;
}

function extractSkills(data: any): Skills | undefined {
  const skills = data.system?.skills;

  if (!skills) return undefined;

  const skillMap: { [key: string]: string } = {
    'acr': 'Acrobatics',
    'ani': 'Animal Handling',
    'arc': 'Arcana',
    'ath': 'Athletics',
    'dec': 'Deception',
    'his': 'History',
    'ins': 'Insight',
    'itm': 'Intimidation',
    'inv': 'Investigation',
    'med': 'Medicine',
    'nat': 'Nature',
    'prc': 'Perception',
    'prf': 'Performance',
    'per': 'Persuasion',
    'rel': 'Religion',
    'slt': 'Sleight of Hand',
    'ste': 'Stealth',
    'sur': 'Survival'
  };

  const skillsObj: Skills = {};
  const abilityScores = extractAbilityScores(data);

  Object.keys(skillMap).forEach(skillKey => {
    const skillData = skills[skillKey];
    if (skillData) {
      const ability = skillData.ability || '';
      const abilityMod = abilityScores?.[ability as keyof AbilityScores]?.mod || 0;
      const proficiencyBonus = Math.floor((extractLevel(data) - 1) / 4) + 2;
      const proficient = skillData.value === 1;
      const expertise = skillData.value === 2;
      
      let total = abilityMod;
      if (proficient) total += proficiencyBonus;
      if (expertise) total += proficiencyBonus; // Expertise doubles proficiency

      skillsObj[skillKey] = {
        value: total,
        ability: ability,
        proficient: proficient,
        expertise: expertise,
        bonus: skillData.bonuses?.check ? parseInt(skillData.bonuses.check) || 0 : 0,
      };
    }
  });

  return Object.keys(skillsObj).length > 0 ? skillsObj : undefined;
}

function extractSpells(data: any): Spell[] {
  const spells: Spell[] = [];
  
  // Spells are in the items array with type "spell"
  const items = data.items || [];
  const spellItems = items.filter((item: any) => item.type === 'spell');

  spellItems.forEach((spell: any) => {
    const system = spell.system || {};
    const description = system.description?.value || '';
    
    spells.push({
      name: spell.name || '',
      level: system.level ?? 0,
      school: typeof system.school === 'string' ? system.school : system.school?.value || '',
      prepared: system.preparation?.prepared ?? false,
      ritual: system.components?.ritual ?? false,
      description: description,
      components: {
        verbal: system.components?.vocal ?? false,
        somatic: system.components?.somatic ?? false,
        material: system.components?.material ?? false,
        materials: system.components?.materials?.value || '',
      },
      range: system.range?.value || '',
      duration: system.duration?.value || '',
      castingTime: system.time?.value || '',
      concentration: system.duration?.concentration ?? false,
    });
  });

  return spells;
}

function extractSpellSlots(data: any): Array<{ level: number; value: number; max: number }> {
  const slots: Array<{ level: number; value: number; max: number }> = [];
  
  const spells = data.system?.spells || {};

  // Foundry VTT uses spell1, spell2, etc. for spell slots
  for (let i = 1; i <= 9; i++) {
    const spellSlot = spells[`spell${i}`];
    if (spellSlot && spellSlot.value !== null && spellSlot.value !== undefined) {
      slots.push({
        level: i,
        value: spellSlot.value,
        max: spellSlot.max ?? spellSlot.value,
      });
    }
  }

  return slots;
}

function extractItems(data: any): Item[] {
  const items: Item[] = [];
  
  const itemsData = data.items || [];

  if (Array.isArray(itemsData)) {
    itemsData.forEach((item: any) => {
      // Skip spells, races, classes, backgrounds, and feats - they're handled separately
      if (typeof item === 'object' && 
          item.type && 
          !['spell', 'race', 'class', 'background', 'feat'].includes(item.type)) {
        const system = item.system || {};
        items.push({
          name: item.name || '',
          type: item.type || 'misc',
          quantity: system.quantity ?? 1,
          weight: system.weight?.value,
          description: system.description?.value || '',
          equipped: system.equipped ?? false,
          attunement: system.attunement === 'required' || system.attuned === true,
          rarity: system.rarity || '',
          properties: system.properties?.value || [],
          containerId: system.container || null,
        });
      }
    });
  }

  return items;
}

function extractProficiencies(data: any): any {
  const traits = data.system?.traits || {};

  return {
    armor: traits.armorProf?.value || [],
    weapons: traits.weaponProf?.value || [],
    tools: [], // Tools are stored separately in system.tools
    languages: traits.languages?.value || [],
    savingThrows: Object.keys(data.system?.abilities || {})
      .filter((ability: string) => data.system.abilities[ability].proficient === 1)
      .map((ability: string) => ability.toUpperCase()),
  };
}

function extractFeatures(data: any): Array<{ name: string; description: string }> {
  const features: Array<{ name: string; description: string }> = [];
  
  const items = data.items || [];
  const featItems = items.filter((item: any) => item.type === 'feat');

  featItems.forEach((feat: any) => {
    const system = feat.system || {};
    features.push({
      name: feat.name || '',
      description: system.description?.value || '',
    });
  });

  return features;
}

function extractTraits(data: any): Array<{ name: string; description: string }> {
  // Traits are typically race features, which are already in features
  // This can be expanded if needed
  return [];
}

function extractContainers(data: any): Array<{ id: string; name: string }> {
  const containers: Array<{ id: string; name: string }> = [];
  
  const itemsData = data.items || [];

  if (Array.isArray(itemsData)) {
    itemsData.forEach((item: any) => {
      if (typeof item === 'object' && item.type === 'container' && item._id) {
        containers.push({
          id: item._id,
          name: item.name || 'Unnamed Container',
        });
      }
    });
  }

  return containers;
}

function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

