import {
  Heading,
  Box,
  HStack,
  Flex,
  CheckIcon,
  SmallCloseIcon,
  Stack,
  View,
  Text,
  Button,
} from 'native-base';
import React from 'react';
import { Board } from '../GameState/Board';
import { Game } from '../interface';

interface UserGamesListProps {
  navigateToGameState: (id: number) => void;
  userGames: Game[] | undefined;
}

export const UserGamesList = ({
  userGames,
  navigateToGameState,
}: UserGamesListProps) => {
  return (
    <View>
      <Heading size="lg" color="primary.500" mt={4} mb={4}>
        User games
      </Heading>
      {!userGames?.length && (
        <Box
          background="red.700"
          shadow={1}
          p={6}
          bg={{
            linearGradient: {
              colors: ['red.400', 'red.100'],
              start: [0, 0],
              end: [1, 0],
            },
          }}
          rounded="lg"
        >
          <Text bold color="white">
            No games was found
          </Text>
        </Box>
      )}

      {userGames &&
        userGames?.map((game) => (
          <Box
            shadow={3}
            mb={4}
            width="100%"
            rounded="lg"
            key={game.id}
            bg="white"
          >
            <HStack
              alignItems="center"
              justifyContent="center"
              bg={{
                linearGradient: {
                  colors: ['cyan.400', 'cyan.100'],
                  start: [0, 0],
                  end: [1, 0],
                },
              }}
              rounded="lg"
            >
              <Board board={game?.board} preview={true} />
            </HStack>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              p={4}
              space={2}
            >
              <Text fontSize="lg" bold color="black">
                Game #{game?.id}
              </Text>
              <Flex alignItems="center" direction="row">
                <Text fontSize="lg" bold color="black" pr={2}>
                  Has Winner:
                </Text>
                {game?.hasWinner ? (
                  <CheckIcon color="green.600" />
                ) : (
                  <SmallCloseIcon color="red.600" />
                )}
              </Flex>
            </HStack>
            <Stack p={4} space={2}>
              {game?.players?.map((player) => (
                <Text
                  fontSize="md"
                  bold
                  color="black"
                  key={player?.playerNumber}
                >
                  Player #{player?.playerNumber}
                </Text>
              ))}
            </Stack>
            <Stack>
              <Button
                onPress={() => navigateToGameState(game.id)}
                colorScheme="cyan"
              >
                Go !
              </Button>
            </Stack>
          </Box>
        ))}
    </View>
  );
};
