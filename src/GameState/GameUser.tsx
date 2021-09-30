import { Box, Stack, HStack, Heading, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { User } from '../interface';
import { Marble } from './Marble';

export function GameUser(props: any) {
  const user: User = props.user;
  return (
    <Box
      shadow={1}
      width={'50%'}
      bg={{
        linearGradient: {
          colors: ['blue.800', 'blue.600'],
          start: [0, 0],
          end: [1, 0],
        },
      }}
    >
      <Stack p={4}>
        <HStack alignItems="center" justifyContent="space-between" space={4}>
          <Stack>
            <Heading size="sm" ml={-1} color="white">
              {props.opponent
                ? `#${user.username ? user.username : 'Opponent'}`
                : 'Your'}{' '}
              captures:
            </Heading>
          </Stack>
        </HStack>
        <HStack>
          {user?.marblesWon && user?.marblesWon.length > 0 ? (
            <View>
              <HStack style={{ width: '80%', flex: 1, flexWrap: 'wrap' }}>
                {user?.marblesWon?.map((marble, index) => (
                  <Marble value={marble} size={3} key={index} />
                ))}
              </HStack>
            </View>
          ) : (
            <Text color="white">No marbles</Text>
          )}
        </HStack>
      </Stack>
    </Box>
  );
}
