import React from 'react';
import { Box, HStack, Button } from 'native-base';
import { DIRECTION_CHARS } from '../constants';

interface ControlProps {
  checkAndMoveMarble: (direction: string) => void;
}

export function Controls(props: ControlProps) {
  const { checkAndMoveMarble } = props;

  return (
    <Box shadow={1} rounded="lg">
      <HStack p={4} space={2}>
        <Button onPress={() => checkAndMoveMarble('W')}>
          {' '}
          {DIRECTION_CHARS.west}{' '}
        </Button>
        <Button onPress={() => checkAndMoveMarble('N')}>
          {' '}
          {DIRECTION_CHARS.north}{' '}
        </Button>
        <Button onPress={() => checkAndMoveMarble('E')}>
          {' '}
          {DIRECTION_CHARS.east}{' '}
        </Button>
        <Button onPress={() => checkAndMoveMarble('S')}>
          {' '}
          {DIRECTION_CHARS.south}{' '}
        </Button>
      </HStack>
    </Box>
  );
}