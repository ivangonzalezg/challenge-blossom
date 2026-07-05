import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import type {
  CharactersFilter,
  GenderFilter,
  SpecieFilter,
  StatusFilter,
} from '@/app/navigation/root-navigator';
import { colors } from '@/shared/ui';
import { ArrowLeft } from 'lucide-react-native';

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

const STATUS_FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Alive', value: 'alive' },
  { label: 'Dead', value: 'dead' },
  { label: 'Unknown', value: 'unknown' },
];

const GENDER_FILTER_OPTIONS: { label: string; value: GenderFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Genderless', value: 'genderless' },
  { label: 'Unknown', value: 'unknown' },
];

type FilterPillProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  fill?: boolean;
};

function FilterPill({
  label,
  isSelected,
  onPress,
  fill = true,
}: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`py-3 items-center justify-center rounded-lg ${
        fill ? 'flex-1' : 'px-4'
      } ${
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

type FilterSectionProps<T extends string> = {
  title: string;
  options: { label: string; value: T }[];
  selectedValue: T | '';
  onSelect: (value: T) => void;
  wrap?: boolean;
  isFirst?: boolean;
};

function FilterSection<T extends string>({
  title,
  options,
  selectedValue,
  onSelect,
  wrap = false,
  isFirst = false,
}: FilterSectionProps<T>) {
  return (
    <View className={`gap-2 ${isFirst ? 'pt-4' : 'pt-6'}`}>
      <Text className="text-gray-500 dark:text-neutral-400">{title}</Text>
      <View
        className={`flex-row gap-3 ${wrap ? 'flex-wrap justify-between' : ''}`}
      >
        {options.map(option => (
          <FilterPill
            key={option.value}
            label={option.label}
            isSelected={selectedValue === option.value}
            onPress={() => onSelect(option.value)}
            fill={!wrap}
          />
        ))}
      </View>
    </View>
  );
}

type CharacterFiltersSheetContentProps = {
  charactersFilter: CharactersFilter | '';
  onChangeCharactersFilter: (value: CharactersFilter) => void;
  specieFilter: SpecieFilter | '';
  onChangeSpecieFilter: (value: SpecieFilter) => void;
  statusFilter: StatusFilter | '';
  onChangeStatusFilter: (value: StatusFilter) => void;
  genderFilter: GenderFilter | '';
  onChangeGenderFilter: (value: GenderFilter) => void;
  onApply: () => void;
  onClose: () => void;
};

function CharacterFiltersSheetContent({
  charactersFilter,
  onChangeCharactersFilter,
  specieFilter,
  onChangeSpecieFilter,
  statusFilter,
  onChangeStatusFilter,
  genderFilter,
  onChangeGenderFilter,
  onApply,
  onClose,
}: CharacterFiltersSheetContentProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const isFilterActive =
    charactersFilter !== '' ||
    specieFilter !== '' ||
    statusFilter !== '' ||
    genderFilter !== '';

  return (
    <View className="flex-1 bg-white px-6 dark:bg-neutral-950">
      <View className="relative flex justify-center py-4 my-2">
        <TouchableOpacity
          onPress={() => onClose()}
          activeOpacity={0.6}
          className="absolute -left-3 p-3 z-10"
        >
          <ArrowLeft
            color={isDarkMode ? colors.violet400 : colors.violet700}
            size={24}
          />
        </TouchableOpacity>
        <Text className="text-center font-semibold text-gray-800 dark:text-neutral-50">
          Filters
        </Text>
      </View>

      <FilterSection
        title="Characters"
        options={CHARACTERS_FILTER_OPTIONS}
        selectedValue={charactersFilter}
        onSelect={onChangeCharactersFilter}
        isFirst
      />

      <FilterSection
        title="Specie"
        options={SPECIE_FILTER_OPTIONS}
        selectedValue={specieFilter}
        onSelect={onChangeSpecieFilter}
      />

      <FilterSection
        title="Status"
        options={STATUS_FILTER_OPTIONS}
        selectedValue={statusFilter}
        onSelect={onChangeStatusFilter}
      />

      <FilterSection
        title="Gender"
        options={GENDER_FILTER_OPTIONS}
        selectedValue={genderFilter}
        onSelect={onChangeGenderFilter}
        wrap
      />

      <View className="pt-6 pb-4">
        <TouchableOpacity
          onPress={onApply}
          activeOpacity={0.6}
          className="py-3 items-center justify-center rounded-lg"
          style={{
            backgroundColor: isFilterActive ? colors.violet700 : colors.gray100,
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
  );
}

export default CharacterFiltersSheetContent;
