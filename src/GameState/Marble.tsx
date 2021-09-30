import { Circle } from 'native-base';
import React from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { DIRECTIONS } from '../constants';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

const MARBLE_COLOR_RADIAL = ['warmGray.300', 'black', 'white', 'red.700'];

type MarbleProps = {
  minDist?: number;
  boxStyle?: StyleProp<ViewStyle>;
  size: number;
  value: number;
  rowIndex?: number;
  cellIndex?: number;
  checkAndMoveMarble?: Function;
  setMarbleClickedCoordinates?: Function;
  setMarbleClicked?: Function;
  preview: boolean;
};

export const Marble = (props: MarbleProps) => {
  const [isXDisabled, setIsXDisabled] = React.useState(false);
  const [isYDisabled, setIsYDisabled] = React.useState(false);
  const [direction, setDirection] = React.useState('');
  const [oldY, setOldY] = React.useState(0);
  const [oldX, setOldX] = React.useState(0);
  const [isDoingMovement, setIsDoingMovement] = React.useState(false);
  const [isClickedMarble, setIsClickedMArble] = React.useState(false);

  const size = props.size;
  const child = (
    <Circle
      zIndex={200}
      size={size}
      m={0}
      p={0}
      bgColor={getMarbleColor(props.value)}
    />
  );

  if (props.value < 1 || props.preview) {
    return child;
  }

  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const lastOffset = { x: 0, y: 0 };
  const oldCoords = { x: 0, y: 0 };

  let onGestureEvent: (event: PanGestureHandlerGestureEvent) => void;

  onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: !isXDisabled ? translateX : new Animated.Value(0),
          translationY: !isYDisabled ? translateY : new Animated.Value(0),
        },
      },
    ],
    {
      useNativeDriver: true,
      listener: (event) => onGestureEventListener(event),
    },
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (props.setMarbleClicked && !isClickedMarble) {
      props.setMarbleClicked({
        x: props.cellIndex,
        y: props.rowIndex,
        value: props.value,
        isExit: false,
      });
      setIsClickedMArble(true);
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (isXDisabled) {
        translateX.setValue(0);
      } else {
        lastOffset.x += event.nativeEvent.translationX;
        translateX.setOffset(lastOffset.x);
        translateX.setValue(0);
        setOldX(event.nativeEvent.absoluteX);
      }

      if (isYDisabled) {
        translateY.setValue(0);
      } else {
        lastOffset.y += event.nativeEvent.translationY;
        translateY.setOffset(lastOffset.y);
        translateY.setValue(0);
        setOldY(event.nativeEvent.absoluteY);
      }
      setIsYDisabled(false);
      setIsXDisabled(false);
    }

    if (event.nativeEvent.oldState === State.UNDETERMINED) {
      if (!isXDisabled) {
        setOldX(event.nativeEvent.absoluteX);
      }
      if (!isYDisabled) {
        setOldY(event.nativeEvent.absoluteY);
      }
    }
  };

  const getYdiff = (newYvalue: number): number => {
    return newYvalue - oldY;
  };
  const getXdiff = (newXvalue: number): number => {
    return newXvalue - oldX;
  };

  const onGestureEventListener = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      disableXorYdrag(event);
      setDirectionString(event);
      if (direction) {
        if (props.checkAndMoveMarble) {
          props.checkAndMoveMarble(direction);
        }
      }
    }
  };

  const disableXorYdrag = (event: any) => {
    if (
      Math.abs(getYdiff(event.nativeEvent.absoluteY)) >
      Math.abs(getXdiff(event.nativeEvent.absoluteX))
    ) {
      !isYDisabled && setIsXDisabled(true);
    } else {
      !isXDisabled && setIsYDisabled(true);
    }
  };

  const setDirectionString = (event: any) => {
    if (
      Math.abs(getYdiff(event.nativeEvent.absoluteY)) >
      Math.abs(getXdiff(event.nativeEvent.absoluteX))
    ) {
      getYdiff(event.nativeEvent.absoluteY) > 0
        ? setDirection(DIRECTIONS.south)
        : setDirection(DIRECTIONS.north);
    } else {
      getXdiff(event.nativeEvent.absoluteX) > 0
        ? setDirection(DIRECTIONS.east)
        : setDirection(DIRECTIONS.west);
    }
  };

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    box: {
      alignSelf: 'center',
      margin: 10,
      zIndex: 200,
    },
  });

  return (
    <PanGestureHandler
      {...props}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      minDist={10}
    >
      <Animated.View
        style={[
          styles.box,
          {
            transform: [{ translateX: translateX }, { translateY: translateY }],
          },
          props.boxStyle,
        ]}
      >
        {child}
      </Animated.View>
    </PanGestureHandler>
  );
};

const getMarbleColor = (value: number): string => {
  return MARBLE_COLOR_RADIAL[value];
};
