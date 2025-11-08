'use client';

import { useState } from 'react';
import { CharacterData } from '@/types/character';
import StatsTab from './StatsTab';
import SpellsTab from './SpellsTab';
import ItemsTab from './ItemsTab';

interface CharacterViewerContentProps {
  character: CharacterData;
}

export default function CharacterViewerContent({ character }: CharacterViewerContentProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'spells' | 'items'>('stats');

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

