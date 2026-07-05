import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, SlidersVertical } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import type {
  CharactersFilter,
  GenderFilter,
  RootStackParamList,
  SpecieFilter,
  StatusFilter,
} from '@/app/navigation/root-navigator';
import {
  CharacterListItem,
  sortCharactersByName,
  useCharactersList,
  useFavoriteCharacters,
  type Character,
  type NameSortOrder,
} from '@/entities/character';
import {
  BottomSheetModal,
  type BottomSheetModalRef,
  colors,
  ErrorMessage,
  SectionFooterMessage,
  SectionFooterSpinner,
  SectionHeader,
} from '@/shared/ui';
import CharacterFiltersSheetContent from './character-filters-sheet-content';

const SEARCH_DEBOUNCE_MS = 400;

const STARRED_SECTION_TITLE = 'Starred Characters';
const CHARACTERS_SECTION_TITLE = 'Characters';

type CharactersListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CharactersList'
>;

function CharactersListScreen({
  navigation,
  route,
}: CharactersListScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [starredSortOrder, setStarredSortOrder] =
    useState<NameSortOrder>('asc');
  const isSearching = searchText.length > 0;

  const [charactersFilter, setCharactersFilter] = useState<
    CharactersFilter | ''
  >('');
  const [specieFilter, setSpecieFilter] = useState<SpecieFilter | ''>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter | ''>('');
  const [genderFilter, setGenderFilter] = useState<GenderFilter | ''>('');

  const filtersSheetRef = useRef<BottomSheetModalRef>(null);

  useEffect(() => {
    if (route.params?.reopenFilters) {
      filtersSheetRef.current?.present();
      navigation.setParams({ reopenFilters: undefined });
    }
  }, [route.params?.reopenFilters, navigation]);

  useEffect(() => {
    if (route.params?.clearFilters) {
      setCharactersFilter('');
      setSpecieFilter('');
      setStatusFilter('');
      setGenderFilter('');
      navigation.setParams({ clearFilters: undefined });
    }
  }, [route.params?.clearFilters, navigation]);

  const handleApplyFilters = useCallback(() => {
    filtersSheetRef.current?.dismiss();
    navigation.navigate('AdvancedSearchResults', {
      charactersFilter,
      specieFilter,
      statusFilter,
      genderFilter,
    });
  }, [navigation, charactersFilter, specieFilter, statusFilter, genderFilter]);

  const handlePresentFilters = useCallback(() => {
    filtersSheetRef.current?.present();
  }, []);

  const handleCloseFilters = useCallback(() => {
    filtersSheetRef.current?.dismiss();
  }, []);

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

  const renderStarredFooter = useCallback(() => {
    if (starredCharacters.length > 0) return null;
    return (
      <SectionFooterMessage>
        {isSearching ? 'No matches' : 'No favorites yet'}
      </SectionFooterMessage>
    );
  }, [starredCharacters.length, isSearching]);

  const renderCharactersFooter = useCallback(() => {
    if (isSearchLoading) return <SectionFooterSpinner />;
    if (isSearching && nonFavoriteCharacters.length === 0) {
      return <SectionFooterMessage>No matches</SectionFooterMessage>;
    }
    return null;
  }, [isSearchLoading, isSearching, nonFavoriteCharacters.length]);

  const handleToggleStarredSort = useCallback(() => {
    setStarredSortOrder(previous => (previous === 'asc' ? 'desc' : 'asc'));
  }, []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <SectionHeader
        title={section.title}
        count={
          section.title === STARRED_SECTION_TITLE
            ? starredCharacters.length
            : charactersCount
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
      charactersCount,
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

  const keyExtractor = useCallback((character: Character) => character.id, []);

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
          <TouchableOpacity onPress={handlePresentFilters} activeOpacity={0.6}>
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
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={isSearchLoading ? undefined : loadNextPage}
          onEndReachedThreshold={0.5}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
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

      <BottomSheetModal ref={filtersSheetRef}>
        <CharacterFiltersSheetContent
          charactersFilter={charactersFilter}
          onChangeCharactersFilter={setCharactersFilter}
          specieFilter={specieFilter}
          onChangeSpecieFilter={setSpecieFilter}
          statusFilter={statusFilter}
          onChangeStatusFilter={setStatusFilter}
          genderFilter={genderFilter}
          onChangeGenderFilter={setGenderFilter}
          onApply={handleApplyFilters}
          onClose={handleCloseFilters}
        />
      </BottomSheetModal>
    </View>
  );
}

export default CharactersListScreen;
