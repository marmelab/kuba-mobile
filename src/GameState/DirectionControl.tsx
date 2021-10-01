import React from 'react';
import { Pressable } from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { MARBLE_SIZE } from './sizes';

export const DirectionControl = (props: DirectionControlProps) => {
  const handlePressDirection = (direction: string) => {
    props.checkAndMoveMarble(direction);
    props.setMarbleClickedCoordinates(undefined);
  };

  const getPressableInformation = (direction: string) => {
    switch (props.direction) {
      case 'N':
        return {
          left: `${props.coordinates.x * props.boxMarbleSize}%`,
          top: `${
            props.coordinates.y * props.boxMarbleSize - props.boxMarbleSize
          }%`,
          nameIcon: 'arrow-bold-up' as any,
        };

      case 'E':
        return {
          left: `${
            props.coordinates.x * props.boxMarbleSize + props.boxMarbleSize
          }%`,
          top: `${props.coordinates.y * props.boxMarbleSize}%`,
          nameIcon: 'arrow-bold-right' as any,
        };

      case 'S':
        return {
          left: `${props.coordinates.x * props.boxMarbleSize}%`,
          top: `${
            props.coordinates.y * props.boxMarbleSize + props.boxMarbleSize
          }%`,
          nameIcon: 'arrow-bold-down' as any,
        };

      case 'W':
        return {
          left: `${
            props.coordinates.x * props.boxMarbleSize - props.boxMarbleSize
          }%`,
          top: `${props.coordinates.y * props.boxMarbleSize}%`,
          nameIcon: 'arrow-bold-left' as any,
        };
    }
  };

  const pressableInformation = getPressableInformation(props.direction);

  return (
    <Pressable
      onPress={() => {
        handlePressDirection('W');
      }}
      size={MARBLE_SIZE.full}
      style={{
        position: 'absolute',
        left: pressableInformation?.left,
        top: pressableInformation?.top,
        zIndex: 1000,
        elevation: 1000,
        backgroundColor: 'black',
      }}
    >
      <Entypo
        name={pressableInformation?.nameIcon}
        size={40}
        m={0}
        p={0}
        color="white"
      />
    </Pressable>
  );
};

interface DirectionControlProps {
  direction: string;
  checkAndMoveMarble: Function;
  coordinates: any;
  boxMarbleSize: number;
  setMarbleClickedCoordinates: (params: any) => void;
}
