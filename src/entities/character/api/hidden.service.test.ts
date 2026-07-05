import {
  getHiddenIds,
  hideCharacter,
  isHidden,
  restoreCharacter,
} from '@/entities/character/api/hidden.service';
import { sqliteClient } from '@/shared/api';

jest.mock('@/shared/api', () => ({
  sqliteClient: {
    executeAsync: jest.fn(),
  },
}));

const mockedExecuteAsync = sqliteClient.executeAsync as jest.Mock;

describe('hidden.service', () => {
  beforeEach(() => {
    mockedExecuteAsync.mockReset();
  });

  describe('getHiddenIds', () => {
    it('returns an array of character ids from the hidden_characters table', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: {
          _array: [{ character_id: '1' }, { character_id: '2' }],
          length: 2,
          item: () => undefined,
        },
      });

      const result = await getHiddenIds();

      expect(result).toEqual(['1', '2']);
      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'SELECT character_id FROM hidden_characters',
      );
    });

    it('returns an empty array when there are no hidden characters', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      const result = await getHiddenIds();

      expect(result).toEqual([]);
    });
  });

  describe('hideCharacter', () => {
    it('inserts the character id, ignoring duplicates', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      await hideCharacter('1');

      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'INSERT OR IGNORE INTO hidden_characters (character_id) VALUES (?)',
        ['1'],
      );
    });
  });

  describe('restoreCharacter', () => {
    it('deletes the character id from hidden_characters', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      await restoreCharacter('1');

      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'DELETE FROM hidden_characters WHERE character_id = ?',
        ['1'],
      );
    });
  });

  describe('isHidden', () => {
    it('returns true when the character id exists in hidden_characters', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: {
          _array: [{ character_id: '1' }],
          length: 1,
          item: () => undefined,
        },
      });

      const result = await isHidden('1');

      expect(result).toBe(true);
      expect(mockedExecuteAsync).toHaveBeenCalledWith(
        'SELECT character_id FROM hidden_characters WHERE character_id = ?',
        ['1'],
      );
    });

    it('returns false when the character id does not exist in hidden_characters', async () => {
      mockedExecuteAsync.mockResolvedValueOnce({
        rows: { _array: [], length: 0, item: () => undefined },
      });

      const result = await isHidden('1');

      expect(result).toBe(false);
    });
  });
});
