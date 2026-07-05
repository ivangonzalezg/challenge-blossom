import type { Character } from '@/entities/character/model/character.types';

export type NameSortOrder = 'asc' | 'desc';

export function sortCharactersByName(
  characters: Character[],
  order: NameSortOrder,
): Character[] {
  return [...characters].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return order === 'asc' ? comparison : -comparison;
  });
}
