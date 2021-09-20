import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { HomeScreen } from './src/Home';
import { LoginScreen } from './src/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = React.useState(false);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!isConnected ? (
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setConn={setIsConnected} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
