import {
  Box,
  HStack,
  View,
  Text,
  Button,
  FlatList,
  VStack,
  Icon,
  AddIcon,
  Flex,
  Badge,
} from 'native-base';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Board } from '../GameState/Board';
import { Game } from '../interface';

interface UserGamesListProps {
  navigateToGameState: (id: number) => void;
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
              <Box
                bg={{
                  linearGradient: {
                    colors: ['orange.400', 'amber.200'],
                    start: [0, 0],
                    end: [1, 0],
                  },
                }}
                rounded="lg"
                shadow={1}
                p={1}
                mb={4}
              >
                <Pressable onPress={() => navigateToGameState(item.id)}>
                  <HStack space={3}>
                    <Board board={item?.board} preview={true} />
                    <VStack
                      alignItems="space-between"
                      justifyContent="space-between"
                    >
                      <Text color="coolGray.800" bold>
                        Game #{item.id}
                      </Text>
                      <Text color="coolGray.600">
                        Player #{item.players[0]?.playerNumber} vs Player #
                        {item.players[1]?.playerNumber}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="coolGray.800"
                        alignSelf="flex-start"
                      >
                        Game.timeStamp
                      </Text>
                    </VStack>
                  </HStack>
                </Pressable>
              </Box>
            )}
            keyExtractor={(item) => `${item.id}`}
          />
        </View>
      )}
    </View>
  );
};
