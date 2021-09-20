import React from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  Heading,
  VStack,
  Link,
  Text,
} from 'native-base';

export const LoginScreen = (props: LoginProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<errorMessage>();

  const handlePasswordShow = () => setShow(!show);

  const handleLogin = (usernameValue: string, passwordValue: string) => {
    if (usernameValue === 'alex' && passwordValue === '1234') {
      return props.setConn(true);
    }
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
              handleLogin(username, password);
            }}
          >
            Login
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

type LoginProps = {
  setConn: Function;
};

type errorMessage = string | null;
