import React, { useEffect, useState } from 'react';
import {
  AddIcon,
  Box,
  Circle,
  Divider,
  HStack,
  SearchIcon,
  Spinner,
  useToast,
  VStack,
  Text,
  Button,
  Stack,
  Center,
} from 'native-base';
import { ScrollView } from 'react-native';
import { Tile } from './Tile';
import { ModalGameJoin } from './ModalGameJoin';
import { API_URL } from '../constants';
import { Game } from '../interface';
import { useNavigation } from '../navigation/useNavigation';
import { useIsFocused } from '@react-navigation/native';
import { UserGame } from '../GameSelector/UserGame';

export function Home({ navigation, player }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userLastGames, setUserLastGame] = useState<Game[]>();
  const toast = useToast();
  const { navigateToGameState, navigateToGameSelector } =
    useNavigation(navigation);
  const isFocused = useIsFocused();

  useEffect(() => {
    getLastGames();
  }, [isFocused]);

  const getLastGames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/games?range=${encodeURI(
          JSON.stringify([0, 2]),
        )}&sort=${encodeURI(JSON.stringify(['id', 'DESC']))}&filter=${encodeURI(
          JSON.stringify({ playerId: [player.id] }),
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + player.token,
          },
        },
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = (await response.json()).data as Game[];
      setUserLastGame(json);
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: `The last game can't be loaded`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/games/${gameId}/join`, {
        method: 'PUT',
        body: JSON.stringify({ playerId: player.id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + player.token,
        },
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = (await response.json()) as Game;
      if (json.id) {
        navigateToGameState(json.id);
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: `The game can't be joined`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        body: JSON.stringify({ playerId: player.id }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + player.token,
        },
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = (await response.json()) as Game;
      if (json.id) {
        navigateToGameState(json.id);
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: `The game can't be started`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={'white'} pt={12} flex={1}>
      <ScrollView contentContainerStyle={{ width: '100%', height: '100%' }}>
        <ModalGameJoin
          showModal={showModal}
          setShowModal={setShowModal}
          joinGame={joinGame}
        />
        <VStack p={4} space={3} divider={<Divider />} w="100%">
          <HStack space={3} justifyContent="space-between">
            <Tile
              bgLinearColors={['orange.400', 'amber.200']}
              heading={{ title: 'New game', color: 'black' }}
              onPress={() => startNewGame()}
              body={
                <Circle size={60} bg="orange.400">
                  <AddIcon size={6} color="white" />
                </Circle>
              }
            />
            <Tile
              bgLinearColors={['blue.800', 'lightBlue.300']}
              heading={{ title: 'Join Game', color: 'white' }}
              onPress={() => setShowModal(true)}
              body={
                <Circle size={60} bg="blue.400">
                  <SearchIcon size={6} color="white" />
                </Circle>
              }
            />
          </HStack>

          <HStack space={3} justifyContent="space-between">
            {isLoading ? (
              <Center flex={1}>
                <Spinner size="lg" />
              </Center>
            ) : !!userLastGames?.length ? (
              <Box width={'100%'}>
                <Text bold fontSize="lg">
                  My last games
                </Text>
                {userLastGames?.map((game) => (
                  <UserGame
                    game={game}
                    mobilePlayer={player}
                    navigateToGameState={navigateToGameState}
                    key={game.id}
                  />
                ))}
                <Stack
                  direction={{
                    base: 'column',
                    md: 'row',
                  }}
                  space={2}
                  mx={{
                    base: 'auto',
                    md: '0',
                  }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() => navigateToGameSelector()}
                  >
                    SEE ALL GAMES
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box
                background="red.700"
                shadow={1}
                p={6}
                width={'100%'}
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
                  You don't have any games yet
                </Text>
              </Box>
            )}
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
