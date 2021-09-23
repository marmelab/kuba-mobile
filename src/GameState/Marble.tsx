import { Circle, Pressable } from 'native-base';
import React from 'react';
import { DirectionControl } from './DirectionControl';

const MARBLE_COLOR_RADIAL = ['warmGray.300', 'black', 'white', 'red.700'];

export const Marble = (props: any) => {
  const [clicked, setClicked] = React.useState(false);
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
    setClicked(!clicked);
  };

  if (props.disabled || props.preview) {
    return child;
  } else {
    return (
      <>
        {clicked && (
          <>
            <DirectionControl
              direction="W"
              checkAndMoveMarble={props.checkAndMoveMarble}
            />
            <DirectionControl
              direction="N"
              checkAndMoveMarble={props.checkAndMoveMarble}
            />
            <DirectionControl
              direction="E"
              checkAndMoveMarble={props.checkAndMoveMarble}
            />
            <DirectionControl
              direction="S"
              checkAndMoveMarble={props.checkAndMoveMarble}
            />
          </>
        )}
        <Pressable p={0} onPress={() => marbleClick()}>
          {child}
        </Pressable>
      </>
    );
  }
};

const getMarbleColor = (value: number): string => {
  return MARBLE_COLOR_RADIAL[value];
};
