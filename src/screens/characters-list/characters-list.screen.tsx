import { Heart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TextInput, useColorScheme, View } from 'react-native';
import { fetchCharacters } from '@/entities/character';

function CharactersListScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const [debugStatus, setDebugStatus] = useState('Loading characters...');

  useEffect(() => {
    let isMounted = true;

    fetchCharacters(1)
      .then(({ results }) => {
        if (!isMounted) return;
        setDebugStatus(`Loaded ${results.length} characters`);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        console.error(
          '[characters] failed to fetch characters from Rick and Morty GraphQL API:',
          error,
        );
        setDebugStatus('Failed to load characters (see console)');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
      <Text className="text-neutral-950 dark:text-neutral-50">
        Characters List
      </Text>
      <Heart className="text-neutral-950 dark:text-neutral-50" />
      <TextInput
        className="mt-4 w-4/5 rounded-lg border border-neutral-200 px-3 py-2 text-neutral-950 dark:border-neutral-800 dark:text-neutral-50"
        placeholder="Search characters"
        placeholderTextColor={isDarkMode ? '#a3a3a3' : '#737373'}
      />
      <Text className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
        {debugStatus}
      </Text>
    </View>
  );
}

export default CharactersListScreen;
