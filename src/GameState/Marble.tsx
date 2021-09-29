import { Circle, Pressable, Box } from 'native-base';
import React from 'react';

const MARBLE_COLOR_RADIAL = ['warmGray.300', 'black', 'white', 'red.700'];

export const Marble = (props: any) => {
  const size = props.size;
  const child = (
    <Circle size={size} m={0} p={0} bgColor={getMarbleColor(props.value)} />
  );

  const marbleClick = async () => {
    await props.setMarbleClicked({
      x: props.cellIndex,
      y: props.rowIndex,
      value: props.value,
      isExit: false,
    });
    props.setMarbleClickedCoordinates({
      x: props.cellIndex,
      y: props.rowIndex,
    });
  };

  return (
    <Pressable p={0} onPress={() => marbleClick()}>
      {child}
    </Pressable>
  );
};

const getMarbleColor = (value: number): string => {
  return MARBLE_COLOR_RADIAL[value];
};
