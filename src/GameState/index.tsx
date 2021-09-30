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
import { Marble } from './Marble';
import { Controls } from './Controls';
import { useNavigation } from '../navigation/useNavigation';
import { getMarblesCoordinateToAnimate } from './getMarblesCoordinateToAnimate';

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
        const ids = json.players.map((pl) => pl.playerNumber);
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

  const getMobileUserInformation = () => {
    const mobileUserInformation = state.players.find((p) => p.id === player.id);
    return getPlayerObject(mobileUserInformation);
  };

  const getOpponentUserInformation = () => {
    const opponentUserInformation = state.players.find(
      (p) => p.id !== player.id,
    );
    return getPlayerObject(opponentUserInformation);
  };

  const getPlayerObject = (player: User | undefined) => {
    const playerGame = state?.game?.players?.find(
      (p) => p.playerNumber === player?.id,
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
              title: 'Player turn',
              status:
                messageParsed.event.data.playerWinner === player.id
                  ? 'success'
                  : 'error',
              description: `${
                messageParsed.event.data.playerWinner === player.id
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

  async function checkAndMoveMarble(direction: string) {
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
  }

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
          <GameInfo game={state.game} currentPlayer={player} />
          <GameUser
            user={getMobileUserInformation()}
            opponent={false}
            key={player.id}
          />
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
          <GameUser user={getOpponentUserInformation()} opponent={true} />
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

function GameInfo(props: any) {
  const game = props.game;
  return (
    <Box
      shadow={1}
      bg={{
        linearGradient: {
          colors: ['orange.400', 'amber.400'],
          start: [0, 0],
          end: [1, 0],
        },
      }}
    >
      <Stack p={4} space={2}>
        <Text fontSize="lg" bold color="black">
          {game?.currentPlayerId === props.currentPlayer.id
            ? 'Your turn !'
            : 'Opponent turn !'}
        </Text>
      </Stack>
    </Box>
  );
}

function GameUser(props: any) {
  const user: User = props.user;
  return (
    <Box
      shadow={1}
      mb={4}
      bg={{
        linearGradient: {
          colors: ['blue.800', 'blue.600'],
          start: [0, 0],
          end: [1, 0],
        },
      }}
    >
      <Stack p={4} space={1}>
        <HStack alignItems="center" justifyContent="space-between" space={4}>
          <Stack space={2}>
            <Heading size="md" ml={-1} color="white">
              {props.opponent
                ? `#${user.username ? user.username : 'Opponent'}`
                : 'Your'}{' '}
              captures:
            </Heading>
          </Stack>
          <Stack>
            <Marble value={user.marbleColor} size={10} />
          </Stack>
        </HStack>
        <HStack>
          {user?.marblesWon && user?.marblesWon.length > 0 ? (
            <View>
              <HStack>
                {user?.marblesWon?.map((marble, index) => (
                  <Marble value={marble} size={4} key={index} />
                ))}
              </HStack>
            </View>
          ) : (
            <Text color="white">No marbles</Text>
          )}
        </HStack>
      </Stack>
    </Box>
  );
}

function ModalWin({ showModal, navigation }: any) {
  const { navigateToGameSelector } = useNavigation(navigation);
  const [isOpen, setIsOpen] = useState<boolean>(showModal);

  const handleNavigateButton = () => {
    navigateToGameSelector();
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>The game is over</Modal.Header>
        <Modal.Footer>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => handleNavigateButton()}
          >
            Go to your games
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

async function isMovePossible(
  gameId: number,
  playerToken: string,
  player: number,
  direction: string,
) {
  const response = await fetch(
    `${API_URL}/games/${gameId}/authorized-move?player=${player}&direction=${direction}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + playerToken,
      },
    },
  );
  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  }
}

async function moveMarble(moveMarbleReference: MoveMarbleReference) {
  return await fetch(
    `${API_URL}/games/${moveMarbleReference.gameId}/move-marble`,
    {
      method: 'POST',
      body: JSON.stringify({
        coordinates: moveMarbleReference.coordinates,
        direction: moveMarbleReference.direction,
        player: moveMarbleReference.playerForAPI,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + moveMarbleReference.playerToken,
      },
    },
  );
}
