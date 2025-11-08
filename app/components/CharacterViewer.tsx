'use client';

import React, { useState, useEffect } from 'react';
import { CharacterData } from '@/types/character';
import { parseCharacterData } from '@/lib/characterParser';

export default function CharacterViewer() {
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'spells' | 'items'>('stats');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const parsedCharacter = parseCharacterData(jsonData);
        setCharacter(parsedCharacter);
        setError(null);
      } catch (err) {
        setError('Failed to parse JSON file. Please ensure it is a valid Foundry VTT character export.');
        setCharacter(null);
      }
    };
    reader.readAsText(file);
  };

  if (!character) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-zinc-50">
            D&D Character Viewer
          </h1>
          <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="space-y-4">
                <svg
                  className="mx-auto h-12 w-12 text-zinc-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                    Click to upload Foundry VTT character JSON
                  </span>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    Select a character export file from Foundry VTT
                  </p>
                </div>
              </div>
            </label>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                {character.name || 'Unnamed Character'}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {character.level && <span>Level {character.level}</span>}
                {character.race && <span>{character.race}</span>}
                {character.class && <span>{character.class}</span>}
                {character.background && <span>{character.background}</span>}
                {character.alignment && <span>{character.alignment}</span>}
              </div>
            </div>
            <button
              onClick={() => {
                setCharacter(null);
                setError(null);
              }}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Load New Character
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {character.hp && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">HP</div>
              <div className="text-2xl font-bold text-black dark:text-zinc-50">
                {character.hp.value}
                {character.hp.max > 0 && ` / ${character.hp.max}`}
                {character.hp.temp && character.hp.temp > 0 && ` (+${character.hp.temp} temp)`}
              </div>
            </div>
          )}
          {character.ac !== undefined && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">AC</div>
              <div className="text-2xl font-bold text-black dark:text-zinc-50">{character.ac}</div>
            </div>
          )}
          {character.speed !== undefined && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Speed</div>
              <div className="text-2xl font-bold text-black dark:text-zinc-50">{character.speed} ft</div>
            </div>
          )}
          {character.level && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Level</div>
              <div className="text-2xl font-bold text-black dark:text-zinc-50">{character.level}</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Stats & Abilities
              </button>
              <button
                onClick={() => setActiveTab('spells')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'spells'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Spells ({character.spells?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'items'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Items ({character.items?.length || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'stats' && <StatsTab character={character} />}
            {activeTab === 'spells' && <SpellsTab character={character} />}
            {activeTab === 'items' && <ItemsTab character={character} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsTab({ character }: { character: CharacterData }) {
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

function SpellsTab({ character }: { character: CharacterData }) {
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

function ItemsTab({ character }: { character: CharacterData }) {
  const [expandedContainers, setExpandedContainers] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEquipped, setFilterEquipped] = useState<'all' | 'equipped' | 'unequipped'>('all');

  const items = character.items || [];
  const containers = character.containers || [];
  
  // Create a map of container ID to container name
  const containerMap = new Map(containers.map(c => [c.id, c.name]));

  // Filter items (excluding containers themselves)
  const filteredItems = items.filter((item) => {
    if (item.type === 'container') return false; // Don't show containers in the list
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterEquipped === 'equipped' && !item.equipped) return false;
    if (filterEquipped === 'unequipped' && item.equipped) return false;
    return true;
  });

  // Group items by container
  const itemsByContainer = filteredItems.reduce((acc, item) => {
    const containerId = item.containerId || 'no-container';
    if (!acc[containerId]) acc[containerId] = [];
    acc[containerId].push(item);
    return acc;
  }, {} as { [key: string]: typeof filteredItems });

  // Expand all containers by default
  useEffect(() => {
    const containerIds = Object.keys(itemsByContainer);
    setExpandedContainers(new Set(containerIds));
  }, [itemsByContainer]);

  const toggleContainer = (containerId: string) => {
    const newExpanded = new Set(expandedContainers);
    if (newExpanded.has(containerId)) {
      newExpanded.delete(containerId);
    } else {
      newExpanded.add(containerId);
    }
    setExpandedContainers(newExpanded);
  };

  const getItemId = (containerId: string, index: number) => `${containerId}-${index}`;

  const getContainerName = (containerId: string) => {
    if (containerId === 'no-container') return 'No Container';
    return containerMap.get(containerId) || 'Unknown Container';
  };

  const itemTypes = Array.from(new Set(items.filter(item => item.type !== 'container').map((item) => item.type)));

  // Sort containers: "No Container" first, then alphabetically
  const sortedContainerIds = Object.keys(itemsByContainer).sort((a, b) => {
    if (a === 'no-container') return -1;
    if (b === 'no-container') return 1;
    const nameA = getContainerName(a);
    const nameB = getContainerName(b);
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
        >
          <option value="all">All Types</option>
          {itemTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterEquipped}
          onChange={(e) =>
            setFilterEquipped(e.target.value as 'all' | 'equipped' | 'unequipped')
          }
          className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
        >
          <option value="all">All Items</option>
          <option value="equipped">Equipped Only</option>
          <option value="unequipped">Unequipped Only</option>
        </select>
      </div>

      {/* Items Tree */}
      {sortedContainerIds.length === 0 ? (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          No items found matching the filters.
        </div>
      ) : (
        <div className="space-y-1">
          {sortedContainerIds.map((containerId) => {
            const containerItems = itemsByContainer[containerId];
            const isExpanded = expandedContainers.has(containerId);
            const containerName = getContainerName(containerId);
            
            return (
              <div key={containerId} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                {/* Container Header */}
                <button
                  onClick={() => toggleContainer(containerId)}
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
                      {containerName}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      ({containerItems.length} {containerItems.length === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                </button>

                {/* Items List (indented) */}
                {isExpanded && (
                  <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                    {containerItems.map((item, index) => {
                      const itemId = getItemId(containerId, index);
                      const isSelected = selectedItem === itemId;
                      
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
                            onClick={() => setSelectedItem(isSelected ? null : itemId)}
                            className="w-full px-8 py-3 text-left flex items-start justify-between gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-zinc-400 dark:text-zinc-500 mr-2">→</span>
                                <h4 className="font-semibold text-black dark:text-zinc-50">
                                  {item.name}
                                </h4>
                                {item.quantity && item.quantity > 1 && (
                                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    x{item.quantity}
                                  </span>
                                )}
                                <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded whitespace-nowrap">
                                  {item.type}
                                </span>
                                {item.equipped && (
                                  <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded whitespace-nowrap">
                                    Equipped
                                  </span>
                                )}
                                {item.attunement && (
                                  <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded whitespace-nowrap">
                                    Attuned
                                  </span>
                                )}
                                {item.rarity && (
                                  <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded whitespace-nowrap">
                                    {item.rarity}
                                  </span>
                                )}
                              </div>
                              {item.weight !== undefined && (
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 ml-6">
                                  Weight: {item.weight} lb{item.weight !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                            {item.description && (
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
                            )}
                          </button>
                          
                          {/* Item Details */}
                          {isSelected && item.description && (
                            <div className="px-8 pb-4 pt-2 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                              <div
                                className="text-sm text-zinc-700 dark:text-zinc-300 prose prose-sm dark:prose-invert max-w-none ml-6"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                              />
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

