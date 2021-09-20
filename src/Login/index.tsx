import React from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  Heading,
  VStack,
  useToast,
} from 'native-base';
import Constants from 'expo-constants';

const API_URL = Constants?.manifest?.extra?.API_URL;

export const LoginScreen = (props: LoginProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<errorMessage>();

  const toast = useToast();

  const handlePasswordShow = () => setShow(!show);

  const handleLogin = async (usernameValue: string, passwordValue: string) => {
    setIsLoading(true);
    const details = await login(usernameValue, passwordValue);
    if (details) {
      toast.show({
        title: 'Logged In',
        status: 'success',
        description: 'Enjoy !',
      });
      setIsLoading(false);
      return props.setPlayer({
        id: details.id,
        token: details.token,
        isConnected: true,
      });
    }
    setIsLoading(false);
    return setErrorMessage("Your email and your password don't match");
  };

  return (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Heading size="lg" color="primary.500">
        Kuba Mobile
      </Heading>
      <Heading color="muted.400" size="xs">
        Sign in to play !
      </Heading>

      <VStack space={2} mt={5}>
        <FormControl isInvalid={!!errorMessage}>
          <FormControl.Label
            _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
          >
            Email
          </FormControl.Label>
          <Input
            value={username}
            onChangeText={(inputValue) => setUsername(inputValue)}
          />
        </FormControl>
        <FormControl mb={5} isInvalid={!!errorMessage}>
          <FormControl.Label
            _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
          >
            Password
          </FormControl.Label>
          <Input
            type={show ? 'text' : 'password'}
            value={password}
            onChangeText={(inputValue) => setPassword(inputValue)}
            InputRightElement={
              <Button
                ml={1}
                roundedLeft={0}
                roundedRight="md"
                onPress={handlePasswordShow}
              >
                {show ? 'Hide' : 'Show'}
              </Button>
            }
          />
          <FormControl.ErrorMessage
            _text={{ fontSize: 'xl', color: 'error.500', fontWeight: 500 }}
          >
            {errorMessage ? errorMessage : null}
          </FormControl.ErrorMessage>
        </FormControl>
        <VStack space={2}>
          <Button
            colorScheme="cyan"
            _text={{ color: 'white' }}
            onPress={() => {
              handleLogin(username.toLowerCase(), password);
            }}
            isLoading={isLoading}
          >
            Login
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status >= 200 && response.status < 300) {
      const details = await response.json();
      return details;
    }
    return false;
  } catch (error) {}
};

type LoginProps = {
  setPlayer: Function;
};

type errorMessage = string | null;
