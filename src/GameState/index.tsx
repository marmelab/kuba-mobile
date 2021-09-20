import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Center, Spinner, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../App";
import Constants from "expo-constants";
import { Game, Player } from "../interface";
import { Board } from "./Board";

type Props = NativeStackScreenProps<RootStackParamList, "GameState">;
const API_URL = Constants?.manifest?.extra?.API_URL;

export default function GameState({ route }: Props) {
  const [game, setGame] = useState<Game>();
  const [players, setPlayer] = useState<Player[]>();
  const [isLoading, setLoading] = useState(true);
  const gameId = route.params?.gameId;

  const getGame = async () => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`);
      const json = (await response.json()) as Game;
      setGame(json);
      if (json.players) {
        const ids = json.players.map((pl) => pl.playerNumber);
        await getUsers(ids);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async (ids: number[]) => {
    try {
      const response = await fetch(`${API_URL}/user?filter=${encodeURI(JSON.stringify({id: ids}))}`);
      const json = (await response.json()).data as Player[];
      setPlayer(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGame();
  }, []);

  return (
    <Center flex={1}>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <View>
          <Text fontSize="md">Game #{game?.id}</Text>
          <Board board={game?.board} />
        </View>
      )}
    </Center>
  );
}
