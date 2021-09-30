import { Box, HStack, Text, VStack } from 'native-base';
import React from 'react';
import { Pressable } from 'react-native';
import { Board } from '../GameState/Board';
import { Game } from '../interface';
import { getGameStatusColor } from './gameStatusColors';

interface UserGameProps {
  navigateToGameState: (id: number | undefined) => void;
  game: Game | undefined;
  mobilePlayer: any;
}

const getDateFormat = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

export const UserGame = ({
  game,
  navigateToGameState,
  mobilePlayer,
}: UserGameProps) => {
  const colors = getGameStatusColor(mobilePlayer, game?.winnerId);
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
          <Board board={game?.board} preview />
          <VStack justifyContent="space-around">
            <Text color={colors.foreground} bold>
              Game #{game?.id}
            </Text>
            <Text color={colors.foreground}>
              Last move:
              {getDateFormat(game?.lastMoveDate as string)}
            </Text>
            <Text
              fontSize="xs"
              color={colors.foreground}
              alignSelf="flex-start"
            >
              Creation date:
              {getDateFormat(game?.creationDate as string)}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    </Box>
  );
};
