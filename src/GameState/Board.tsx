import { Stack, HStack, Box } from 'native-base';
import React from 'react';
import { BOARD_GREEN, BOARD_GREY } from './boardColors';
import { Marble } from './Marble';

export const Board = (props: any) => {
  const board = props.board;
  const boardSize = props.preview ? 4 : 12;
  const marbleColorSize = props.preview ? 4 : 12;
  const marbleEmptySize = props.preview ? 2 : 4;

  const [marbleClickedCoordinates, setMarbleClickedCoordinates] =
    React.useState<{ x: number; y: number } | null>(null);

  return (
    <Stack rounded={'lg'}>
      {board.map((row: [], rowIndex: number) => (
        <HStack alignItems="center" key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <Box
              size={boardSize}
              alignItems="center"
              justifyContent="center"
              key={cellIndex}
              bg={
                marbleClickedCoordinates?.x === cellIndex &&
                marbleClickedCoordinates?.y === rowIndex
                  ? BOARD_GREY
                  : BOARD_GREEN
              }
              m={0}
              p={0}
            >
              <Marble
                value={cell}
                size={cell === 0 ? marbleEmptySize : marbleColorSize}
                rowIndex={rowIndex}
                cellIndex={cellIndex}
                setMarbleClickedCoordinates={setMarbleClickedCoordinates}
                setMarbleClicked={props.setMarbleClicked}
              />
            </Box>
          ))}
        </HStack>
      ))}
    </Stack>
  );
};
