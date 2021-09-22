import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Box,
  Button,
  Center,
  HStack,
  View,
  Text,
  CheckIcon,
  Flex,
  SmallCloseIcon,
  Stack,
  ScrollView,
  Heading,
  Spinner,
  useToast,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../constant';
import { Board } from '../GameState/Board';
import { Game } from '../interface';

export interface GameSelectorFormData {
  gameId: number;
}

export default function ({ navigation, player }: any) {
  const [userGames, setUserGames] = useState<Game[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorUserGames, setErrorUserGames] = useState<any>();

  const getUserGames = async () => {
    try {
      const response = await fetch(
        `${API_URL}/games?filter=${encodeURI(
          JSON.stringify({ playerNumber: [player.id] }),
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + player.token,
          },
        },
      );
      const json = (await response.json()).data as Game[];
      setUserGames(json);
    } catch (error) {
      const toast = useToast();
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'The games could not be loaded',
      });
      setErrorUserGames(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToGameState = (id: number) => {
    navigation.navigate('GameState', {
      gameId: id,
    });
  };

  useEffect(() => {
    getUserGames();
  }, []);

  const UserGamesList = () => {
    return (
      <ScrollView>
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
      </ScrollView>
    );
  };

  return (
    <Center flex={1}>
      {isLoading ? (
        <View
          height="100%"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          <Spinner size="lg" />
        </View>
      ) : (
        <UserGamesList />
      )}
    </Center>
  );
}
