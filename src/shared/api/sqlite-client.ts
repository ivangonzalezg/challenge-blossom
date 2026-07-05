import { open } from 'react-native-nitro-sqlite';

export const sqliteClient = open({ name: 'challenge-blossom.db' });

sqliteClient.execute(`
  CREATE TABLE IF NOT EXISTS favorites (
    character_id TEXT PRIMARY KEY NOT NULL
  );
`);
