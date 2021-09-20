import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { HomeScreen } from './src/Home';
import { LoginScreen } from './src/Login';

const Stack = createNativeStackNavigator();

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
            <Stack.Screen name="Home" component={HomeScreen} />
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
