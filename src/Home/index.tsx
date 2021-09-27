import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {
  AddIcon,
  Box,
  Circle,
  Divider,
  HStack,
  SearchIcon,
  useToast,
  VStack,
} from 'native-base';
import { ScrollView } from 'react-native';
import { Tile } from './tile';
import { ModalSelection } from './ModalSelection';
import { API_URL } from '../constants';
import { Game } from '../interface';

export function Home({ navigation, player }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const toast = useToast();

  const navigateToGameState = (id: number) => {
    navigation.navigate('GameState', {
      gameId: id,
    });
  };

  const navigateToGameSelector = () => {
    navigation.navigate('GameSelector');
  };

  const navigateToUserAccount = () => {
    navigation.navigate('Account');
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
        <ModalSelection
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
            <Tile
              bgLinearColors={['emerald.400', 'lime.200']}
              heading="My Games"
              onPress={() => navigateToGameSelector()}
              body={
                <Circle size={60} bg="emerald.400">
                  <FontAwesome name="list-alt" size={30} color="white" />
                </Circle>
              }
            />
          </HStack>
          <HStack space={3} justifyContent="space-between">
            <Tile
              bgLinearColors={['fuchsia.800', 'pink.300']}
              onPress={() => navigateToUserAccount()}
              heading="My profile"
              body={
                <Circle size={60} bg="fuchsia.800">
                  <FontAwesome name="user-secret" size={30} color="white" />
                </Circle>
              }
            />
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
