import { useIsFocused } from '@react-navigation/native';
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
  Fab,
  AddIcon,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../constants';
import { Board } from '../GameState/Board';
import { Game } from '../interface';
import { ModalSelection } from './ModalSelection';
import { UserGamesList } from './UserGamesList';

export interface GameSelectorFormData {
  gameId: number;
}

export default function ({ navigation, player, setUser }: any) {
  const [userGames, setUserGames] = useState<Game[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorUserGames, setErrorUserGames] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const toast = useToast();

  const isFocused = useIsFocused();

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

  const navigateToGameState = (id: number) => {
    navigation.navigate('GameState', {
      gameId: id,
    });
  };

  useEffect(() => {
    getUserGames();
  }, [isFocused]);

  return (
    <ScrollView p={4} flex={1}>
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
        <View>
          <UserGamesList
            userGames={userGames}
            navigateToGameState={navigateToGameState}
          />
          <ModalSelection
            showModal={showModal}
            setShowModal={setShowModal}
            startNewGame={startNewGame}
            joinGame={joinGame}
          />
          <Fab
            borderRadius="full"
            colorScheme="cyan"
            placement="bottom-right"
            onPress={() => {
              setShowModal(true);
            }}
            icon={<AddIcon color="white" size="4" />}
          />
        </View>
      )}
    </ScrollView>
  );
}
