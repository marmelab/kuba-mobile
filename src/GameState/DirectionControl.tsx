import React from 'react';
import { Pressable } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { MARBLE_SIZE } from './sizes';

export const DirectionControl = (props: DirectionControlProps) => {
  const handlePressDirection = (direction: string) => {
    props.checkAndMoveMarble(direction);
    props.setMarbleClickedCoordinates(undefined);
  };
  switch (props.direction) {
    case 'N':
      return (
        <Pressable
          onPress={() => handlePressDirection('N')}
          size={MARBLE_SIZE.full}
          style={{
            position: 'absolute',
            left: `${props.coordinates.x * props.boxMarbleSize}%`,
            top: `${
              props.coordinates.y * props.boxMarbleSize - props.boxMarbleSize
            }%`,
            zIndex: 1000,
            elevation: 1000,
            backgroundColor: 'black',
          }}
        >
          <Entypo name="arrow-bold-up" size={40} m={0} p={0} color="white" />
        </Pressable>
      );
    case 'E':
      return (
        <Pressable
          onPress={() => {
            handlePressDirection('E');
          }}
          size={MARBLE_SIZE.full}
          style={{
            position: 'absolute',
            left: `${
              props.coordinates.x * props.boxMarbleSize + props.boxMarbleSize
            }%`,
            top: `${props.coordinates.y * props.boxMarbleSize}%`,
            zIndex: 1000,
            elevation: 1000,
            backgroundColor: 'black',
          }}
        >
          <Entypo name="arrow-bold-right" size={40} m={0} p={0} color="white" />
        </Pressable>
      );
    case 'S':
      return (
        <Pressable
          onPress={() => {
            handlePressDirection('S');
          }}
          size={MARBLE_SIZE.full}
          style={{
            position: 'absolute',
            left: `${props.coordinates.x * props.boxMarbleSize}%`,
            top: `${
              props.coordinates.y * props.boxMarbleSize + props.boxMarbleSize
            }%`,
            zIndex: 1000,
            elevation: 1000,
            backgroundColor: 'black',
          }}
        >
          <Entypo name="arrow-bold-down" size={40} m={0} p={0} color="white" />
        </Pressable>
      );
    case 'W':
      return (
        <Pressable
          onPress={() => {
            handlePressDirection('W');
          }}
          size={MARBLE_SIZE.full}
          style={{
            position: 'absolute',
            left: `${
              props.coordinates.x * props.boxMarbleSize - props.boxMarbleSize
            }%`,
            top: `${props.coordinates.y * props.boxMarbleSize}%`,
            zIndex: 1000,
            elevation: 1000,
            backgroundColor: 'black',
          }}
        >
          <Entypo name="arrow-bold-left" size={40} m={0} p={0} color="white" />
        </Pressable>
      );

    default:
      throw new Error(`direction ${props.direction} is not a valid direction`);
  }
};

interface DirectionControlProps {
  direction: string;
  checkAndMoveMarble: Function;
  coordinates: any;
  boxMarbleSize: number;
  setMarbleClickedCoordinates: (params: any) => void;
}
