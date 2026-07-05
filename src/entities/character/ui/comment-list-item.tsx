import { memo } from 'react';
import { Text, View } from 'react-native';
import CommentTimeAgo from '@/entities/character/lib/comment-time-ago';
import type { Comment } from '@/entities/character/model/comment.types';

type CommentListItemProps = {
  comment: Comment;
};

function CommentListItem({ comment }: CommentListItemProps) {
  return (
    <View className="rounded-lg bg-gray-100 p-3 dark:bg-neutral-900">
      <Text className="text-gray-900 dark:text-neutral-50">
        {comment.text}
      </Text>
      <CommentTimeAgo timestamp={comment.createdAt} />
    </View>
  );
}

export default memo(CommentListItem);
