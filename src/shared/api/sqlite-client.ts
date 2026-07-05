import { open } from 'react-native-nitro-sqlite';

export const sqliteClient = open({ name: 'challenge-blossom.db' });

sqliteClient.execute(`
  CREATE TABLE IF NOT EXISTS favorites (
    character_id TEXT PRIMARY KEY NOT NULL
  );
`);

sqliteClient.execute(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

sqliteClient.execute(`
  CREATE INDEX IF NOT EXISTS idx_comments_character_id ON comments(character_id);
`);
