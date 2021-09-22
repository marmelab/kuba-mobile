import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowBackIcon,
  Box,
  Center,
  CheckIcon,
  Flex,
  Heading,
  HStack,
  ScrollView,
  SmallCloseIcon,
  Spinner,
  Stack,
  Text,
  useToast,
  View,
} from 'native-base';
import React, { useEffect, useReducer } from 'react';
import { RootStackParamList } from '../../App';
import Constants from 'expo-constants';
import { Game, GameInitialization, User } from '../interface';
import { Board } from './Board';
import { Marble } from './Marble';
import { background } from 'styled-system';

type Props = NativeStackScreenProps<RootStackParamList, 'GameState'>;
const API_URL = Constants?.manifest?.extra?.API_URL;

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

export default function GameState({ navigation, route }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const gameId = route.params?.gameId;

  const getGame = async () => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`);
      const json = (await response.json()) as Game;
      dispatch({ type: 'game', value: json });
      if (json.players) {
        const ids = json.players.map((pl) => pl.playerNumber);
        await getPlayers(ids);
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: 'error', value: error });
    } finally {
      dispatch({ type: 'isLoading', value: false });
    }
  };

  const getPlayers = async (ids: number[]) => {
    try {
      const response = await fetch(
        `${API_URL}/user?filter=${encodeURI(JSON.stringify({ id: ids }))}`,
      );
      const json = (await response.json()).data as User[];
      dispatch({ type: 'players', value: json });
    } catch (error) {
      const toast = useToast();
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'The players could not be loaded',
      });
    }
  };

  const getPlayerObject = (player: User) => {
    const playerGame = state?.game?.players?.find(
      (p) => p.playerNumber === player.id,
    );
    return { ...playerGame, ...player };
  };

  const back = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getGame();
  }, []);

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
      ) : state.error ? (
        <ScrollView p={6} contentContainerStyle={{ paddingBottom: 24 }}>
          <GameInfo game={state.game} />
          <Board board={state.game?.board} />
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
          Player turn: Player #{game?.currentPlayer}
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
              Player #{user.id}
            </Heading>
            <Heading size="xs" color="white" fontWeight="500" ml={-0.5} mt={-1}>
              {user.email}
            </Heading>
          </Stack>
          <Stack>
            <Marble value={user.marbleColor} />
          </Stack>
        </HStack>
        <HStack>
          {user?.marblesWon && user?.marblesWon.length > 0 && (
            <View>
              <Text bold color="white">
                Marbles won:
              </Text>
              {user?.marblesWon?.map((marble) => {
                <Marble value={marble} size={4} />;
              })}
            </View>
          )}
        </HStack>
      </Stack>
    </Box>
  );
}
