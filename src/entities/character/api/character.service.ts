import { graphqlClient } from '@/shared/api';
import { GET_CHARACTERS } from '@/entities/character/api/character.queries';
import type {
  GetCharactersResponse,
  GetCharactersVariables,
} from '@/entities/character/model/character.types';

export async function fetchCharacters(page = 1) {
  const { data } = await graphqlClient.query<
    GetCharactersResponse,
    GetCharactersVariables
  >({
    query: GET_CHARACTERS,
    variables: { page },
  });

  return data.characters;
}
