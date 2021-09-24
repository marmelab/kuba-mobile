import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { LoginScreen } from './src/Login';
import GameSelector from './src/GameSelector';
import { UserType } from './src/types';
import { UserTab } from './src/UserTab';

import GameState from './src/GameState';
import { User } from './src/interface';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  account: undefined;
  GameSelector: { player: User } | undefined;
  GameState: { gameId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const bottomNav = createBottomTabNavigator<RootStackParamList>();

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

  const HomeTabs = () => {
    return (
      <bottomNav.Navigator>
        <bottomNav.Screen name="GameSelector">
          {(props) => (
            <GameSelector {...props} player={user} setUser={setUser} />
          )}
        </bottomNav.Screen>

        <bottomNav.Screen name="account">
          {(props) => (
            <UserTab
              {...props}
              user={user}
              setUser={setUser}
              initUser={initUser}
            />
          )}
        </bottomNav.Screen>
      </bottomNav.Navigator>
    );
  };

  return (
    <NativeBaseProvider config={config}>
      <NavigationContainer>
        {user.isConnected ? (
          <>
            {/* <bottomNav.Navigator>
              <bottomNav.Screen name="GameSelector">
                {(props) => (
                  <GameSelector {...props} player={user} setUser={setUser} />
                )}
              </bottomNav.Screen>

              <bottomNav.Screen name="GameState">
                {(props) => <GameState {...props} player={user} />}
              </bottomNav.Screen>

              <bottomNav.Screen name="account">
                {(props) => (
                  <UserTab
                    {...props}
                    user={user}
                    setUser={setUser}
                    initUser={initUser}
                  />
                )}
              </bottomNav.Screen>
            </bottomNav.Navigator> */}
            <Stack.Navigator>
              <Stack.Screen
                name="GameSelector"
                component={HomeTabs}
              ></Stack.Screen>
              <Stack.Screen name="GameState">
                {(props) => <GameState {...props} player={user} />}
              </Stack.Screen>
            </Stack.Navigator>
          </>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
