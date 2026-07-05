import { useCallback, useEffect, useState, useTransition } from 'react';
import {
  addFavorite,
  getFavoriteIds,
  removeFavorite,
} from '@/entities/character/api/favorite.service';
import { fetchCharactersByIds } from '@/entities/character/api/character.service';
import type { Character } from '@/entities/character/model/character.types';

export function useFavoriteCharacters() {
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();

  const loadFavorites = useCallback(() => {
    startLoadingTransition(async () => {
      try {
        const ids = await getFavoriteIds();
        const characters = await fetchCharactersByIds(ids);
        setFavoriteCharacters(characters);
        setFavoriteIds(new Set(ids));
        setErrorMessage(null);
      } catch (error) {
        console.error(
          '[characters] failed to load favorite characters:',
          error,
        );
        setErrorMessage('Failed to load favorites');
      }
    });
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(
    async (character: Character) => {
      const isCurrentlyFavorite = favoriteIds.has(character.id);

      try {
        if (isCurrentlyFavorite) {
          await removeFavorite(character.id);
          setFavoriteCharacters(previous =>
            previous.filter(existing => existing.id !== character.id),
          );
          setFavoriteIds(previous => {
            const next = new Set(previous);
            next.delete(character.id);
            return next;
          });
        } else {
          await addFavorite(character.id);
          setFavoriteCharacters(previous => [...previous, character]);
          setFavoriteIds(previous => new Set(previous).add(character.id));
        }
      } catch (error) {
        console.error('[characters] failed to toggle favorite:', error);
      }
    },
    [favoriteIds],
  );

  return {
    favoriteCharacters,
    favoriteIds,
    isLoading,
    errorMessage,
    toggleFavorite,
  };
}
