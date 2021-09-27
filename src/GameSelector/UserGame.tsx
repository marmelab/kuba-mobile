import { Box, HStack, Text, VStack } from 'native-base';
import React from 'react';
import { Pressable } from 'react-native';
import { Board } from '../GameState/Board';
import { Game } from '../interface';

interface UserGameProps {
  navigateToGameState: (id: number | undefined) => void;
  game: Game | undefined;
}

const GRADIENT_COLORS: any = [];
GRADIENT_COLORS[0] = {
  background: ['orange.400', 'amber.400'],
  foreground: 'black',
};
GRADIENT_COLORS[1] = {
  background: ['emerald.400', 'lime.400'],
  foreground: 'black',
};
GRADIENT_COLORS[2] = {
  background: ['error.600', 'danger.300'],
  foreground: 'black',
};

export const UserGame = ({ game, navigateToGameState }: UserGameProps) => {
  const getGradientColor = (bool: boolean) => {
    if (bool) {
      return GRADIENT_COLORS[1];
    }
    return GRADIENT_COLORS[0];
  };

  const colors = getGradientColor(!!game?.hasWinner);
  return (
    <Box
      bg={{
        linearGradient: {
          colors: colors.background,
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
          <VStack justifyContent="space-between">
            <Text color={colors.foreground} bold>
              Game #{game?.id}
            </Text>
            <Text color={colors.foreground}>Versus Player #Other</Text>
            <Text
              fontSize="xs"
              color={colors.foreground}
              alignSelf="flex-start"
            >
              Game.timeStamp
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    </Box>
  );
};
