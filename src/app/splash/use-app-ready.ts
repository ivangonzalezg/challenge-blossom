import { useEffect, useState } from 'react';
import {
  fetchCharacters,
  useFavoriteCharacters,
  useHiddenCharacters,
} from '@/entities/character';

const MINIMUM_SPLASH_DURATION_MS = 1800;

export function useAppReady() {
  const { isLoading: isFavoritesLoading } = useFavoriteCharacters();
  const { isLoading: isHiddenLoading } = useHiddenCharacters();
  const [isMinimumDurationElapsed, setIsMinimumDurationElapsed] =
    useState(false);
  const [isWarmUpDone, setIsWarmUpDone] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMinimumDurationElapsed(true);
    }, MINIMUM_SPLASH_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchCharacters(1)
      .catch(error => {
        console.error('[splash] initial character warm-up failed:', error);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsWarmUpDone(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const isReady =
    isMinimumDurationElapsed &&
    isWarmUpDone &&
    !isFavoritesLoading &&
    !isHiddenLoading;

  return { isReady };
}
