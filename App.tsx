import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { LoginScreen } from './src/Login';
import GameSelector from './src/GameSelector';
import GameState from './src/GameState';
import { User } from './src/interface';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  GameSelector: { player: User } | undefined;
  GameState: { gameId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const config = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient,
  },
};

export default function App() {
  const [player, setPlayer] = React.useState<User>({
    id: null,
    token: null,
    isConnected: false,
  });

  return (
    <NativeBaseProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator>
          {!player.isConnected ? (
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setPlayer={setPlayer} />}
            </Stack.Screen>
          ) : (
            <React.Fragment>
              <Stack.Screen name="GameSelector">
                {(props) => <GameSelector {...props} player={player} />}
              </Stack.Screen>
              <Stack.Screen name="GameState">
                {(props) => <GameState {...props} />}
              </Stack.Screen>
            </React.Fragment>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
