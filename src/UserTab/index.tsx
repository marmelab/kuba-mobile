import React from 'react';
import { UserType } from '../types';
import { Box, Button, VStack, Heading, HStack } from 'native-base';

export const UserTab = (props: { user: UserType, setUser: Function, initUser: Function }) => {

  return (
    <VStack space={5}>
      <Box
        safeArea
        flex={1}
        p={2}
        w="90%"
        mx="auto"
        _text={{
          fontSize: "md",
          fontWeight: "medium",
          letterSpacing: "lg",
        }}>
        <Heading size="lg" color="primary.500" mb={6}>
          Your account details :
        </Heading>
        <HStack space={2}>
          <Box mb={2} mr={2}>
            username:
          </Box>
          <Box>
            {props.user.username}
          </Box>
        </HStack>

        <HStack space={2}>
          <Box mb={2} mr={2}>
            email:
          </Box>
          <Box>
            {props.user.email}
          </Box>
        </HStack>


        <VStack space={1} mt={5} >
          <Button
            colorScheme="cyan"
            _text={{ color: 'white' }}
            onPress={() => { props.setUser(props.initUser) }}
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </VStack>
  )
};
