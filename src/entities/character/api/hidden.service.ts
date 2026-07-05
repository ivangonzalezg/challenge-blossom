import { sqliteClient } from '@/shared/api';

type HiddenRow = {
  character_id: string;
};

export async function getHiddenIds(): Promise<string[]> {
  const result = await sqliteClient.executeAsync<HiddenRow>(
    'SELECT character_id FROM hidden_characters',
  );

  return result.rows._array.map(row => row.character_id);
}

export async function isHidden(characterId: string): Promise<boolean> {
  const result = await sqliteClient.executeAsync<HiddenRow>(
    'SELECT character_id FROM hidden_characters WHERE character_id = ?',
    [characterId],
  );

  return result.rows._array.length > 0;
}

export async function hideCharacter(characterId: string): Promise<void> {
  await sqliteClient.executeAsync(
    'INSERT OR IGNORE INTO hidden_characters (character_id) VALUES (?)',
    [characterId],
  );
}

export async function restoreCharacter(characterId: string): Promise<void> {
  await sqliteClient.executeAsync(
    'DELETE FROM hidden_characters WHERE character_id = ?',
    [characterId],
  );
}
