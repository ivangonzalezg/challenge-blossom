import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { fetchCharacters } from '@/entities/character/api/character.service';
import type {
  Character,
  CharactersPageInfo,
} from '@/entities/character/model/character.types';

function mergeCharacters(existing: Character[], incoming: Character[]) {
  const existingIds = new Set(existing.map(character => character.id));
  const newCharacters = incoming.filter(
    character => !existingIds.has(character.id),
  );
  return [...existing, ...newCharacters];
}

export function useCharactersList(
  name?: string,
  species?: string,
  status?: string,
  gender?: string,
) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [pageInfo, setPageInfo] = useState<CharactersPageInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadMoreErrorMessage, setLoadMoreErrorMessage] = useState<
    string | null
  >(null);
  const [isLoading, startLoadingTransition] = useTransition();
  const [isLoadingMore, startLoadingMoreTransition] = useTransition();
  const isFetchingRef = useRef(false);

  const loadFirstPage = useCallback(() => {
    isFetchingRef.current = true;
    startLoadingTransition(async () => {
      try {
        const { info, results } = await fetchCharacters(
          1,
          name,
          species,
          status,
          gender,
        );
        setCharacters(results);
        setPageInfo(info);
        setErrorMessage(null);
      } catch (error) {
        console.error(
          '[characters] failed to fetch characters from Rick and Morty GraphQL API:',
          error,
        );
        setErrorMessage('Failed to load characters');
      } finally {
        isFetchingRef.current = false;
      }
    });
  }, [name, species, status, gender]);

  const loadNextPage = useCallback(() => {
    if (isFetchingRef.current || !pageInfo?.next) return;

    isFetchingRef.current = true;
    startLoadingMoreTransition(async () => {
      try {
        const { info, results } = await fetchCharacters(
          pageInfo.next!,
          name,
          species,
          status,
          gender,
        );
        setCharacters(previous => mergeCharacters(previous, results));
        setPageInfo(info);
        setLoadMoreErrorMessage(null);
      } catch (error) {
        console.error(
          '[characters] failed to fetch next page of characters from Rick and Morty GraphQL API:',
          error,
        );
        setLoadMoreErrorMessage('Failed to load more characters');
      } finally {
        isFetchingRef.current = false;
      }
    });
  }, [pageInfo, name, species, status, gender]);

  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, species, status, gender]);

  return {
    characters,
    totalCount: pageInfo?.count ?? 0,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMoreErrorMessage,
    loadNextPage,
  };
}
