import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Button, NativeBaseProvider } from 'native-base';
import React from 'react';
import { LoginScreen } from './src/Login';
import GameSelector from './src/GameSelector';
import { UserType } from './src/types';
import { UserTab } from './src/UserTab';

import GameState from './src/GameState';
import { User } from './src/interface';
import { Pressable } from 'react-native';
import { Home } from './src/Home';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Account: undefined;
  GameSelector: { player: User } | undefined;
  GameState: { gameId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const config = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient,
  },
};

const initUser = (): UserType => ({
  id: null,
  token: null,
  username: null,
  email: null,
  isConnected: false,
});

export default function App() {
  const [user, setUser] = React.useState<UserType>(initUser);

  return (
    <NativeBaseProvider config={config}>
      <NavigationContainer>
        {user.isConnected ? (
          <>
            <Stack.Navigator>
              <Stack.Screen
                name="GameSelector"
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Pressable onPress={() => navigation.navigate('Account')}>
                      <Avatar bg="green.500" mr={4} size="sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Pressable>
                  ),
                })}
              >
                {(props) => (
                  <GameSelector {...props} player={user} setUser={setUser} />
                )}
              </Stack.Screen>
              <Stack.Screen name="GameState">
                {(props) => <GameState {...props} player={user} />}
              </Stack.Screen>
              <Stack.Screen name="Account">
                {(props) => (
                  <UserTab
                    {...props}
                    user={user}
                    setUser={setUser}
                    initUser={initUser}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerTintColor: 'black',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen name="Home">{(props) => <Home />}</Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
