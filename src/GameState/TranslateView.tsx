import React, { useState } from 'react';
import { Animated } from 'react-native';

export const TranslateView = ({ activated, style, children }: any) => {
  const [translateAnimation] = useState(new Animated.Value(0));

  Animated.timing(translateAnimation, {
    toValue: activated ? 50 : 0,
    duration: 300,
    useNativeDriver: true,
  }).start();

  const animatedStyles = {
    translate: {
      transform: [
        {
          translateX: translateAnimation,
        },
      ],
    },
  };

  return (
    <Animated.View style={[style, animatedStyles.translate]}>
      {children}
    </Animated.View>
  );
};
