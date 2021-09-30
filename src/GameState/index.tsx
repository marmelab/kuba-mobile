import {
  ArrowBackIcon,
  Box,
  CheckIcon,
  Flex,
  Heading,
  HStack,
  Modal,
  ScrollView,
  SmallCloseIcon,
  Spinner,
  Stack,
  Text,
  useToast,
  View,
  Button,
} from 'native-base';
import React, { useEffect, useReducer } from 'react';
import { API_URL, GATEWAY_URL } from '../constants';
import { Game, GameInitialization, User } from '../interface';
import { Board } from './Board';
import { Marble } from './Marble';
import { Controls } from './Controls';
import { useNavigation } from '../navigation/useNavigation';

const initialState: GameInitialization = {
  players: [],
  game: undefined,
  isLoading: true,
  error: undefined,
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

  const getPlayerObject = (player: User) => {
    const playerGame = state?.game?.players?.find(
      (p) => p.playerId === player.id,
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
        dispatch({ type: 'game', value: messageParsed.gameState });
      }

      if (messageParsed.event) {
        switch (messageParsed.event.type) {
          case 'switchPlayer':
            toast.show({
              title: 'Player turn',
              status: 'info',
              description: `it's your ${
                messageParsed.event.data.playerId !== player.id
                  ? 'opponent'
                  : ''
              } turn`,
            });
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
            toast.show({
              title: 'Error',
              status: 'error',
              description: messageParsed.event.message,
            });
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

  useEffect(() => {
    getGame();
    initWebSocket();
    return () => {
      if (WS) WS.close();
    };
  }, []);

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
          const response = await moveMarble(
            gameId,
            coordinates,
            playerForAPI,
            direction,
            player.token,
          );
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
        <ScrollView p={6} contentContainerStyle={{ paddingBottom: 24 }}>
          <ModalWin navigation={navigation} showModal={state.game?.hasWinner} />
          <GameInfo game={state.game} />
          <Board
            board={state.game?.board}
            setMarbleClicked={setMarbleClicked}
            checkAndMoveMarble={checkAndMoveMarble}
            preview={false}
          />
          <Controls checkAndMoveMarble={checkAndMoveMarble} />
          {state.players.map((player) => (
            <GameUser user={getPlayerObject(player)} key={player.id} />
          ))}
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
      mb={4}
      bg={{
        linearGradient: {
          colors: ['cyan.400', 'cyan.100'],
          start: [0, 0],
          end: [1, 0],
        },
      }}
      rounded="lg"
    >
      <HStack
        alignItems="center"
        justifyContent="space-between"
        p={4}
        space={2}
      >
        <Text fontSize="lg" bold color="white">
          Game #{game?.id}
        </Text>
        <Flex alignItems="center" direction="row">
          <Text fontSize="lg" bold color="white" pr={2}>
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
        <Text fontSize="lg" bold color="white">
          Player turn: #{game?.currentPlayer || game?.currentPlayerId}
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
          colors: ['cyan.400', 'cyan.100'],
          start: [0, 0],
          end: [1, 0],
        },
      }}
      rounded="lg"
    >
      <Stack p={4} space={2}>
        <HStack alignItems="center" justifyContent="space-between" space={4}>
          <Stack space={2}>
            <Heading size="md" ml={-1} color="white">
              {user.username} #{user.id}
            </Heading>
            <Heading size="xs" color="white" fontWeight="500" ml={-0.5} mt={-1}>
              {user.email}
            </Heading>
          </Stack>
          <Stack>
            <Marble value={user.marbleColor} size={10} preview={true} if />
          </Stack>
        </HStack>
        <HStack>
          {user?.marblesWon && user?.marblesWon.length > 0 && (
            <View>
              <Text bold color="white">
                Marbles won:
              </Text>
              <HStack>
                {user?.marblesWon?.map((marble, index) => (
                  <Marble value={marble} size={4} key={index} preview={true} />
                ))}
              </HStack>
            </View>
          )}
        </HStack>
      </Stack>
    </Box>
  );
}

function ModalWin({ showModal, navigation }: any) {
  const { navigateToGameSelector } = useNavigation(navigation);

  return (
    <Modal isOpen={showModal} onClose={() => (showModal = false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>The game is over</Modal.Header>
        <Modal.Footer>
          <Button
            variant="ghost"
            colorScheme="blueGray"
            onPress={() => navigateToGameSelector()}
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

async function moveMarble(
  gameId: number,
  marbleClicked: any,
  player: any,
  direction: string,
  playerToken: string,
) {
  return await fetch(`${API_URL}/games/${gameId}/move-marble`, {
    method: 'POST',
    body: JSON.stringify({
      coordinates: marbleClicked,
      direction,
      player,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + playerToken,
    },
  });
}
