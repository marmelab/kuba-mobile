import React from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  Heading,
  VStack,
  Link,
} from 'native-base';

export const LoginScreen = (props: LoginProps) => {
  const [show, setShow] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleClick = () => setShow(!show);

  return (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Heading size="lg" color="primary.500">
        Kuba Mobile
      </Heading>
      <Heading color="muted.400" size="xs">
        Sign in to play !
      </Heading>

      <VStack space={2} mt={5}>
        <FormControl>
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
        <FormControl mb={5}>
          <FormControl.Label
            _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}
          >
            Password
          </FormControl.Label>
          <Input
            type="password"
            value={password}
            onChangeText={(inputValue) => setPassword(inputValue)}
          />
        </FormControl>
        <VStack space={2}>
          <Button
            colorScheme="cyan"
            _text={{ color: 'white' }}
            onPress={() => {
              props.setConn(true);
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
