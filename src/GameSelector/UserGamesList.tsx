import { Box, View, Text, FlatList, Flex, Badge } from 'native-base';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Game } from '../interface';
import {
  filterGamesByGameState,
  GAME_STATE_IN_PROGRESS,
  FilterGameState,
  GAME_STATE_FINISHED,
} from './filterGames';
import { UserGame } from './UserGame';

interface UserGamesListProps {
  navigateToGameState: (id: number | undefined) => void;
  userGames: Game[] | undefined;
}

export const UserGamesList = ({
  userGames,
  navigateToGameState,
}: UserGamesListProps) => {
  const [filter, setFilter] = useState<FilterGameState>(GAME_STATE_IN_PROGRESS);
  const userGamesFiltered = filterGamesByGameState(userGames, filter);

  return (
    <View>
      <Flex direction="row" mb={4}>
        <Pressable onPress={() => setFilter('all')}>
          <Badge
            p="2"
            mr={3}
            rounded="lg"
            colorScheme={filter === 'all' ? 'primary' : 'coolGray'}
          >
            All
          </Badge>
        </Pressable>

        <Pressable onPress={() => setFilter(GAME_STATE_IN_PROGRESS)}>
          <Badge
            p="2"
            mr={3}
            rounded="lg"
            colorScheme={
              filter === GAME_STATE_IN_PROGRESS ? 'primary' : 'coolGray'
            }
          >
            In progress
          </Badge>
        </Pressable>

        <Pressable onPress={() => setFilter(GAME_STATE_FINISHED)}>
          <Badge
            p="2"
            rounded="lg"
            colorScheme={
              filter === GAME_STATE_FINISHED ? 'primary' : 'coolGray'
            }
          >
            Finished
          </Badge>
        </Pressable>
      </Flex>
      {!userGamesFiltered?.length && (
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
            No games was found
          </Text>
        </Box>
      )}

      {userGamesFiltered && (
        <View>
          <FlatList
            data={userGamesFiltered}
            renderItem={({ item }) => (
              <UserGame game={item} navigateToGameState={navigateToGameState} />
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </View>
      )}
    </View>
  );
};
