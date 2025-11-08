'use client';

import { CharacterData } from '@/types/character';

export default function StatsTab({ character }: { character: CharacterData }) {
  const abilityNames: { [key: string]: string } = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
  };

  const skillNames: { [key: string]: string } = {
    acr: 'Acrobatics',
    ani: 'Animal Handling',
    arc: 'Arcana',
    ath: 'Athletics',
    dec: 'Deception',
    his: 'History',
    ins: 'Insight',
    itm: 'Intimidation',
    inv: 'Investigation',
    med: 'Medicine',
    nat: 'Nature',
    prc: 'Perception',
    prf: 'Performance',
    per: 'Persuasion',
    rel: 'Religion',
    slt: 'Sleight of Hand',
    ste: 'Stealth',
    sur: 'Survival',
  };

  return (
    <div className="space-y-6">
      {/* Ability Scores */}
      {character.abilityScores && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-black dark:text-zinc-50">Ability Scores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(character.abilityScores).map(([key, score]) => (
              <div
                key={key}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 text-center"
              >
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  {abilityNames[key] || key.toUpperCase()}
                </div>
                <div className="text-2xl font-bold text-black dark:text-zinc-50 mb-1">
                  {score.value}
                </div>
                <div className="text-lg text-zinc-700 dark:text-zinc-300">
                  {score.mod !== undefined && (score.mod >= 0 ? '+' : '')}
                  {score.mod}
                </div>
                {score.proficient && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Proficient</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {character.skills && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-black dark:text-zinc-50">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(character.skills).map(([key, skill]) => (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded ${
                  skill.proficient || skill.expertise
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-zinc-50 dark:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-black dark:text-zinc-50">
                    {skillNames[key] || key}
                  </span>
                  {skill.expertise && (
                    <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                      E
                    </span>
                  )}
                  {skill.proficient && !skill.expertise && (
                    <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                      P
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-black dark:text-zinc-50">
                  {skill.value !== undefined && (skill.value >= 0 ? '+' : '')}
                  {skill.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spell Slots */}
      {character.spellSlots && character.spellSlots.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-black dark:text-zinc-50">Spell Slots</h2>
          <div className="flex flex-wrap gap-4">
            {character.spellSlots.map((slot) => (
              <div
                key={slot.level}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 text-center min-w-[80px]"
              >
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Level {slot.level}</div>
                <div className="text-xl font-bold text-black dark:text-zinc-50">
                  {slot.value} / {slot.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

