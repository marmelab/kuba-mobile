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
  GameSelector: undefined;
  account: undefined;
  GameState: { gameId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const bottomNav = createBottomTabNavigator<RootStackParamList>();

const config = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient,
  },
};

const initUser = (): UserType => {
  return {
    id: null,
    token: null,
    username: null,
    email: null,
    isConnected: false,
    currentGameId: null
  }
}
export default function App() {
  const [user, setUser] = React.useState<UserType>(initUser);

  return (
    <NativeBaseProvider config={config}>
      <NavigationContainer>

        {user.isConnected ? (
          <>
            <bottomNav.Navigator>
              <bottomNav.Screen name="GameSelector" component={GameSelector} />
              {user.currentGameId && <bottomNav.Screen name="GameState" component={GameState} />}
              <bottomNav.Screen name="account">
                {(props) => <UserTab {...props} user={user} setUser={setUser} initUser={initUser} />}
              </bottomNav.Screen>
            </bottomNav.Navigator>

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
