import { Stack, HStack, Center, Text } from "native-base";
import React from "react";

const MARBLE_COLOR = ["", "#be123c", "#38bdf8", "white"];

export const Board = (props: any) => {
  const board = props.board;
  return (
    <Stack>
      {board.map((row: [], rowIndex: number) => (
        <HStack alignItems="center" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <Center size={12} rounded="md" border={1} key={cellIndex} bg="#d6d3d1" m={0} p={0}>
              {cell !== 0 ? (
                <Text fontSize="4xl" m={0} p={0} color={getMarbleColor(cell)}>
                  &#x2022;
                </Text>
              ) : (
                ""
              )}
            </Center>
          ))}
        </HStack>
      ))}
    </Stack>
  );
};

const getMarbleColor = (value: number): string => {
  return MARBLE_COLOR[value];
};
