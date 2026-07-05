import { Heart } from 'lucide-react-native';
import { Text, useColorScheme, View } from 'react-native';
import type { Character } from '@/entities/character/model/character.types';
import { AvatarImage, colors } from '@/shared/ui';

type CharacterListItemProps = {
  character: Character;
};

function CharacterListItem({ character }: CharacterListItemProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View className="flex-row items-center gap-4 py-4 border-t-[1px] border-t-gray-200 dark:border-t-neutral-800">
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
      <Heart
        color={isDarkMode ? colors.neutral600 : colors.gray300}
        size={24}
      />
    </View>
  );
}

export default CharacterListItem;
