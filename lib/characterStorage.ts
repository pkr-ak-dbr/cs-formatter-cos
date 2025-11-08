// Character storage utility using localStorage

export interface StoredCharacter {
  id: string;
  name: string;
  data: any; // Raw parsed character data
  uploadedAt: string;
}

const STORAGE_KEY = 'dnd-characters';

export function getAllCharacters(): StoredCharacter[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getCharacterById(id: string): StoredCharacter | null {
  const characters = getAllCharacters();
  return characters.find(c => c.id === id) || null;
}

export function saveCharacter(characterData: any, name: string): string {
  const characters = getAllCharacters();
  const id = `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newCharacter: StoredCharacter = {
    id,
    name: name || characterData.name || 'Unnamed Character',
    data: characterData,
    uploadedAt: new Date().toISOString(),
  };
  
  characters.push(newCharacter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  
  return id;
}

export function deleteCharacter(id: string): void {
  const characters = getAllCharacters();
  const filtered = characters.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateCharacterName(id: string, newName: string): void {
  const characters = getAllCharacters();
  const updated = characters.map(c => 
    c.id === id ? { ...c, name: newName } : c
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

