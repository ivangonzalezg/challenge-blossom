import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart, Send } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import type { RootStackParamList } from '@/app/navigation/root-navigator';
import {
  CommentListItem,
  useCharacter,
  useComments,
  useIsFavorite,
} from '@/entities/character';
import { AvatarImage, colors, ErrorMessage, SectionHeader } from '@/shared/ui';

type CommentSortOrder = 'newest' | 'oldest';

type CharacterDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CharacterDetail'
>;

function CharacterDetailScreen({
  route,
  navigation,
}: CharacterDetailScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const { character, isLoading, errorMessage } = useCharacter(
    route.params.characterId,
  );
  const isFavorite = useIsFavorite(route.params.characterId);
  const {
    comments,
    errorMessage: commentsErrorMessage,
    addComment,
  } = useComments(route.params.characterId);
  const [commentText, setCommentText] = useState('');
  const [commentSortOrder, setCommentSortOrder] =
    useState<CommentSortOrder>('oldest');

  const sortedComments = [...comments].sort((a, b) =>
    commentSortOrder === 'newest'
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt,
  );

  const handleAddComment = useCallback(async () => {
    const trimmedText = commentText.trim();
    if (!trimmedText) return;

    setCommentText('');
    await addComment(trimmedText);
  }, [commentText, addComment]);

  const handleToggleCommentSort = useCallback(() => {
    setCommentSortOrder(previous =>
      previous === 'newest' ? 'oldest' : 'newest',
    );
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView className="flex-1" contentContainerClassName="px-6">
        <View className="flex justify-center relative h-16">
          <TouchableOpacity
            onPress={navigation.goBack}
            activeOpacity={0.6}
            className="absolute p-3 -left-3"
          >
            <ArrowLeft
              color={isDarkMode ? colors.neutral400 : colors.gray900}
              size={24}
            />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : errorMessage || !character ? (
          <ErrorMessage>{errorMessage ?? 'Character not found'}</ErrorMessage>
        ) : (
          <View>
            <View className="self-start relative">
              <AvatarImage
                uri={character.image}
                fallbackLabel={character.name}
                className="size-[75px] rounded-full"
              />
              {isFavorite && (
                <View className="size-8 items-center justify-center rounded-full bg-white absolute -bottom-1 -right-1">
                  <Heart
                    color={colors.green500}
                    fill={colors.green500}
                    size={20}
                  />
                </View>
              )}
            </View>
            <View className="pt-2 pb-4">
              <Text className="text-2xl font-bold leading-8 text-gray-900 dark:text-neutral-50">
                {character.name}
              </Text>
            </View>

            <View className="w-full">
              <View className="w-full flex-col py-4">
                <Text className="font-semibold text-gray-900 dark:text-neutral-50">
                  Specie
                </Text>
                <Text className="text-gray-500 dark:text-neutral-400">
                  {character.species}
                </Text>
              </View>

              <View className="h-[1px] w-full bg-gray-200 dark:bg-neutral-800" />

              <View className="w-full flex-col py-4">
                <Text className="font-semibold text-gray-900 dark:text-neutral-50">
                  Status
                </Text>
                <Text className="text-gray-500 dark:text-neutral-400">
                  {character.status}
                </Text>
              </View>

              <View className="h-[1px] w-full bg-gray-200 dark:bg-neutral-800" />

              <View className="w-full flex-col py-4">
                <Text className="font-semibold text-gray-900 dark:text-neutral-50">
                  Gender
                </Text>
                <Text className="text-gray-500 dark:text-neutral-400">
                  {character.gender}
                </Text>
              </View>

              <View className="h-[1px] w-full bg-gray-200 dark:bg-neutral-800" />

              <View className="w-full flex-col">
                <SectionHeader
                  title="Comments"
                  count={comments.length}
                  sortOrder={commentSortOrder === 'newest' ? 'desc' : 'asc'}
                  sortLabel={
                    commentSortOrder === 'newest' ? 'Newest' : 'Oldest'
                  }
                  onToggleSort={
                    comments.length > 1 ? handleToggleCommentSort : undefined
                  }
                />

                {commentsErrorMessage && (
                  <Text className="text-red-500 dark:text-red-400">
                    {commentsErrorMessage}
                  </Text>
                )}

                {sortedComments.length === 0 ? (
                  <Text className="text-gray-500 dark:text-neutral-400 pb-4">
                    No comments yet. Be the first to add one.
                  </Text>
                ) : (
                  <View className="gap-3 pb-4">
                    {sortedComments.map(comment => (
                      <CommentListItem key={comment.id} comment={comment} />
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {character && (
        <View className="flex-row items-center gap-2 border-t border-gray-200 px-6 py-3 dark:border-neutral-800">
          <TextInput
            className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 dark:bg-neutral-900 dark:text-neutral-50"
            placeholder="Add a comment"
            placeholderTextColor={
              isDarkMode ? colors.neutral400 : colors.gray500
            }
            value={commentText}
            onChangeText={setCommentText}
            onSubmitEditing={handleAddComment}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={handleAddComment}
            activeOpacity={0.6}
            disabled={!commentText.trim()}
            className="p-2"
          >
            <Send
              color={
                commentText.trim()
                  ? isDarkMode
                    ? colors.violet400
                    : colors.violet700
                  : colors.gray400
              }
              size={20}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default CharacterDetailScreen;
