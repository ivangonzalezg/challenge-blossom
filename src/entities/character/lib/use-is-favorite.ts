import { useEffect, useState } from 'react';
import { isFavorite } from '@/entities/character/api/favorite.service';

export function useIsFavorite(characterId: string) {
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  useEffect(() => {
    isFavorite(characterId).then(setIsFavoriteState);
  }, [characterId]);

  return isFavoriteState;
}
