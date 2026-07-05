import { Text, TextInput, useColorScheme, View } from 'react-native';

function CharactersListScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
      <Text className="text-neutral-950 dark:text-neutral-50">
        Characters List
      </Text>
      <TextInput
        className="mt-4 w-4/5 rounded-lg border border-neutral-200 px-3 py-2 text-neutral-950 dark:border-neutral-800 dark:text-neutral-50"
        placeholder="Search characters"
        placeholderTextColor={isDarkMode ? '#a3a3a3' : '#737373'}
      />
    </View>
  );
}

export default CharactersListScreen;
