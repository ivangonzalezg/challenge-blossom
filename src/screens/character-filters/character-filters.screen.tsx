import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  CharactersFilter,
  RootStackParamList,
  SpecieFilter,
} from '@/app/navigation/root-navigator';
import { colors } from '@/shared/ui';

type CharacterFiltersScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CharacterFilters'
>;

const CHARACTERS_FILTER_OPTIONS: { label: string; value: CharactersFilter }[] =
  [
    { label: 'All', value: 'all' },
    { label: 'Starred', value: 'starred' },
    { label: 'Others', value: 'others' },
  ];

const SPECIE_FILTER_OPTIONS: { label: string; value: SpecieFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Human', value: 'human' },
  { label: 'Alien', value: 'alien' },
];

type FilterPillProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

function FilterPill({ label, isSelected, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`py-3 flex-1 items-center justify-center rounded-lg ${
        isSelected
          ? ''
          : 'border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
      }`}
      style={isSelected ? { backgroundColor: colors.violet100 } : undefined}
    >
      <Text
        className={`text-sm font-semibold ${
          isSelected ? '' : 'text-gray-900 dark:text-neutral-50'
        }`}
        style={isSelected ? { color: colors.violet700 } : undefined}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function CharacterFiltersScreen({ navigation }: CharacterFiltersScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [charactersFilter, setCharactersFilter] = useState<
    CharactersFilter | ''
  >('');
  const [specieFilter, setSpecieFilter] = useState<SpecieFilter | ''>('');

  const isFilterActive = charactersFilter !== '' || specieFilter !== '';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
        <View className="relative flex justify-center py-4 my-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            className="absolute -left-3 p-3 z-10"
          >
            <ArrowLeft
              color={isDarkMode ? colors.neutral400 : colors.violet700}
              size={24}
            />
          </TouchableOpacity>
          <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">
            Filters
          </Text>
        </View>

        <View className="gap-2 pt-4">
          <Text className="text-gray-500 dark:text-neutral-400">
            Characters
          </Text>
          <View className="flex-row gap-3">
            {CHARACTERS_FILTER_OPTIONS.map(option => (
              <FilterPill
                key={option.value}
                label={option.label}
                isSelected={charactersFilter === option.value}
                onPress={() => setCharactersFilter(option.value)}
              />
            ))}
          </View>
        </View>

        <View className="gap-2 pt-6">
          <Text className="text-gray-500 dark:text-neutral-400">Specie</Text>
          <View className="flex-row gap-3">
            {SPECIE_FILTER_OPTIONS.map(option => (
              <FilterPill
                key={option.value}
                label={option.label}
                isSelected={specieFilter === option.value}
                onPress={() => setSpecieFilter(option.value)}
              />
            ))}
          </View>
        </View>

        <View className="flex-1" />

        <View className="">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AdvancedSearchResults', {
                charactersFilter,
                specieFilter,
              })
            }
            activeOpacity={0.6}
            className="py-3 items-center justify-center rounded-lg"
            style={{
              backgroundColor: isFilterActive
                ? colors.violet700
                : colors.gray100,
            }}
          >
            <Text
              className={`text-sm font-medium ${
                isFilterActive ? 'text-white' : 'text-gray-500'
              }`}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CharacterFiltersScreen;
