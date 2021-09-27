import { useIsFocused } from '@react-navigation/native';
import { View, ScrollView, Spinner, useToast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../constants';
import { useNavigation } from '../Hook/Navigation';
import { Game } from '../interface';
import { UserGamesList } from './UserGamesList';

export interface GameSelectorFormData {
  gameId: number;
}

export default function ({ navigation, player, setUser }: any) {
  const [userGames, setUserGames] = useState<Game[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorUserGames, setErrorUserGames] = useState<any>();
  const toast = useToast();
  const isFocused = useIsFocused();
  const { navigateToGameState } = useNavigation(navigation);

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
        </View>
      )}
    </ScrollView>
  );
}
