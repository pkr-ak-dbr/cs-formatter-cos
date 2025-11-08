'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CharacterData } from '@/types/character';
import { getCharacterById } from '@/lib/characterStorage';
import CharacterViewerContent from '../../components/CharacterViewerContent';

export default function CharacterPage() {
  const params = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      const characterId = params?.id as string;
      if (!characterId) {
        setError('Character ID not found');
        setLoading(false);
        return;
      }

      const storedCharacter = await getCharacterById(characterId);
      if (!storedCharacter) {
        setError('Character not found');
        setLoading(false);
        return;
      }

      setCharacter(storedCharacter.data);
      setLoading(false);
    };
    loadCharacter();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-4">
            {error || 'Character not found'}
          </h1>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Party List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Party List
          </Link>
          <Link
            href="/upload"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Upload Another Character
          </Link>
        </div>
      </div>
      <CharacterViewerContent character={character} />
    </div>
  );
}

