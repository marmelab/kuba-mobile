import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { LoginScreen } from './src/Login';
import GameSelector from './src/GameSelector';
import { UserType } from './src/types';
import { UserTab } from './src/UserTab';

const Stack = createNativeStackNavigator();
const bottomNav = createBottomTabNavigator();

const initUser = () => {
  return {
    id: null,
    token: null,
    username: null,
    email: null,
    isConnected: false,
  }
}

export default function App() {
  const [user, setUser] = React.useState<UserType>(initUser);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {user.isConnected ? (
          <bottomNav.Navigator>
            <bottomNav.Screen name="Game Selector" component={GameSelector} />

            <bottomNav.Screen name={`Account`}>
              {(props) => <UserTab {...props} user={user} setUser={setUser} initUser={initUser} />}
            </bottomNav.Screen>
          </bottomNav.Navigator>
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
