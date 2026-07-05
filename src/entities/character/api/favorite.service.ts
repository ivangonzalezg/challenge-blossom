import { sqliteClient } from '@/shared/api';

type FavoriteRow = {
  character_id: string;
};

export async function getFavoriteIds(): Promise<string[]> {
  const result = await sqliteClient.executeAsync<FavoriteRow>(
    'SELECT character_id FROM favorites',
  );

  return result.rows._array.map(row => row.character_id);
}

export async function isFavorite(characterId: string): Promise<boolean> {
  const result = await sqliteClient.executeAsync<FavoriteRow>(
    'SELECT character_id FROM favorites WHERE character_id = ?',
    [characterId],
  );

  return result.rows._array.length > 0;
}

export async function addFavorite(characterId: string): Promise<void> {
  await sqliteClient.executeAsync(
    'INSERT OR IGNORE INTO favorites (character_id) VALUES (?)',
    [characterId],
  );
}

export async function removeFavorite(characterId: string): Promise<void> {
  await sqliteClient.executeAsync(
    'DELETE FROM favorites WHERE character_id = ?',
    [characterId],
  );
}
