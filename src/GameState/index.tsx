import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Center, Spinner, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../../App";
import Constants from "expo-constants";
import { Game } from "../interface";
import { Board } from "./Board";

type Props = NativeStackScreenProps<RootStackParamList, "GameState">;
const API_URL = Constants?.manifest?.extra?.API_URL;

export default function GameState({ route }: Props) {
  const [data, setData] = useState<Game>();
  const [isLoading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const gameId = route.params?.gameId;

  const getMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/games/${gameId}`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <Center flex={1}>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <View>
          <Text fontSize="md">Game #{data?.id}</Text>
          <Board board={data?.board}/>
        </View>
      )}
    </Center>
  );
}
