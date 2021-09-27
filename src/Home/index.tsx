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
  const [userLastGame, setUserLastGame] = useState<Game>();
  const toast = useToast();
  const { navigateToGameState, navigateToGameSelector } =
    useNavigation(navigation);
  const isFocused = useIsFocused();

  useEffect(() => {
    getLastGame();
  }, [isFocused]);

  const getLastGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/games?range=${encodeURI(
          JSON.stringify([0, 1]),
        )}&sort=${encodeURI(JSON.stringify(['id', 'DESC']))}`,
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
      const json = (await response.json()).data[0] as Game;
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
              heading="New game"
              onPress={() => startNewGame()}
              body={
                <Circle size={60} bg="orange.400">
                  <AddIcon size={6} color="white" />
                </Circle>
              }
            />
            <Tile
              bgLinearColors={['blue.800', 'lightBlue.300']}
              heading="Join Game"
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
              <Spinner size="lg" />
            ) : (
              <Box width={'100%'}>
                <Text bold fontSize="lg">
                  My last game
                </Text>
                <UserGame
                  game={userLastGame}
                  navigateToGameState={navigateToGameState}
                />
              </Box>
            )}
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
