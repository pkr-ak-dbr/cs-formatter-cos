'use client';

import { useState, useEffect } from 'react';
import { CharacterData } from '@/types/character';

export default function ItemsTab({ character }: { character: CharacterData }) {
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

