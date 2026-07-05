import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, SlidersVertical } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import type { RootStackParamList } from '@/app/navigation/root-navigator';
import {
  CharacterListItem,
  sortCharactersByName,
  useCharactersList,
  useFavoriteCharacters,
  type Character,
  type NameSortOrder,
} from '@/entities/character';
import {
  colors,
  ErrorMessage,
  SectionFooterMessage,
  SectionFooterSpinner,
  SectionHeader,
} from '@/shared/ui';

const SEARCH_DEBOUNCE_MS = 400;

const STARRED_SECTION_TITLE = 'Starred Characters';
const CHARACTERS_SECTION_TITLE = 'Characters';

type CharactersListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CharactersList'
>;

function CharactersListScreen({ navigation }: CharactersListScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [starredSortOrder, setStarredSortOrder] =
    useState<NameSortOrder>('asc');
  const isSearching = searchText.length > 0;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const {
    characters,
    totalCount,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMoreErrorMessage,
    loadNextPage,
  } = useCharactersList(debouncedSearchText || undefined);
  const { favoriteCharacters, favoriteIds, toggleFavorite } =
    useFavoriteCharacters();

  const nonFavoriteCharacters = characters.filter(
    character => !favoriteIds.has(character.id),
  );
  const starredCharacters = sortCharactersByName(
    isSearching
      ? favoriteCharacters.filter(character =>
          character.name.toLowerCase().includes(searchText.toLowerCase()),
        )
      : favoriteCharacters,
    starredSortOrder,
  );

  const isInitialLoad = isLoading && characters.length === 0 && !isSearching;
  const isSearchLoading = isLoading && isSearching;

  const charactersCount = isSearching
    ? nonFavoriteCharacters.length
    : Math.max(0, totalCount - favoriteIds.size);

  function renderStarredFooter() {
    if (starredCharacters.length > 0) return null;
    return (
      <SectionFooterMessage>
        {isSearching ? 'No matches' : 'No favorites yet'}
      </SectionFooterMessage>
    );
  }

  function renderCharactersFooter() {
    if (isSearchLoading) return <SectionFooterSpinner />;
    if (isSearching && nonFavoriteCharacters.length === 0) {
      return <SectionFooterMessage>No matches</SectionFooterMessage>;
    }
    return null;
  }

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
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('CharacterFilters')}
            activeOpacity={0.6}
          >
            <SlidersVertical
              color={isDarkMode ? colors.violet400 : colors.violet600}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isInitialLoad ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : (
        <SectionList
          sections={[
            { title: STARRED_SECTION_TITLE, data: starredCharacters },
            {
              title: CHARACTERS_SECTION_TITLE,
              data: isSearchLoading ? [] : nonFavoriteCharacters,
            },
          ]}
          keyExtractor={character => character.id}
          renderItem={({ item }: { item: Character }) => (
            <CharacterListItem
              character={item}
              isFavorite={favoriteIds.has(item.id)}
              onPress={() =>
                navigation.navigate('CharacterDetail', {
                  characterId: item.id,
                })
              }
              onFavoritePress={() => toggleFavorite(item)}
            />
          )}
          onEndReached={isSearchLoading ? undefined : loadNextPage}
          onEndReachedThreshold={0.5}
          renderSectionHeader={({ section }) => (
            <SectionHeader
              title={section.title}
              count={
                section.title === STARRED_SECTION_TITLE
                  ? starredCharacters.length
                  : charactersCount
              }
              sortOrder={
                section.title === STARRED_SECTION_TITLE
                  ? starredSortOrder
                  : undefined
              }
              onToggleSort={
                section.title === STARRED_SECTION_TITLE
                  ? () =>
                      setStarredSortOrder(previous =>
                        previous === 'asc' ? 'desc' : 'asc',
                      )
                  : undefined
              }
            />
          )}
          renderSectionFooter={({ section }) =>
            section.title === STARRED_SECTION_TITLE
              ? renderStarredFooter()
              : renderCharactersFooter()
          }
          ListFooterComponent={
            isLoadingMore && !isSearchLoading ? (
              <SectionFooterSpinner />
            ) : loadMoreErrorMessage ? (
              <SectionFooterMessage>
                {loadMoreErrorMessage}
              </SectionFooterMessage>
            ) : null
          }
        />
      )}
    </View>
  );
}

export default CharactersListScreen;
