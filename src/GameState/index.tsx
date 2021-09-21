import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
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
  View,
} from "native-base";
import React, { useEffect, useReducer } from "react";
import { RootStackParamList } from "../../App";
import Constants from "expo-constants";
import { Game, User } from "../interface";
import { Board } from "./Board";
import { Marble } from "./Marble";

type Props = NativeStackScreenProps<RootStackParamList, "GameState">;
const API_URL = Constants?.manifest?.extra?.API_URL;

const initialState: {
  players: User[];
  game: Game | undefined;
  isLoading: boolean;
} = {
  players: [],
  game: undefined,
  isLoading: true,
};

const reducer = (
  state: { players: User[]; game: Game | undefined; isLoading: boolean },
  action: { type: string; value: any }
) => {
  return { ...state, [action.type]: action.value };
};

export default function GameState({ route }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const gameId = route.params?.gameId;

  const getGame = async () => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`);
      const json = (await response.json()) as Game;
      dispatch({ type: "game", value: json });
      if (json.players) {
        const ids = json.players.map((pl) => pl.playerNumber);
        await getPlayers(ids);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "isLoading", value: false });
    }
  };

  const getPlayers = async (ids: number[]) => {
    try {
      const response = await fetch(
        `${API_URL}/user?filter=${encodeURI(JSON.stringify({ id: ids }))}`
      );
      const json = (await response.json()).data as User[];
      dispatch({ type: "players", value: json });
    } catch (error) {
      console.error(error);
    }
  };

  const getPlayerObject = (player: User) => {
    const playerGame = state?.game?.players?.find(
      (p) => p.playerNumber === player.id
    );
    return { ...playerGame, ...player };
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
      ) : (
        <ScrollView p={6} contentContainerStyle={{paddingBottom: 24}}>
          <GameInfo game={state.game} />
          <Board board={state.game?.board} />
          {state.players.map((player) => {
            return <GameUser user={getPlayerObject(player)} key={player.id} />;
          })}
        </ScrollView>
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
          colors: ["cyan.400", "cyan.100"],
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
          colors: ["cyan.400", "cyan.100"],
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
