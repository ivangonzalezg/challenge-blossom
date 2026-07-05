import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, SlidersVertical } from 'lucide-react-native';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import type { RootStackParamList } from '@/app/navigation/root-navigator';
import { CharacterListItem, useCharactersList } from '@/entities/character';
import { colors } from '@/shared/ui';

type CharactersListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CharactersList'
>;

function CharactersListScreen({ navigation }: CharactersListScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const {
    characters,
    totalCount,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMoreErrorMessage,
    loadNextPage,
  } = useCharactersList();

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950 px-6">
      <View className="pt-7">
        <Text className="text-2xl font-bold text-gray-800 dark:text-neutral-50">
          Rick and Morty list
        </Text>
      </View>
      <View className="py-4">
        <View className="flex-row items-center gap-2 rounded-lg bg-gray-100 py-2 pl-3 pr-2 dark:bg-neutral-900">
          <Search
            color={isDarkMode ? colors.neutral400 : colors.gray400}
            size={20}
          />
          <TextInput
            className="flex-1 text-gray-500 dark:text-neutral-400"
            placeholder="Search or filter results"
            placeholderTextColor={
              isDarkMode ? colors.neutral400 : colors.gray500
            }
            editable={false}
          />
          <SlidersVertical
            color={isDarkMode ? colors.violet400 : colors.violet600}
            size={20}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : errorMessage ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-gray-500 dark:text-neutral-400">
            {errorMessage}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={[{ title: 'Characters', data: characters }]}
          keyExtractor={character => character.id}
          renderItem={({ item }) => (
            <CharacterListItem
              character={item}
              onPress={() =>
                navigation.navigate('CharacterDetail', {
                  characterId: item.id,
                })
              }
            />
          )}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.5}
          renderSectionHeader={({ section }) => (
            <Text className="bg-white py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-neutral-950 dark:text-neutral-400">
              {section.title} ({totalCount})
            </Text>
          )}
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : loadMoreErrorMessage ? (
              <Text className="py-4 text-center text-gray-500 dark:text-neutral-400">
                {loadMoreErrorMessage}
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

export default CharactersListScreen;
