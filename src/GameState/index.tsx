import {
  ArrowBackIcon,
  Box,
  Flex,
  Heading,
  HStack,
  Modal,
  ScrollView,
  Spinner,
  Stack,
  Text,
  useToast,
  View,
  Button,
  Center,
  VStack,
} from 'native-base';
import React, { useEffect, useReducer, useState } from 'react';
import { API_URL, GATEWAY_URL } from '../constants';
import {
  Game,
  GameInitialization,
  MoveMarbleReference,
  User,
} from '../interface';
import { Board } from './Board';
import { Controls } from './Controls';
import { GameInfo } from './GameInfo';
import { GameUser } from './GameUser';

import { getMarblesCoordinateToAnimate } from './getMarblesCoordinateToAnimate';
import { ModalWin } from './ModalWin';
import { isMovePossible, moveMarble } from './moveFunctions';

const initialState: GameInitialization = {
  players: [],
  game: undefined,
  isLoading: true,
  error: undefined,
  animatedMarble: undefined,
  moveMarbleReference: undefined,
};

const reducer = (
  state: GameInitialization,
  action: { type: string; value: any },
) => {
  return { ...state, [action.type]: action.value };
};

export default function GameState({ navigation, route, player }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const gameId = route.params?.gameId;
  const toast = useToast();
  let WS: any = undefined;

  useEffect(() => {
    getGame();
    initWebSocket();
    return () => {
      if (WS) WS.close();
    };
  }, []);

  useEffect(() => {
    if (!!state.animatedMarble && !!state.moveMarbleReference) {
      moveMarble(state.moveMarbleReference);

      dispatch({ type: 'moveMarbleReference', value: undefined });
    }
  }, [state.animatedMarble]);

  const getGame = async () => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + player.token,
        },
      });
      const json = (await response.json()) as Game;
      dispatch({ type: 'game', value: json });
      if (json.players) {
        const ids = json.players.map((pl) => pl.playerId);
        await getPlayers(ids);
      }
    } catch (error) {
      dispatch({ type: 'error', value: error });
    } finally {
      dispatch({ type: 'isLoading', value: false });
    }
  };

  const getPlayers = async (ids: number[]) => {
    try {
      const response = await fetch(
        `${API_URL}/user?filter=${encodeURI(JSON.stringify({ id: ids }))}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + player.token,
          },
        },
      );
      const json = (await response.json()).data as User[];
      dispatch({ type: 'players', value: json });
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'The players could not be loaded',
      });
    }
  };

  const getUserInformation = (getOpponent: boolean, playerId: number) => {
    const userInformation = state.players.find((p) =>
      getOpponent ? p.id !== playerId : p.id === playerId,
    );
    return getPlayerObject(userInformation);
  };

  const getPlayerObject = (player: User | undefined) => {
    const playerGame = state?.game?.players?.find(
      (p) => p.playerId === player?.id,
    );

    return { ...playerGame, ...player };
  };

  const back = () => {
    navigation.goBack();
  };

  const processMessage = (message: any) => {
    try {
      const messageParsed = JSON.parse(message.data);

      if (messageParsed.gameState) {
        dispatch({ type: 'animatedMarble', value: undefined });
        dispatch({ type: 'game', value: messageParsed.gameState });
      }

      if (messageParsed.event) {
        switch (messageParsed.event.type) {
          case 'animatedMarble':
            if (messageParsed.event.data.playerId != player.id) {
              dispatch({
                type: 'animatedMarble',
                value: {
                  marblesCoordinate: messageParsed.event.data.marblesCoordinate,
                  direction: messageParsed.event.data.direction,
                },
              });
            }
            break;

          case 'restart':
            toast.show({
              title: 'Restart',
              status: 'info',
              description: `The game has restarted`,
            });
            break;

          case 'joinGame':
            toast.show({
              title: 'Join',
              status: 'info',
              description: `A player has joined the game`,
            });
            break;

          case 'hasWinner':
            toast.show({
              title: 'Winner',
              status:
                messageParsed.event.data.playerWinner.playerId === player.id
                  ? 'success'
                  : 'error',
              description: `${
                messageParsed.event.data.playerWinner.playerId === player.id
                  ? 'Congratulations !! '
                  : 'Better luck next time'
              }`,
            });
            break;

          case 'error':
            if (state.game?.currentPlayerId === player.id) {
              toast.show({
                title: 'Error',
                status: 'error',
                description: messageParsed.event.message,
              });
            }

            break;

          default:
            break;
        }
      }
    } catch (e) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: `An error has appeared`,
      });
    }
  };

  const initWebSocket = () => {
    WS = new WebSocket(GATEWAY_URL);
    WS.addEventListener('error', () =>
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'An error occurred with the live function',
      }),
    );

    WS.onopen = () => {
      WS.send(JSON.stringify({ event: 'initGame', data: { gameId } }));
    };

    WS.onmessage = (e: any) => {
      processMessage(e);
    };

    WS.onerror = (e: any) => {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'An error occurred with the live function',
      });
    };
  };

  const setMarbleClicked = async (marbleClicked: {
    x: number;
    y: number;
    value: number;
    isExit: boolean;
  }) => {
    try {
      const response = await fetch(
        `${API_URL}/games/${gameId}/marble-clicked`,
        {
          method: 'PUT',
          body: JSON.stringify({ marbleClicked }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + player.token,
          },
        },
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: 'game', value: { ...state.game, marbleClicked } });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Cannot select this marble',
      });
    }
  };

  const checkAndMoveMarble = async (direction: string) => {
    try {
      if (await isMovePossible(gameId, player.token, player.id, direction)) {
        if (state.game?.marbleClicked) {
          const coordinates = {
            x: state.game.marbleClicked.x,
            y: state.game.marbleClicked.y,
          };
          const playerForAPI = getPlayerObject(player);
          const marblesCoordinateToAnimate = getMarblesCoordinateToAnimate(
            coordinates,
            state.game.graph,
            direction,
          );

          dispatch({
            type: 'moveMarbleReference',
            value: {
              gameId,
              coordinates,
              playerForAPI,
              direction,
              playerToken: player.token,
            },
          });

          dispatch({
            type: 'animatedMarble',
            value: {
              marblesCoordinate: marblesCoordinateToAnimate,
              direction,
            },
          });
        }
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Something went wrong',
      });
    }
  };

  return (
    <Flex flex={1}>
      {state.isLoading ? (
        <View
          height="100%"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
          <Spinner size="lg" />
        </View>
      ) : !state.error ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <ModalWin navigation={navigation} showModal={state.game?.winnerId} />
          <GameInfo
            game={state.game}
            currentPlayer={player}
            user={getUserInformation(false, player.id)}
          />
          <HStack width={'100%'} p={0} m={0}>
            <GameUser
              user={getUserInformation(false, player.id)}
              opponent={false}
              key={player.id}
            />
            <GameUser
              user={getUserInformation(true, player.id)}
              opponent={true}
            />
          </HStack>
          <Center p={6}>
            <Board
              board={state.game?.board}
              setMarbleClicked={setMarbleClicked}
              animatedMarble={state.animatedMarble}
            />
          </Center>
          <Center>
            <Controls checkAndMoveMarble={checkAndMoveMarble} />
          </Center>
        </ScrollView>
      ) : (
        <View
          height="100%"
          alignItems="center"
          justifyContent="center"
          flex={1}
        >
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
              An error occurred during the game loading (please try an other ID)
            </Text>
            <ArrowBackIcon color="white" onClick={back} />
          </Box>
        </View>
      )}
    </Flex>
  );
}
