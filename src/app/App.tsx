import { ApolloProvider } from '@apollo/client';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from '@/app/navigation/root-navigator';
import { FavoritesProvider } from '@/entities/character';
import { graphqlClient } from '@/shared/api';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ApolloProvider client={graphqlClient}>
      <FavoritesProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platform.select({ ios: 'padding', android: 'height' })}
            >
              <RootNavigator />
            </KeyboardAvoidingView>
          </SafeAreaView>
        </SafeAreaProvider>
      </FavoritesProvider>
    </ApolloProvider>
  );
}

export default App;
