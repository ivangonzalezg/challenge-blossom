import { useCallback, useEffect, useState, useTransition } from 'react';
import {
  addComment as addCommentToDatabase,
  getCommentsByCharacterId,
} from '@/entities/character/api/comment.service';
import type { Comment } from '@/entities/character/model/comment.types';

export function useComments(characterId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();

  const loadComments = useCallback(() => {
    startLoadingTransition(async () => {
      try {
        const result = await getCommentsByCharacterId(characterId);
        setComments(result);
        setErrorMessage(null);
      } catch (error) {
        console.error('[characters] failed to load comments:', error);
        setErrorMessage('Failed to load comments');
      }
    });
  }, [characterId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(
    async (text: string) => {
      try {
        const comment = await addCommentToDatabase(characterId, text);
        setComments(previous => [comment, ...previous]);
        setErrorMessage(null);
      } catch (error) {
        console.error('[characters] failed to add comment:', error);
        setErrorMessage('Failed to add comment');
      }
    },
    [characterId],
  );

  return {
    comments,
    isLoading,
    errorMessage,
    addComment,
  };
}
