'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CharacterData } from '@/types/character';
import { parseCharacterData } from '@/lib/characterParser';
import { saveCharacter } from '@/lib/characterStorage';

export default function UploadPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const parsedCharacter = parseCharacterData(jsonData);
        
        // Save character to storage
        const characterId = saveCharacter(parsedCharacter, parsedCharacter.name || 'Unnamed Character');
        
        // Navigate to character page
        router.push(`/character/${characterId}`);
      } catch (err) {
        setError('Failed to parse JSON file. Please ensure it is a valid Foundry VTT character export.');
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center text-black dark:text-zinc-50">
            Upload Character
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Upload a Foundry VTT character JSON file
          </p>
        </div>
        
        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-zinc-600 dark:text-zinc-400">Processing character...</p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </label>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Party List
          </a>
        </div>
      </div>
    </div>
  );
}

