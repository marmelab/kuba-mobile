import { Box, Stack, Text } from 'native-base';
import React from 'react';

export function GameInfo(props: any) {
  const game = props.game;
  return (
    <Box
      shadow={1}
      bg={{
        linearGradient: {
          colors: ['orange.400', 'amber.400'],
          start: [0, 0],
          end: [1, 0],
        },
      }}
    >
      <Stack p={4} space={2}>
        <Text fontSize="lg" bold color="black">
          {game?.currentPlayerId === props.currentPlayer.id
            ? 'Your turn !'
            : 'Opponent turn !'}
        </Text>
      </Stack>
    </Box>
  );
}
