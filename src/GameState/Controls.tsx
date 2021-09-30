import React from 'react';
import { HStack, Button } from 'native-base';
import { DIRECTION_CHARS } from '../constants';

interface ControlProps {
  checkAndMoveMarble: (direction: string) => void;
}

export function Controls(props: ControlProps) {
  const { checkAndMoveMarble } = props;

  return (
    <HStack p={4} space={2}>
      <Button
        rounded="full"
        height="12"
        width="12"
        bg="blue.800"
        onPress={() => checkAndMoveMarble('W')}
      >
        {DIRECTION_CHARS.west}
      </Button>
      <Button
        rounded="full"
        height="12"
        width="12"
        bg="blue.800"
        onPress={() => checkAndMoveMarble('N')}
      >
        {DIRECTION_CHARS.north}
      </Button>
      <Button
        rounded="full"
        height="12"
        width="12"
        bg="blue.800"
        onPress={() => checkAndMoveMarble('E')}
      >
        {DIRECTION_CHARS.east}
      </Button>
      <Button
        rounded="full"
        height="12"
        width="12"
        bg="blue.800"
        onPress={() => checkAndMoveMarble('S')}
      >
        {DIRECTION_CHARS.south}
      </Button>
    </HStack>
  );
}
