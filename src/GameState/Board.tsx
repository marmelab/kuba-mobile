import {
  Stack,
  HStack,
  Box,
} from "native-base";
import React from "react";
import { Marble } from "./Marble";

export const Board = (props: any) => {
  const board = props.board;
  return (
    <Stack mb={4}>
      {board.map((row: [], rowIndex: number) => (
        <HStack alignItems="center" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <Box
              size={12}
              alignItems="center"
              justifyContent="center"
              key={cellIndex}
              bg="#948e8b"
              m={0}
              p={0}
            >
              <Marble value={cell}/>
            </Box>
          ))}
        </HStack>
      ))}
    </Stack>
  );
};