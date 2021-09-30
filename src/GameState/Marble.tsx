import { Pressable, View } from 'native-base';
import React from 'react';
import { ImageBackground } from 'react-native';
import { DirectionControl } from './DirectionControl';

const RED_MARBLE = require('./red-marble.png');
const WHITE_MARBLE = require('./white-marble.png');
const BLACK_MARBLE = require('./black-marble.png');
const MARBLE_COLOR_IMAGE = [BLACK_MARBLE, WHITE_MARBLE, RED_MARBLE];

export const Marble = (props: any) => {
  let clicked = props.clicked;
  const size = props.size;
  const child = (
    <View width={size} height={size}>
      <ImageBackground
        source={getMarbleColorImage(props.value)}
        resizeMode="cover"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );

  const handleClickMarble = async () => {
    clicked = !clicked;
    if (clicked) {
      props.setMarbleClicked({
        x: props.cellIndex,
        y: props.rowIndex,
        value: props.value,
        isExit: false,
      });
      props.setMarbleClickedCoordinates({
        x: props.cellIndex,
        y: props.rowIndex,
      });
    } else {
      props.setMarbleClickedCoordinates(undefined);
    }
  };

  return (
    <Pressable p={0} onPress={() => handleClickMarble()}>
      {child}
    </Pressable>
  );
};

const getMarbleColorImage = (value: number): any => {
  return MARBLE_COLOR_IMAGE[value - 1];
};
