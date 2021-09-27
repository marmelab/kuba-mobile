import { Box, HStack, Text, VStack } from 'native-base';
import React from 'react';
import { Pressable } from 'react-native';
import { Board } from '../GameState/Board';
import { Game } from '../interface';

interface UserGameProps {
  navigateToGameState: (id: number | undefined) => void;
  game: Game | undefined;
}

const GRADIENT_COLORS: string[][] = [];
GRADIENT_COLORS[0] = ['orange.400', 'amber.400'];
GRADIENT_COLORS[1] = ['emerald.400', 'lime.300'];
GRADIENT_COLORS[2] = ['error.600', 'danger.200'];

export const UserGame = ({ game, navigateToGameState }: UserGameProps) => {
  const getGradientColor = (bool: boolean) => {
    if (bool) {
      return GRADIENT_COLORS[1];
    }
    return GRADIENT_COLORS[1];
  };

  return (
    <Box
      bg={{
        linearGradient: {
          colors: getGradientColor(!!game?.hasWinner),
          start: [0, 0],
          end: [1, 0],
        },
      }}
      rounded="lg"
      shadow={1}
      p={1}
      mb={4}
      width={'100%'}
    >
      <Pressable onPress={() => navigateToGameState(game?.id)}>
        <HStack space={3}>
          <Board board={game?.board} preview={true} />
          <VStack alignItems="space-between" justifyContent="space-between">
            <Text color="white" bold>
              Game #{game?.id}
            </Text>
            <Text color="light.50">Versus Player #Other</Text>
            <Text fontSize="xs" color="light.100" alignSelf="flex-start">
              Game.timeStamp
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    </Box>
  );
};
