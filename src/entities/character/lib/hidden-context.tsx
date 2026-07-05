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
  getHiddenIds,
  hideCharacter,
  restoreCharacter,
} from '@/entities/character/api/hidden.service';
import { fetchCharactersByIds } from '@/entities/character/api/character.service';
import type { Character } from '@/entities/character/model/character.types';

type HiddenCharactersContextValue = {
  hiddenCharacters: Character[];
  hiddenIds: Set<string>;
  isLoading: boolean;
  errorMessage: string | null;
  toggleHidden: (characterId: string) => Promise<void>;
};

const HiddenCharactersContext =
  createContext<HiddenCharactersContextValue | null>(null);

export function HiddenCharactersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hiddenCharacters, setHiddenCharacters] = useState<Character[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();

  const loadHidden = useCallback(() => {
    startLoadingTransition(async () => {
      try {
        const ids = await getHiddenIds();
        const characters = await fetchCharactersByIds(ids);
        setHiddenCharacters(characters);
        setHiddenIds(new Set(ids));
        setErrorMessage(null);
      } catch (error) {
        console.error('[characters] failed to load hidden characters:', error);
        setErrorMessage('Failed to load hidden characters');
      }
    });
  }, []);

  useEffect(() => {
    loadHidden();
  }, [loadHidden]);

  const toggleHidden = useCallback(
    async (characterId: string) => {
      const isCurrentlyHidden = hiddenIds.has(characterId);

      try {
        if (isCurrentlyHidden) {
          await restoreCharacter(characterId);
          setHiddenCharacters(previous =>
            previous.filter(existing => existing.id !== characterId),
          );
          setHiddenIds(previous => {
            const next = new Set(previous);
            next.delete(characterId);
            return next;
          });
        } else {
          await hideCharacter(characterId);
          const [character] = await fetchCharactersByIds([characterId]);
          if (character) {
            setHiddenCharacters(previous => [...previous, character]);
          }
          setHiddenIds(previous => new Set(previous).add(characterId));
        }
      } catch (error) {
        console.error('[characters] failed to toggle hidden state:', error);
      }
    },
    [hiddenIds],
  );

  const value = useMemo(
    () => ({
      hiddenCharacters,
      hiddenIds,
      isLoading,
      errorMessage,
      toggleHidden,
    }),
    [hiddenCharacters, hiddenIds, isLoading, errorMessage, toggleHidden],
  );

  return (
    <HiddenCharactersContext.Provider value={value}>
      {children}
    </HiddenCharactersContext.Provider>
  );
}

export function useHiddenCharacters() {
  const context = useContext(HiddenCharactersContext);

  if (!context) {
    throw new Error(
      'useHiddenCharacters must be used within a HiddenCharactersProvider',
    );
  }

  return context;
}

export function useIsHidden(characterId: string) {
  const { hiddenIds } = useHiddenCharacters();

  return hiddenIds.has(characterId);
}
