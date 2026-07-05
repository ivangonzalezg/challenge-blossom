import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  SectionList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import type { RootStackParamList } from '@/app/navigation/root-navigator';
import {
  CharacterListItem,
  passesVisibilityFilter,
  sortCharactersByName,
  useCharactersList,
  useFavoriteCharacters,
  useHiddenCharacters,
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

type AdvancedSearchResultsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AdvancedSearchResults'
>;

const STARRED_SECTION_TITLE = 'Starred Characters';
const CHARACTERS_SECTION_TITLE = 'Characters';

const SPECIE_API_VALUES: Record<'human' | 'alien', string> = {
  human: 'Human',
  alien: 'Alien',
};

const STATUS_API_VALUES: Record<'alive' | 'dead' | 'unknown', string> = {
  alive: 'Alive',
  dead: 'Dead',
  unknown: 'unknown',
};

const GENDER_API_VALUES: Record<
  'female' | 'male' | 'genderless' | 'unknown',
  string
> = {
  female: 'Female',
  male: 'Male',
  genderless: 'Genderless',
  unknown: 'unknown',
};

function AdvancedSearchResultsScreen({
  route,
  navigation,
}: AdvancedSearchResultsScreenProps) {
  const {
    charactersFilter,
    specieFilter,
    statusFilter,
    genderFilter,
    visibilityFilter,
  } = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const [starredSortOrder, setStarredSortOrder] =
    useState<NameSortOrder>('asc');

  const activeFilterCount =
    (charactersFilter !== '' && charactersFilter !== 'all' ? 1 : 0) +
    (specieFilter !== '' && specieFilter !== 'all' ? 1 : 0) +
    (statusFilter !== '' && statusFilter !== 'all' ? 1 : 0) +
    (genderFilter !== '' && genderFilter !== 'all' ? 1 : 0) +
    (visibilityFilter !== '' && visibilityFilter !== 'all' ? 1 : 0);

  const speciesQueryValue =
    specieFilter === 'human' || specieFilter === 'alien'
      ? SPECIE_API_VALUES[specieFilter]
      : undefined;

  const statusQueryValue =
    statusFilter === 'alive' ||
    statusFilter === 'dead' ||
    statusFilter === 'unknown'
      ? STATUS_API_VALUES[statusFilter]
      : undefined;

  const genderQueryValue =
    genderFilter === 'female' ||
    genderFilter === 'male' ||
    genderFilter === 'genderless' ||
    genderFilter === 'unknown'
      ? GENDER_API_VALUES[genderFilter]
      : undefined;

  const {
    characters,
    totalCount,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMoreErrorMessage,
    loadNextPage,
  } = useCharactersList(
    undefined,
    speciesQueryValue,
    statusQueryValue,
    genderQueryValue,
  );
  const { favoriteCharacters, favoriteIds, toggleFavorite } =
    useFavoriteCharacters();
  const { hiddenIds } = useHiddenCharacters();

  const nonFavoriteCharacters = characters.filter(
    character =>
      !favoriteIds.has(character.id) &&
      passesVisibilityFilter(character.id, hiddenIds, visibilityFilter),
  );
  const starredCharacters = sortCharactersByName(
    favoriteCharacters.filter(character => {
      if (speciesQueryValue && character.species !== speciesQueryValue) {
        return false;
      }
      if (statusQueryValue && character.status !== statusQueryValue) {
        return false;
      }
      if (genderQueryValue && character.gender !== genderQueryValue) {
        return false;
      }
      if (!passesVisibilityFilter(character.id, hiddenIds, visibilityFilter)) {
        return false;
      }
      return true;
    }),
    starredSortOrder,
  );

  const showStarredSection = charactersFilter !== 'others';
  const showCharactersSection = charactersFilter !== 'starred';

  const charactersSectionCount = Math.max(
    0,
    totalCount - starredCharacters.length,
  );

  const resultsCount =
    (showStarredSection ? starredCharacters.length : 0) +
    (showCharactersSection ? charactersSectionCount : 0);

  const sections = [
    ...(showStarredSection
      ? [{ title: STARRED_SECTION_TITLE, data: starredCharacters }]
      : []),
    ...(showCharactersSection
      ? [
          {
            title: CHARACTERS_SECTION_TITLE,
            data: isLoading ? [] : nonFavoriteCharacters,
          },
        ]
      : []),
  ];

  const renderStarredFooter = useCallback(() => {
    if (starredCharacters.length > 0) return null;
    return <SectionFooterMessage>No matches</SectionFooterMessage>;
  }, [starredCharacters.length]);

  const renderCharactersFooter = useCallback(() => {
    if (isLoading) return <SectionFooterSpinner />;
    if (nonFavoriteCharacters.length === 0) {
      return <SectionFooterMessage>No matches</SectionFooterMessage>;
    }
    return null;
  }, [isLoading, nonFavoriteCharacters.length]);

  const handleToggleStarredSort = useCallback(() => {
    setStarredSortOrder(previous => (previous === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleBackToFilters = useCallback(() => {
    navigation.navigate(
      'CharactersList',
      { reopenFilters: true },
      { pop: true },
    );
  }, [navigation]);

  const handleDone = useCallback(() => {
    navigation.navigate(
      'CharactersList',
      { clearFilters: true },
      { pop: true },
    );
  }, [navigation]);

  const keyExtractor = useCallback((character: Character) => character.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
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
    ),
    [favoriteIds, navigation, toggleFavorite],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <SectionHeader
        title={section.title}
        count={
          section.title === STARRED_SECTION_TITLE
            ? starredCharacters.length
            : charactersSectionCount
        }
        sortOrder={
          section.title === STARRED_SECTION_TITLE ? starredSortOrder : undefined
        }
        onToggleSort={
          section.title === STARRED_SECTION_TITLE
            ? handleToggleStarredSort
            : undefined
        }
      />
    ),
    [
      starredCharacters.length,
      charactersSectionCount,
      starredSortOrder,
      handleToggleStarredSort,
    ],
  );

  const renderSectionFooter = useCallback(
    ({ section }: { section: { title: string } }) =>
      section.title === STARRED_SECTION_TITLE
        ? renderStarredFooter()
        : renderCharactersFooter(),
    [renderStarredFooter, renderCharactersFooter],
  );

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="relative flex justify-center py-4 my-2">
        <TouchableOpacity
          onPress={handleBackToFilters}
          activeOpacity={0.6}
          className="absolute -left-3 p-3 z-10"
        >
          <ArrowLeft
            color={isDarkMode ? colors.violet400 : colors.violet700}
            size={24}
          />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">
          Advanced search
        </Text>
        <TouchableOpacity
          onPress={handleDone}
          activeOpacity={0.6}
          className="absolute right-0 p-3"
        >
          <Text className="text-sm font-semibold text-violet-700 dark:text-violet-400">
            Done
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between py-4">
        <Text className="font-bold text-blue-600 dark:text-blue-400">
          {resultsCount} Results
        </Text>
        {activeFilterCount > 0 && (
          <View className="rounded-full px-3 py-1 bg-green-100 dark:bg-neutral-800">
            <Text className="text-xs font-semibold text-green-800 dark:text-green-500">
              {activeFilterCount}{' '}
              {activeFilterCount === 1 ? 'Filter' : 'Filters'}
            </Text>
          </View>
        )}
      </View>

      {errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={
            showCharactersSection && !isLoading ? loadNextPage : undefined
          }
          onEndReachedThreshold={0.5}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          ListFooterComponent={
            isLoadingMore ? (
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

export default AdvancedSearchResultsScreen;
