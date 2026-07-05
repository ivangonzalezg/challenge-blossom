import { ApolloProvider } from '@apollo/client';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from '@/app/navigation/root-navigator';
import AnimatedSplashScreen from '@/app/splash/animated-splash-screen';
import { useAppReady } from '@/app/splash/use-app-ready';
import {
  FavoritesProvider,
  HiddenCharactersProvider,
} from '@/entities/character';
import { graphqlClient } from '@/shared/api';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isReady } = useAppReady();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const handleSplashExitComplete = useCallback(() => {
    setIsSplashVisible(false);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={
          isSplashVisible || isDarkMode ? 'light-content' : 'dark-content'
        }
      />
      <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.select({
            ios: 'padding',
            android: 'height',
          })}
        >
          <RootNavigator />
        </KeyboardAvoidingView>
      </SafeAreaView>
      {isSplashVisible && (
        <AnimatedSplashScreen
          isReady={isReady}
          onExitComplete={handleSplashExitComplete}
        />
      )}
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ApolloProvider client={graphqlClient}>
      <FavoritesProvider>
        <HiddenCharactersProvider>
          <AppContent />
        </HiddenCharactersProvider>
      </FavoritesProvider>
    </ApolloProvider>
  );
}

export default App;
