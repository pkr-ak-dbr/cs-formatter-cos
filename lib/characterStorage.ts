// Supabase client setup
import { createClient } from '@supabase/supabase-js';
import { CharacterData } from '@/types/character';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create Supabase client if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface StoredCharacter {
  id: string;
  name: string;
  data: CharacterData;
  uploadedAt: string;
  userId?: string;
}

const STORAGE_KEY = 'dnd-characters';

// Fallback to localStorage if Supabase is not configured
function isSupabaseConfigured(): boolean {
  return !!supabase && !!supabaseUrl && !!supabaseAnonKey;
}

export async function getAllCharacters(): Promise<StoredCharacter[]> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, character_data, uploaded_at, user_id')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching characters:', error);
      return [];
    }

    return (data || []).map((char) => ({
      id: char.id,
      name: char.name,
      data: char.character_data as CharacterData,
      uploadedAt: char.uploaded_at,
      userId: char.user_id,
    }));
  } catch (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
}

export async function getCharacterById(id: string): Promise<StoredCharacter | null> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    const characters = getAllCharacters();
    return (await characters).find((c) => c.id === id) || null;
  }

  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, character_data, uploaded_at, user_id')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      data: data.character_data as CharacterData,
      uploadedAt: data.uploaded_at,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Error fetching character:', error);
    return null;
  }
}

export async function saveCharacter(
  characterData: CharacterData,
  name: string
): Promise<string> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    const characters = await getAllCharacters();
    const id = `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newCharacter: StoredCharacter = {
      id,
      name: name || characterData.name || 'Unnamed Character',
      data: characterData,
      uploadedAt: new Date().toISOString(),
    };

    characters.push(newCharacter);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }

    return id;
  }

  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Check your environment variables.');
    }
    
    // Get current user if authenticated, otherwise use null for anonymous
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Auth error is OK - we'll just use null for user_id
    if (authError && authError.message !== 'Invalid Refresh Token: Refresh Token Not Found') {
      console.warn('Auth check warning:', authError);
    }

    const { data, error } = await supabase
      .from('characters')
      .insert({
        name: name || characterData.name || 'Unnamed Character',
        character_data: characterData,
        user_id: user?.id || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error saving character:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      
      // Create a more informative error
      const enhancedError: any = new Error(error.message || 'Failed to save character');
      enhancedError.code = error.code;
      enhancedError.details = error.details;
      enhancedError.hint = error.hint;
      throw enhancedError;
    }

    if (!data || !data.id) {
      throw new Error('No data returned from Supabase insert');
    }

    return data.id;
  } catch (error: any) {
    console.error('Error saving character:', error);
    // Re-throw with more context
    if (error.code || error.message) {
      throw error;
    }
    throw new Error(`Failed to save character: ${error?.message || 'Unknown error'}`);
  }
}

export async function deleteCharacter(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    const characters = await getAllCharacters();
    const filtered = characters.filter((c) => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    return;
  }

  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.from('characters').delete().eq('id', id);

    if (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
}

export async function updateCharacterName(id: string, newName: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    // Fallback to localStorage
    const characters = await getAllCharacters();
    const updated = characters.map((c) =>
      c.id === id ? { ...c, name: newName } : c
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return;
  }

  try {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('characters')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      console.error('Error updating character name:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating character name:', error);
    throw error;
  }
}
