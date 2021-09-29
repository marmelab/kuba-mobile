import { Stack, HStack, Box, Text, View } from 'native-base';
import React from 'react';
import { Marble } from './Marble';

export const Board = (props: any) => {
  const board = props.board;
  const boardSize = props.preview ? 32 : '360px';
  const marbleColorSize = props.preview ? 4 : 12;
  const marbleEmptySize = props.preview ? 2 : 4;

  const [marbleClickedCoordinates, setMarbleClickedCoordinates] =
    React.useState<{ x: number; y: number } | null>(null);

  const convertBoardToPosition = () => {
    let result: { x: number; y: number; value: number }[] = [];

    board.map((row: [], index: number) => {
      const y = index;
      row.map((col: any, index: number) => {
        const x = index;
        const value = col;
        result.push({ x, y, value });
      });
    });

    return result;
  };
  const boardCoordinate = convertBoardToPosition();
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
          zIndex={1}
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
              ? '#0bf220'
              : '#948e8b'
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
