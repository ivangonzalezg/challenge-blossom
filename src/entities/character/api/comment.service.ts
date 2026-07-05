import { sqliteClient } from '@/shared/api';
import type { Comment } from '@/entities/character/model/comment.types';

type CommentRow = {
  id: number;
  character_id: string;
  text: string;
  created_at: number;
};

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    characterId: row.character_id,
    text: row.text,
    createdAt: row.created_at,
  };
}

export async function getCommentsByCharacterId(
  characterId: string,
): Promise<Comment[]> {
  const result = await sqliteClient.executeAsync<CommentRow>(
    'SELECT id, character_id, text, created_at FROM comments WHERE character_id = ? ORDER BY created_at ASC',
    [characterId],
  );

  return result.rows._array.map(toComment);
}

export async function addComment(
  characterId: string,
  text: string,
): Promise<Comment> {
  const createdAt = Date.now();
  const result = await sqliteClient.executeAsync(
    'INSERT INTO comments (character_id, text, created_at) VALUES (?, ?, ?)',
    [characterId, text, createdAt],
  );

  return {
    id: result.insertId as number,
    characterId,
    text,
    createdAt,
  };
}
