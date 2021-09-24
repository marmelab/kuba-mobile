import { Box, Center, Heading, Text } from 'native-base';
import React from 'react';

interface PropsTitle {
  bgLinearColors: string[];
  heading: string;
  body: any;
}
export function Tile({ bgLinearColors, heading, body }: PropsTitle) {
  return (
    <Box
      minH={32}
      flex={1}
      rounded="xl"
      position="relative"
      bg={{
        linearGradient: {
          colors: bgLinearColors,
          start: [0, 0],
          end: [1, 0],
        },
      }}
    >
      <Center flex={1}>
        <Heading
          size="xs"
          position="absolute"
          top={2}
          left={2}
          style={{ textTransform: 'uppercase' }}
          color={'white'}
          mx={2}
        >
          {heading}
        </Heading>
        {body}
      </Center>
    </Box>
  );
}
