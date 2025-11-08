'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCharacters, deleteCharacter, StoredCharacter } from '@/lib/characterStorage';

export default function PartyList() {
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      const chars = await getAllCharacters();
      setCharacters(chars);
    };
    loadCharacters();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCharacter(id);
    const chars = await getAllCharacters();
    setCharacters(chars);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
                D&D Party List
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Manage your party's character sheets
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/inventory"
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg font-medium transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700 text-center"
              >
                View Inventory
              </Link>
              <Link
                href="/upload"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center"
              >
                + Add Character
              </Link>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        {characters.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-zinc-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
              No characters yet
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Upload your first character to get started
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Upload Character
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link href={`/character/${character.id}`}>
                  <div className="p-6 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-black dark:text-zinc-50">
                        {character.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDeleteConfirm(character.id);
                        }}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Delete character"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {character.data.level && (
                        <div>Level {character.data.level}</div>
                      )}
                      {character.data.race && (
                        <div>{character.data.race}</div>
                      )}
                      {character.data.class && (
                        <div>{character.data.class}</div>
                      )}
                      <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-4">
                        Added {new Date(character.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Delete Confirmation Modal */}
                {showDeleteConfirm === character.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-2">
                        Delete Character?
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        Are you sure you want to delete <strong>{character.name}</strong>? This action cannot be undone.
                      </p>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(character.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
