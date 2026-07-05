import { Heart } from 'lucide-react-native';
import {
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import type { Character } from '@/entities/character/model/character.types';
import { AvatarImage, colors } from '@/shared/ui';

type CharacterListItemProps = {
  character: Character;
  onPress?: () => void;
  onFavoritePress?: () => void;
};

function CharacterListItem({
  character,
  onPress,
  onFavoritePress,
}: CharacterListItemProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={isDarkMode ? colors.neutral600 : colors.gray300}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${character.species}`}
    >
      <View className="flex-row items-center gap-4 border-t-[1px] border-t-gray-200 bg-white py-4 dark:border-t-neutral-800 dark:bg-neutral-950">
        <AvatarImage
          uri={character.image}
          fallbackLabel={character.name}
          className="size-8 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-neutral-50">
            {character.name}
          </Text>
          <Text className="text-gray-500 dark:text-neutral-400">
            {character.species}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onFavoritePress}
          hitSlop={8}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel={`Favorite ${character.name}`}
        >
          <Heart
            color={isDarkMode ? colors.neutral600 : colors.gray300}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </TouchableHighlight>
  );
}

export default CharacterListItem;
