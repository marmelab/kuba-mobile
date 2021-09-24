import React from 'react';
import { UserType } from '../types';
import { Box, Button, VStack, Heading, HStack, View, Flex } from 'native-base';

export const UserTab = (props: {
  user: UserType;
  setUser: Function;
  initUser: Function;
}) => {
  return (
    <Flex flex={1}>
      <View p={4} flex={1} height="100%">
        <VStack space={5}>
          <Heading size="lg" color="primary.500" mb={6}>
            Your account details :
          </Heading>
          <HStack space={2}>
            <Box mb={2} mr={2}>
              username:
            </Box>
            <Box>{props.user.username}</Box>
          </HStack>

          <HStack space={2}>
            <Box mb={2} mr={2}>
              email:
            </Box>
            <Box>{props.user.email}</Box>
          </HStack>

          <VStack space={1} mt={5}>
            <Button
              colorScheme="cyan"
              _text={{ color: 'white' }}
              onPress={() => {
                props.setUser(props.initUser);
              }}
            >
              Logout
            </Button>
          </VStack>
        </VStack>
      </View>
    </Flex>
  );
};
