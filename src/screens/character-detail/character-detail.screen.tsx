import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import type { RootStackParamList } from '@/app/navigation/root-navigator';
import { useCharacter, useIsFavorite } from '@/entities/character';
import { AvatarImage, colors } from '@/shared/ui';

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

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-neutral-950"
      contentContainerClassName="px-6 flex-1"
    >
      <View className="flex justify-center relative h-16">
        <Pressable onPress={navigation.goBack} className="absolute p-3 -left-3">
          <ArrowLeft
            color={isDarkMode ? colors.neutral400 : colors.gray900}
            size={24}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : errorMessage || !character ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-gray-500 dark:text-neutral-400">
            {errorMessage ?? 'Character not found'}
          </Text>
        </View>
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
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default CharacterDetailScreen;
