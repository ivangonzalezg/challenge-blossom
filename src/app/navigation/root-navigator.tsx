import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import CharacterDetailScreen from '@/screens/character-detail/character-detail.screen';
import CharactersListScreen from '@/screens/characters-list/characters-list.screen';

export type RootStackParamList = {
  CharactersList: undefined;
  CharacterDetail: { characterId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName="CharactersList"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CharactersList" component={CharactersListScreen} />
        <Stack.Screen
          name="CharacterDetail"
          component={CharacterDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
