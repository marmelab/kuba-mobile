import { Box, View, Text, FlatList, Flex, Badge } from 'native-base';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Game } from '../interface';
import { UserGame } from './UserGame';

interface UserGamesListProps {
  navigateToGameState: (id: number | undefined) => void;
  userGames: Game[] | undefined;
}

export const UserGamesList = ({
  userGames,
  navigateToGameState,
}: UserGamesListProps) => {
  const [filter, setFilter] = useState<'all' | 'inProgress' | 'finished'>();

  return (
    <View>
      {!userGames?.length && (
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

      {userGames && (
        <View>
          <Flex direction="row" mb={4}>
            <Pressable onPress={() => setFilter('all')}>
              <Badge p="2" mr={3} rounded="lg">
                All
              </Badge>
            </Pressable>

            <Pressable onPress={() => setFilter('inProgress')}>
              <Badge p="2" mr={3} rounded="lg">
                In progress
              </Badge>
            </Pressable>

            <Pressable onPress={() => setFilter('finished')}>
              <Badge p="2" rounded="lg">
                Finished
              </Badge>
            </Pressable>
          </Flex>
          <FlatList
            data={userGames}
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
