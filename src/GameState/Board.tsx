import { Box, View } from 'native-base';
import React from 'react';
import { BOARD_GREEN } from './boardColors';
import { convertBoardToBoardCoordinate } from './convertBoardToBoardCoordinate';
import { Marble } from './Marble';

export const Board = (props: any) => {
  const board = props.board;
  const boardSize = props.preview ? '128px' : '360px';
  const marbleColorSize = props.preview ? '16px' : '48px';
  const marbleEmptySize = props.preview ? '8px' : '16px';

  const [marbleClickedCoordinates, setMarbleClickedCoordinates] =
    React.useState<{ x: number; y: number } | null>(null);

  const boardCoordinate = convertBoardToBoardCoordinate(board);
  const boxMarbleSize = 100 / board.length;
  const boxMarbleSizePourcent = `${boxMarbleSize}%`;

  return (
    <View
      position="relative"
      width={boardSize}
      height={boardSize}
      bg="cyan.500"
    >
      {boardCoordinate.map((item) => (
        <Box
          alignItems="center"
          justifyContent="center"
          key={item.x + ',' + item.y}
          position="absolute"
          left={`${item.x * boxMarbleSize}%`}
          top={`${item.y * boxMarbleSize}%`}
          width={boxMarbleSizePourcent}
          height={boxMarbleSizePourcent}
          bg={
            marbleClickedCoordinates?.x === item.x &&
            marbleClickedCoordinates?.y === item.y
              ? BOARD_GREEN
              : ''
          }
        >
          <Marble
            value={item.value}
            size={item.value === 0 ? marbleEmptySize : marbleColorSize}
            rowIndex={item.y}
            cellIndex={item.x}
            setMarbleClickedCoordinates={setMarbleClickedCoordinates}
            setMarbleClicked={props.setMarbleClicked}
          />
        </Box>
      ))}
    </View>
  );
};
