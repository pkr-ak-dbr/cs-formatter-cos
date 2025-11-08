'use client';

import { useState, useEffect } from 'react';
import { CharacterData } from '@/types/character';

export default function SpellsTab({ character }: { character: CharacterData }) {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set());
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [filterPrepared, setFilterPrepared] = useState<'all' | 'prepared' | 'unprepared'>('all');

  const spells = character.spells || [];
  const filteredSpells = spells.filter((spell) => {
    if (filterLevel !== 'all' && spell.level !== filterLevel) return false;
    if (filterPrepared === 'prepared' && !spell.prepared) return false;
    if (filterPrepared === 'unprepared' && spell.prepared) return false;
    return true;
  });

  const spellsByLevel = filteredSpells.reduce((acc, spell) => {
    if (!acc[spell.level]) acc[spell.level] = [];
    acc[spell.level].push(spell);
    return acc;
  }, {} as { [key: number]: typeof spells });

  // Expand all levels by default
  useEffect(() => {
    const levels = Object.keys(spellsByLevel).map(Number);
    setExpandedLevels(new Set(levels));
  }, [spellsByLevel]);

  const toggleLevel = (level: number) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  const getSpellId = (level: number, index: number) => `${level}-${index}`;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
        >
          <option value="all">All Levels</option>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
        <select
          value={filterPrepared}
          onChange={(e) =>
            setFilterPrepared(e.target.value as 'all' | 'prepared' | 'unprepared')
          }
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
        >
          <option value="all">All Spells</option>
          <option value="prepared">Prepared Only</option>
          <option value="unprepared">Unprepared Only</option>
        </select>
      </div>

      {/* Spells Tree */}
      {Object.keys(spellsByLevel).length === 0 ? (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          No spells found matching the filters.
        </div>
      ) : (
        <div className="space-y-1">
          {Object.entries(spellsByLevel)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([levelStr, levelSpells]) => {
              const level = parseInt(levelStr);
              const isExpanded = expandedLevels.has(level);
              const levelLabel = level === 0 ? 'Cantrip' : `Level ${level}`;
              
              return (
                <div key={level} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                  {/* Level Header */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-5 h-5 text-zinc-600 dark:text-zinc-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="font-semibold text-lg text-black dark:text-zinc-50">
                        {levelLabel}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        ({levelSpells.length} {levelSpells.length === 1 ? 'spell' : 'spells'})
                      </span>
                    </div>
                  </button>

                  {/* Spells List (indented) */}
                  {isExpanded && (
                    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                      {levelSpells.map((spell, index) => {
                        const spellId = getSpellId(level, index);
                        const isSelected = selectedSpell === spellId;
                        
                        return (
                          <div
                            key={index}
                            className={`border-b border-zinc-200 dark:border-zinc-700 last:border-b-0 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-700/50'
                            } transition-colors`}
                          >
                            <button
                              onClick={() => setSelectedSpell(isSelected ? null : spellId)}
                              className="w-full px-8 py-3 text-left flex items-start justify-between gap-4"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-zinc-400 dark:text-zinc-500 mr-2">→</span>
                                  <h4 className="font-semibold text-black dark:text-zinc-50">
                                    {spell.name}
                                  </h4>
                                  {spell.prepared && (
                                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded whitespace-nowrap">
                                      Prepared
                                    </span>
                                  )}
                                  {spell.ritual && (
                                    <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded whitespace-nowrap">
                                      Ritual
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 ml-6">
                                  {spell.school && <span>{spell.school}</span>}
                                  {spell.range && <span> • {spell.range}</span>}
                                  {spell.castingTime && <span> • {spell.castingTime}</span>}
                                </div>
                              </div>
                              <svg
                                className={`w-5 h-5 text-zinc-400 dark:text-zinc-500 flex-shrink-0 transition-transform ${
                                  isSelected ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                            
                            {/* Spell Details */}
                            {isSelected && spell.description && (
                              <div className="px-8 pb-4 pt-2 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                                <div
                                  className="text-sm text-zinc-700 dark:text-zinc-300 prose prose-sm dark:prose-invert max-w-none ml-6"
                                  dangerouslySetInnerHTML={{ __html: spell.description }}
                                />
                                <div className="ml-6 mt-3 space-y-1">
                                  {spell.components && (
                                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                      <strong>Components:</strong>{' '}
                                      {[
                                        spell.components.verbal && 'V',
                                        spell.components.somatic && 'S',
                                        spell.components.material && 'M',
                                      ]
                                        .filter(Boolean)
                                        .join(', ')}
                                      {spell.components.materials && ` (${spell.components.materials})`}
                                    </div>
                                  )}
                                  {spell.duration && (
                                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                      <strong>Duration:</strong> {spell.duration}
                                      {spell.concentration && ' (Concentration)'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

