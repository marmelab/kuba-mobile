import { Circle } from 'native-base';
import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
  GestureEvent,
  PanGestureHandlerEventPayload,
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
    { useNativeDriver: true },
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    console.log('onHandlerStateChanged');
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
      setIsYDisabled(false);
      setIsXDisabled(false);
    }
  };

  const getYdiff = (newYvalue: number): number => {
    return newYvalue - oldCoords.y;
  };
  const getXdiff = (newXvalue: number): number => {
    return newXvalue - oldCoords.x;
  };

  const onGestureEventHanlder = (event: GestureEvent<any>) => {
    if (event.nativeEvent.oldState === State.BEGAN) {
      if (
        Math.abs(getYdiff(event.nativeEvent.absoluteY)) >
        Math.abs(getXdiff(event.nativeEvent.absoluteX))
      ) {
        console.log(`disabling x`);
        if (!isYDisabled) {
          setIsXDisabled(true);
        }
      } else {
        console.log(`disabling y`);
        if (!isXDisabled) {
          setIsYDisabled(true);
        }
      }
    }

    onGestureEvent(event);
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
      onGestureEvent={onGestureEventHanlder}
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
