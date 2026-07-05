import { graphqlClient } from '@/shared/api';
import {
  CHARACTER_FRAGMENT,
  GET_CHARACTER,
  GET_CHARACTERS,
  GET_CHARACTERS_BY_IDS,
} from '@/entities/character/api/character.queries';
import type {
  Character,
  GetCharacterResponse,
  GetCharacterVariables,
  GetCharactersByIdsResponse,
  GetCharactersByIdsVariables,
  GetCharactersResponse,
  GetCharactersVariables,
} from '@/entities/character/model/character.types';

const MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 2000;

type ServerError = Error & {
  response: Response;
  statusCode: number;
};

function isServerError(error: unknown): error is ServerError {
  return (
    error instanceof Error &&
    typeof (error as ServerError).statusCode === 'number'
  );
}

function getRetryDelayMs(error: ServerError): number {
  const retryAfterHeader = error.response.headers.get('retry-after');
  const retryAfterSeconds = Number(retryAfterHeader);

  if (!retryAfterHeader || Number.isNaN(retryAfterSeconds)) {
    return DEFAULT_RETRY_DELAY_MS;
  }

  return retryAfterSeconds * 1000;
}

function wait(delayMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

async function withRetryOn429<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === MAX_ATTEMPTS;
      if (!isServerError(error) || error.statusCode !== 429 || isLastAttempt) {
        throw error;
      }

      await wait(getRetryDelayMs(error));
    }
  }

  throw lastError;
}

export async function fetchCharacters(
  page = 1,
  name?: string,
  species?: string,
) {
  const { data } = await withRetryOn429(() =>
    graphqlClient.query<GetCharactersResponse, GetCharactersVariables>({
      query: GET_CHARACTERS,
      variables: {
        page,
        filter: name || species ? { name, species } : undefined,
      },
    }),
  );

  return data.characters;
}

export function readCachedCharacter(id: string): Character | null {
  return graphqlClient.readFragment<Character>({
    id: graphqlClient.cache.identify({ __typename: 'Character', id }),
    fragment: CHARACTER_FRAGMENT,
  });
}

export async function fetchCharacter(id: string) {
  const { data } = await withRetryOn429(() =>
    graphqlClient.query<GetCharacterResponse, GetCharacterVariables>({
      query: GET_CHARACTER,
      variables: { id },
    }),
  );

  return data.character;
}

export async function fetchCharactersByIds(
  ids: string[],
): Promise<Character[]> {
  if (ids.length === 0) {
    return [];
  }

  const { data } = await withRetryOn429(() =>
    graphqlClient.query<
      GetCharactersByIdsResponse,
      GetCharactersByIdsVariables
    >({
      query: GET_CHARACTERS_BY_IDS,
      variables: { ids },
    }),
  );

  return data.charactersByIds;
}
