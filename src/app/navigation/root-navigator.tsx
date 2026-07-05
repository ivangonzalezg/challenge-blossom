import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import CharactersListScreen from '@/screens/characters-list/characters-list.screen';

export type RootStackParamList = {
  CharactersList: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
