import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import type {
  CharactersFilter,
  GenderFilter,
  SpecieFilter,
  StatusFilter,
  VisibilityFilter,
} from '@/entities/character';
import AdvancedSearchResultsScreen from '@/screens/advanced-search-results/advanced-search-results.screen';
import CharacterDetailScreen from '@/screens/character-detail/character-detail.screen';
import CharactersListScreen from '@/screens/characters-list/characters-list.screen';

export type RootStackParamList = {
  CharactersList:
    { reopenFilters?: boolean; clearFilters?: boolean } | undefined;
  CharacterDetail: { characterId: string };
  AdvancedSearchResults: {
    charactersFilter: CharactersFilter | '';
    specieFilter: SpecieFilter | '';
    statusFilter: StatusFilter | '';
    genderFilter: GenderFilter | '';
    visibilityFilter: VisibilityFilter | '';
  };
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
        <Stack.Screen
          name="AdvancedSearchResults"
          component={AdvancedSearchResultsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
