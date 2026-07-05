import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
import {
  addFavorite,
  getFavoriteIds,
  removeFavorite,
} from '@/entities/character/api/favorite.service';
import { fetchCharactersByIds } from '@/entities/character/api/character.service';
import type { Character } from '@/entities/character/model/character.types';

type FavoritesContextValue = {
  favoriteCharacters: Character[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  errorMessage: string | null;
  toggleFavorite: (character: Character) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(
    () => ({
      favoriteCharacters,
      favoriteIds,
      isLoading,
      errorMessage,
      toggleFavorite,
    }),
    [favoriteCharacters, favoriteIds, isLoading, errorMessage, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoriteCharacters() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavoriteCharacters must be used within a FavoritesProvider',
    );
  }

  return context;
}

export function useIsFavorite(characterId: string) {
  const { favoriteIds } = useFavoriteCharacters();

  return favoriteIds.has(characterId);
}
