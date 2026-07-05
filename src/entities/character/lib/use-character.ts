import { useCallback, useEffect, useState, useTransition } from 'react';
import { fetchCharacter } from '@/entities/character/api/character.service';
import type { Character } from '@/entities/character/model/character.types';

export function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();

  const loadCharacter = useCallback(() => {
    startLoadingTransition(async () => {
      try {
        const result = await fetchCharacter(id);
        setCharacter(result);
        setErrorMessage(null);
      } catch (error) {
        console.error(
          '[characters] failed to fetch character from Rick and Morty GraphQL API:',
          error,
        );
        setErrorMessage('Failed to load character');
      }
    });
  }, [id]);

  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  return {
    character,
    isLoading,
    errorMessage,
  };
}
