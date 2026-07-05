import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
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
  useCharactersList,
  useFavoriteCharacters,
  type Character,
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

function AdvancedSearchResultsScreen({
  route,
  navigation,
}: AdvancedSearchResultsScreenProps) {
  const { charactersFilter, specieFilter } = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const activeFilterCount =
    (charactersFilter !== '' && charactersFilter !== 'all' ? 1 : 0) +
    (specieFilter !== '' && specieFilter !== 'all' ? 1 : 0);

  const speciesQueryValue =
    specieFilter === 'human' || specieFilter === 'alien'
      ? SPECIE_API_VALUES[specieFilter]
      : undefined;

  const {
    characters,
    totalCount,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMoreErrorMessage,
    loadNextPage,
  } = useCharactersList(undefined, speciesQueryValue);
  const { favoriteCharacters, favoriteIds, toggleFavorite } =
    useFavoriteCharacters();

  const nonFavoriteCharacters = characters.filter(
    character => !favoriteIds.has(character.id),
  );
  const starredCharacters = speciesQueryValue
    ? favoriteCharacters.filter(
        character => character.species === speciesQueryValue,
      )
    : favoriteCharacters;

  const showStarredSection = charactersFilter !== 'others';
  const showCharactersSection = charactersFilter !== 'starred';

  const charactersSectionCount = speciesQueryValue
    ? nonFavoriteCharacters.length
    : Math.max(0, totalCount - favoriteIds.size);

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

  function renderStarredFooter() {
    if (starredCharacters.length > 0) return null;
    return <SectionFooterMessage>No matches</SectionFooterMessage>;
  }

  function renderCharactersFooter() {
    if (isLoading) return <SectionFooterSpinner />;
    if (nonFavoriteCharacters.length === 0) {
      return <SectionFooterMessage>No matches</SectionFooterMessage>;
    }
    return null;
  }

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="relative flex justify-center py-4 my-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
          onPress={() => navigation.popToTop()}
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
          onEndReached={
            showCharactersSection && !isLoading ? loadNextPage : undefined
          }
          onEndReachedThreshold={0.5}
          renderSectionHeader={({ section }) => (
            <SectionHeader
              title={section.title}
              count={
                section.title === STARRED_SECTION_TITLE
                  ? starredCharacters.length
                  : charactersSectionCount
              }
            />
          )}
          renderSectionFooter={({ section }) =>
            section.title === STARRED_SECTION_TITLE
              ? renderStarredFooter()
              : renderCharactersFooter()
          }
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
