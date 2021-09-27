import { Box, Center, Heading, Pressable } from 'native-base';
import React from 'react';

interface PropsTitle {
  bgLinearColors: string[];
  heading: { title: string; color: string };
  body: any;
  onPress?: () => void;
}
export function Tile({ bgLinearColors, heading, body, onPress }: PropsTitle) {
  return (
    <Pressable flex={1} minH={32} onPress={onPress}>
      <Box
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
            color={heading.color}
            mx={2}
          >
            {heading.title}
          </Heading>
          {body}
        </Center>
      </Box>
    </Pressable>
  );
}
