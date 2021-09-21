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
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<errorMessage>();

  const toast = useToast();

  const handlePasswordShow = () => setShow(!show);

  const handleLogin = async () => {
    setIsLoading(true);
    const userDetails = await login(email, password);
    if (userDetails) {
      toast.show({
        title: 'Logged In',
        status: 'success',
        description: 'Enjoy !',
      });
      setIsLoading(false);
      return props.setPlayer({
        id: userDetails.id,
        token: userDetails.token,
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
            autoCapitalize="none"
            value={email}
            onChangeText={(inputValue) => setEmail(inputValue)}
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
            onPress={handleLogin}
            isLoading={isLoading}
          >
            Login
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    }
    return false;
  } catch (error) {}
};

type LoginProps = {
  setPlayer: Function;
};

type errorMessage = string | null;
