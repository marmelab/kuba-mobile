import React from 'react';
import { Pressable } from 'native-base';
import { Entypo } from '@expo/vector-icons';

export const DirectionControl = (props: DirectionControlProps) => {
  switch (props.direction) {
    case 'N':
      return (
        <Pressable
          position="absolute"
          top={'-44px'}
          left={'4px'}
          onPress={() => props.checkAndMoveMarble('N')}
        >
          <Entypo name="arrow-bold-up" size={40} m={0} p={0} color="yellow" />
        </Pressable>
      );
    case 'E':
      return (
        <Pressable
          position="absolute"
          top={'2px'}
          left={'50px'}
          onPress={() => props.checkAndMoveMarble('E')}
        >
          <Entypo
            name="arrow-bold-right"
            size={40}
            m={0}
            p={0}
            color="yellow"
          />
        </Pressable>
      );
    case 'S':
      return (
        <Pressable
          position="absolute"
          top={'48px'}
          left={'4px'}
          onPress={() => props.checkAndMoveMarble('S')}
        >
          <Entypo name="arrow-bold-down" size={40} m={0} p={0} color="yellow" />
        </Pressable>
      );
    case 'W':
      return (
        <Pressable
          position="absolute"
          top={'2px'}
          left={'-42px'}
          onPress={() => props.checkAndMoveMarble('W')}
        >
          <Entypo name="arrow-bold-left" size={40} m={0} p={0} color="yellow" />
        </Pressable>
      );
    default:
      throw new Error(`direction ${props.direction} is not a valid direction`);
  }
};

interface DirectionControlProps {
  direction: string;
  checkAndMoveMarble: Function;
}
