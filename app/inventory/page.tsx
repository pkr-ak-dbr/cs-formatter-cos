'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCharacters, StoredCharacter } from '@/lib/characterStorage';
import { Item } from '@/types/character';

export default function PartyInventory() {
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [expandedCharacters, setExpandedCharacters] = useState<Set<string>>(new Set());
  const [expandedContainers, setExpandedContainers] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEquipped, setFilterEquipped] = useState<'all' | 'equipped' | 'unequipped'>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      const chars = await getAllCharacters();
      setCharacters(chars);
      // Expand all characters by default
      setExpandedCharacters(new Set(chars.map(c => c.id)));
    };
    loadCharacters();
  }, []);

  // Get all unique item types across all characters
  const allItemTypes = Array.from(
    new Set(
      characters.flatMap(char => 
        (char.data.items || [])
          .filter(item => item.type !== 'container')
          .map(item => item.type)
      )
    )
  ).sort();

  // Filter and group items for each character
  const getCharacterInventory = (character: StoredCharacter) => {
    const items = character.data.items || [];
    const containers = character.data.containers || [];
    const containerMap = new Map(containers.map(c => [c.id, c.name]));

    // Filter items
    const filteredItems = items.filter((item) => {
      if (item.type === 'container') return false;
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (filterEquipped === 'equipped' && !item.equipped) return false;
      if (filterEquipped === 'unequipped' && item.equipped) return false;
      return true;
    });

    // Group by container
    const itemsByContainer = filteredItems.reduce((acc, item) => {
      const containerId = item.containerId || 'no-container';
      if (!acc[containerId]) acc[containerId] = [];
      acc[containerId].push(item);
      return acc;
    }, {} as { [key: string]: Item[] });

    return { itemsByContainer, containerMap };
  };

  const toggleCharacter = (characterId: string) => {
    const newExpanded = new Set(expandedCharacters);
    if (newExpanded.has(characterId)) {
      newExpanded.delete(characterId);
    } else {
      newExpanded.add(characterId);
    }
    setExpandedCharacters(newExpanded);
  };

  const toggleContainer = (characterId: string, containerId: string) => {
    const key = `${characterId}-${containerId}`;
    const newExpanded = new Set(expandedContainers);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedContainers(newExpanded);
  };

  const getContainerName = (containerId: string, containerMap: Map<string, string>) => {
    if (containerId === 'no-container') return 'No Container';
    return containerMap.get(containerId) || 'Unknown Container';
  };

  const getTotalItems = () => {
    return characters.reduce((total, char) => {
      const { itemsByContainer } = getCharacterInventory(char);
      return total + Object.values(itemsByContainer).flat().length;
    }, 0);
  };

  const getTotalWeight = () => {
    return characters.reduce((total, char) => {
      const { itemsByContainer } = getCharacterInventory(char);
      const items = Object.values(itemsByContainer).flat();
      return total + items.reduce((sum, item) => {
        const weight = item.weight || 0;
        const quantity = item.quantity || 1;
        return sum + (weight * quantity);
      }, 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
                Party Inventory
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                View all items across your party
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-medium transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
              >
                Party List
              </Link>
              <Link
                href="/upload"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                + Add Character
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Characters</div>
            <div className="text-2xl font-bold text-black dark:text-zinc-50">
              {characters.length}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Items</div>
            <div className="text-2xl font-bold text-black dark:text-zinc-50">
              {getTotalItems()}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Weight</div>
            <div className="text-2xl font-bold text-black dark:text-zinc-50">
              {getTotalWeight().toFixed(1)} lbs
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            >
              <option value="all">All Types</option>
              {allItemTypes.map((type) => (
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
        </div>

        {/* Characters Inventory */}
        {characters.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
              No characters found
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Upload characters to see their inventory
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Upload Character
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {characters.map((character) => {
              const { itemsByContainer, containerMap } = getCharacterInventory(character);
              const isExpanded = expandedCharacters.has(character.id);
              const sortedContainerIds = Object.keys(itemsByContainer).sort((a, b) => {
                if (a === 'no-container') return -1;
                if (b === 'no-container') return 1;
                const nameA = getContainerName(a, containerMap);
                const nameB = getContainerName(b, containerMap);
                return nameA.localeCompare(nameB);
              });
              const totalItems = Object.values(itemsByContainer).flat().length;

              return (
                <div
                  key={character.id}
                  className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
                >
                  {/* Character Header */}
                  <button
                    onClick={() => toggleCharacter(character.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
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
                      <div>
                        <h2 className="text-xl font-bold text-black dark:text-zinc-50">
                          {character.name}
                        </h2>
                        <div className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                          {character.data.level && <span>Level {character.data.level}</span>}
                          {character.data.race && <span>{character.data.race}</span>}
                          {character.data.class && <span>{character.data.class}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </span>
                      <Link
                        href={`/character/${character.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        View Sheet →
                      </Link>
                    </div>
                  </button>

                  {/* Character Inventory */}
                  {isExpanded && (
                    <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                      {sortedContainerIds.length === 0 ? (
                        <div className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                          No items found matching the filters.
                        </div>
                      ) : (
                        <div className="p-4 space-y-2">
                          {sortedContainerIds.map((containerId) => {
                            const containerItems = itemsByContainer[containerId];
                            const containerKey = `${character.id}-${containerId}`;
                            const isContainerExpanded = expandedContainers.has(containerKey);
                            const containerName = getContainerName(containerId, containerMap);

                            return (
                              <div
                                key={containerId}
                                className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900"
                              >
                                {/* Container Header */}
                                <button
                                  onClick={() => toggleContainer(character.id, containerId)}
                                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <svg
                                      className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform ${
                                        isContainerExpanded ? 'rotate-90' : ''
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
                                    <span className="font-semibold text-black dark:text-zinc-50">
                                      {containerName}
                                    </span>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                      ({containerItems.length} {containerItems.length === 1 ? 'item' : 'items'})
                                    </span>
                                  </div>
                                </button>

                                {/* Items List */}
                                {isContainerExpanded && (
                                  <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                    {containerItems.map((item, index) => {
                                      const itemId = `${character.id}-${containerId}-${index}`;
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
                                            className="w-full px-6 py-3 text-left flex items-start justify-between gap-4"
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
                                                  {item.quantity && item.quantity > 1 && (
                                                    <span className="ml-1">
                                                      ({(item.weight * item.quantity).toFixed(1)} lbs total)
                                                    </span>
                                                  )}
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
                                            <div className="px-6 pb-4 pt-2 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

