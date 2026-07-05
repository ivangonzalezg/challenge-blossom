import { VisibilityFilter } from '@/entities/character/model/character.types';

export function passesVisibilityFilter(
  characterId: string,
  hiddenIds: Set<string>,
  filter: VisibilityFilter | '',
): boolean {
  const isHidden = hiddenIds.has(characterId);
  if (filter === 'hidden') return isHidden;
  if (filter === 'all') return true;
  return !isHidden;
}
