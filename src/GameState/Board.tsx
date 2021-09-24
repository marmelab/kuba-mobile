import { Stack, HStack, Box } from 'native-base';
import React from 'react';
import { Marble } from './Marble';

export const Board = (props: any) => {
  const board = props.board;
  const boardSize = props.preview ? 4 : 12;
  const marbleColorSize = props.preview ? 4 : 12;
  const marbleEmptySize = props.preview ? 2 : 4;

  const [marbleHasBeenClicked, setmarbleHasBeenClicked] = React.useState(false);

  const isCurrentPlayer = props.player?.id === props.currentPlayer;

  const marblesDisabled = props.preview || !isCurrentPlayer;

  return (
    <Stack mb={4}>
      {board.map((row: [], rowIndex: number) => {
        let zIndexHstack: number = 0;
        if (props.marbleClicked?.y === rowIndex) {
          zIndexHstack = 250;
        }
        return (
          <HStack alignItems="center" key={rowIndex} zIndex={zIndexHstack}>
            {row.map((cell, cellIndex) => {
              let zIndex = 0;
              if (
                props.marbleClicked?.x === cellIndex &&
                props.marbleClicked?.y === rowIndex
              ) {
                zIndex = 300;
              }
              return (
                <Box
                  size={boardSize}
                  alignItems="center"
                  justifyContent="center"
                  key={cellIndex}
                  bg="#948e8b"
                  m={0}
                  p={0}
                  zIndex={zIndex}
                >
                  <Marble
                    value={cell}
                    size={cell === 0 ? marbleEmptySize : marbleColorSize}
                    rowIndex={rowIndex}
                    cellIndex={cellIndex}
                    setMarbleClicked={props.setMarbleClicked}
                    disabled={
                      marblesDisabled || props.player.marbleColor !== cell
                    }
                    preview={props.preview}
                    setmarbleHasBeenClicked={setmarbleHasBeenClicked}
                    checkAndMoveMarble={props.checkAndMoveMarble}
                  />
                </Box>
              );
            })}
          </HStack>
        );
      })}
    </Stack>
  );
};

const isClicked = (
  marbleClickedCoordinates: { x: number; y: number } | null,
  rowIndex: number,
  cellIndex: number,
) => {
  if (
    marbleClickedCoordinates?.x === cellIndex &&
    marbleClickedCoordinates?.y === rowIndex
  ) {
    return true;
  }
  return false;
};
