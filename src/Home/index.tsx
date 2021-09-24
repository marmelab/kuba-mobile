import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {
  AddIcon,
  Box,
  Circle,
  Divider,
  HStack,
  SearchIcon,
  VStack,
} from 'native-base';
import { ScrollView } from 'react-native';
import { Tile } from './tile';

export function Home({ navigation }: any) {
  return (
    <Box bg={'white'} pt={12} flex={1}>
      <ScrollView contentContainerStyle={{ width: '100%', height: '100%' }}>
        <VStack p={4} space={3} divider={<Divider />} w="100%">
          <HStack space={3} justifyContent="space-between">
            <Tile
              bgLinearColors={['orange.400', 'amber.200']}
              heading="New game"
              body={
                <Circle size={60} bg="orange.400">
                  <AddIcon size={6} color="white" />
                </Circle>
              }
            />
            <Tile
              bgLinearColors={['blue.800', 'lightBlue.300']}
              heading="Join Game"
              body={
                <Circle size={60} bg="blue.400">
                  <SearchIcon size={6} color="white" />
                </Circle>
              }
            />
          </HStack>
          <HStack space={3} justifyContent="space-between">
            <Tile
              bgLinearColors={['emerald.400', 'lime.200']}
              heading="My Games"
              body={
                <Circle size={60} bg="emerald.400">
                  <FontAwesome name="list-alt" size={30} color="white" />
                </Circle>
              }
            />
          </HStack>
          <HStack space={3} justifyContent="space-between">
            <Tile
              bgLinearColors={['fuchsia.800', 'pink.300']}
              heading="My profile"
              body={
                <Circle size={60} bg="fuchsia.800">
                  <FontAwesome name="user-secret" size={30} color="white" />
                </Circle>
              }
            />
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
