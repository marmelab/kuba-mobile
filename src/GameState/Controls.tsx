import React from 'react';
import { Box, HStack, Button } from 'native-base';

interface ControlProps {
  checkAndMoveMarble: (direction: string) => void;
}

const DIRECTION_CHARS = {
  north: '\u25b2',
  east: '\u25ba',
  south: '\u25bc',
  west: '\u25c4',
};
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
