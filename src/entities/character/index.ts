export { fetchCharacter, fetchCharacters } from './api/character.service';
export { useCharacter } from './lib/use-character';
export { useCharactersList } from './lib/use-characters-list';
export {
  FavoritesProvider,
  useFavoriteCharacters,
  useIsFavorite,
} from './lib/favorites-context';
export {
  sortCharactersByName,
  type NameSortOrder,
} from './lib/sort-characters-by-name';
export type {
  Character,
  CharactersPageInfo,
  GetCharacterResponse,
  GetCharacterVariables,
  GetCharactersResponse,
  GetCharactersVariables,
} from './model/character.types';
export { default as CharacterListItem } from './ui/character-list-item';
