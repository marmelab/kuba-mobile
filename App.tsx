import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { LoginScreen } from './src/Login';
import GameSelector from './src/GameSelector';
import GameState from './src/GameState';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  GameSelector: undefined;
  GameState: { gameId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [player, setPlayer] = React.useState<Player>({
    id: null,
    token: null,
    isConnected: false,
  });

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!player.isConnected ? (
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setPlayer={setPlayer} />}
            </Stack.Screen>
          ) : (
            <React.Fragment>
              <Stack.Screen name="GameSelector" component={GameSelector} />
              <Stack.Screen name="GameState" component={GameState} />
            </React.Fragment>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

type Player = {
  id: number | null;
  token: string | null;
  isConnected: boolean;
};
