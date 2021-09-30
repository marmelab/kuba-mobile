import React, { useState } from 'react';
import { Animated } from 'react-native';
import { getAnimatedActionByDirection } from './animatedActionByDirection';

export const TranslateView = ({
  activated,
  direction,
  style,
  children,
}: any) => {
  const [translateAnimation] = useState(new Animated.Value(0));
  const actionByDirection = getAnimatedActionByDirection(direction);

  let styleView = style;
  Animated.timing(translateAnimation, {
    toValue: activated ? actionByDirection.value : 0,
    duration: 300,
    useNativeDriver: true,
  }).start();

  if (direction) {
    styleView = {
      ...style,
      transform: [
        {
          [actionByDirection.translate]: translateAnimation,
        },
      ],
    };
  }

  return <Animated.View style={[styleView]}>{children}</Animated.View>;
};
