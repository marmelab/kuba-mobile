import { Circle } from 'native-base';
import React from 'react';

const MARBLE_COLOR_RADIAL = ['warmGray.300', 'black', 'white', 'red.700'];

export const Marble = (props: any) => {
  const size = props.size;
  return (
    <Circle size={size} m={0} p={0} bgColor={getMarbleColor(props.value)} />
  );
};

const getMarbleColor = (value: number): string => {
  return MARBLE_COLOR_RADIAL[value];
};
