import { Box, HStack, Stack, Text, VStack } from 'native-base';
import React from 'react';
import { Marble } from './Marble';

export function GameInfo(props: any) {
  const game = props.game;
  const getCurrentPlayer = game.players.find(
    (p: any) => p.playerId === game.currentPlayerId,
  );
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
      <HStack
        p={4}
        space={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="lg" bold color="black">
          {game?.currentPlayerId === props.currentPlayer.id
            ? 'Your turn !'
            : 'Opponent turn !'}
        </Text>
        <Marble value={getCurrentPlayer.marbleColor} size={8} />
      </HStack>
    </Box>
  );
}
