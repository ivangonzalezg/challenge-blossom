import {
  addFavorite,
  getFavoriteIds,
  isFavorite,
  removeFavorite,
} from '@/entities/character/api/favorite.service';
import { sqliteClient } from '@/shared/api';

jest.mock('@/shared/api', () => ({
  sqliteClient: {
    executeAsync: jest.fn(),
  },
}));

const mockedExecuteAsync = sqliteClient.executeAsync as jest.Mock;

describe('favorite.service', () => {
  beforeEach(() => {
    mockedExecuteAsync.mockReset();
  });

  describe('getFavoriteIds', () => {
    it('returns an array of character ids from the favorites table', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: {
          _array: [{ character_id: '1' }, { character_id: '2' }],
          length: 2,
          item: () => undefined,
        },
      });

      const result = await getFavoriteIds();

      expect(result).toEqual(['1', '2']);
      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'SELECT character_id FROM favorites',
      );
    });

    it('returns an empty array when there are no favorites', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      const result = await getFavoriteIds();

      expect(result).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('inserts the character id, ignoring duplicates', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      await addFavorite('1');

      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'INSERT OR IGNORE INTO favorites (character_id) VALUES (?)',
        ['1'],
      );
    });
  });

  describe('removeFavorite', () => {
    it('deletes the character id from favorites', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      await removeFavorite('1');

      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'DELETE FROM favorites WHERE character_id = ?',
        ['1'],
      );
    });
  });

  describe('isFavorite', () => {
    it('returns true when the character id exists in favorites', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: {
          _array: [{ character_id: '1' }],
          length: 1,
          item: () => undefined,
        },
      });

      const result = await isFavorite('1');

      expect(result).toBe(true);
      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'SELECT character_id FROM favorites WHERE character_id = ?',
        ['1'],
      );
    });

    it('returns false when the character id does not exist in favorites', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      const result = await isFavorite('1');

      expect(result).toBe(false);
    });
  });
});
