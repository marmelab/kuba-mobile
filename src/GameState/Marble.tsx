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
  setMarbleClickedCoordinates?: Function;
  setMarbleClicked?: Function;
};

export const Marble = (props: MarbleProps) => {
  const [isXDisabled, setIsXDisabled] = React.useState(false);
  const [isYDisabled, setIsYDisabled] = React.useState(false);
  const [direction, setDirection] = React.useState('');

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

  if (props.value < 1) {
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
      listener: (event) => onGestureEventHanlder(event),
    },
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (isXDisabled) {
        translateX.setOffset(oldCoords.x);
        translateX.setValue(0);
      } else {
        lastOffset.x += event.nativeEvent.translationX;
        translateX.setOffset(lastOffset.x);
        translateX.setValue(0);
        oldCoords.x = event.nativeEvent.absoluteX;
      }

      if (isYDisabled) {
        translateY.setOffset(oldCoords.y);
        translateY.setValue(0);
      } else {
        lastOffset.y += event.nativeEvent.translationY;
        translateY.setOffset(lastOffset.y);
        translateY.setValue(0);
        oldCoords.y = event.nativeEvent.absoluteY;
      }
      setIsYDisabled(false);
      setIsXDisabled(false);
    }

    if (event.nativeEvent.oldState === State.UNDETERMINED) {
      if (!isXDisabled) {
        oldCoords.x = event.nativeEvent.absoluteX;
      }
      if (!isYDisabled) {
        oldCoords.y = event.nativeEvent.absoluteY;
      }
    }
  };

  const getYdiff = (newYvalue: number): number => {
    return newYvalue - oldCoords.y;
  };
  const getXdiff = (newXvalue: number): number => {
    return newXvalue - oldCoords.x;
  };

  const onGestureEventHanlder = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      disableXorYdrag(event);
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
