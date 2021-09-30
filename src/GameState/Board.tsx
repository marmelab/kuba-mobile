import { Box, View } from 'native-base';
import React from 'react';
import { ImageBackground } from 'react-native';
import { BOARD_GREEN } from './boardColors';
import { convertBoardToBoardCoordinate } from './convertBoardToBoardCoordinate';
import { Marble } from './Marble';
import { BOARD_PADDING, BOARD_SIZE, MARBLE_SIZE } from './sizes';
import { TranslateView } from './TranslateView';

const BOARD_PNG = require('./board.png');

const marbleIsAnimated = (
  marbleCoordinate: any,
  marblesCoordinateToAnimate: any,
) => {
  if (!marblesCoordinateToAnimate || marblesCoordinateToAnimate.length < 1) {
    return false;
  }

  return marblesCoordinateToAnimate.find(
    (item: any) =>
      item.x === marbleCoordinate.x && item.y === marbleCoordinate.y,
  );
};

export const Board = (props: any) => {
  const board = props.board;
  const boardSize = props.preview ? BOARD_SIZE.preview : BOARD_SIZE.full;
  const boardPadding = props.preview
    ? BOARD_PADDING.preview
    : BOARD_PADDING.full;
  const marbleColorSize = props.preview
    ? MARBLE_SIZE.preview
    : MARBLE_SIZE.full;
  const animatedMarble = props.animatedMarble;

  const [marbleClickedCoordinates, setMarbleClickedCoordinates] =
    React.useState<{ x: number; y: number } | null>(null);

  const boardCoordinate = convertBoardToBoardCoordinate(board);
  const boxMarbleSize = 100 / board.length;
  const boxMarbleSizePourcent = `${boxMarbleSize}%`;
  return (
    <View
      width={boardSize}
      height={boardSize}
      p={boardPadding}
      backgroundColor="#417a84"
    >
      <ImageBackground
        source={BOARD_PNG}
        resizeMode="cover"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {boardCoordinate.map((item) => (
          <TranslateView
            activated={marbleIsAnimated(
              item,
              animatedMarble?.marblesCoordinate,
            )}
            direction={animatedMarble?.direction}
            style={{
              position: 'absolute',
              left: `${item.x * boxMarbleSize}%`,
              top: `${item.y * boxMarbleSize}%`,
              width: boxMarbleSizePourcent,
              height: boxMarbleSizePourcent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            key={item.x + ',' + item.y}
          >
            <Box
              bg={
                marbleClickedCoordinates?.x === item.x &&
                marbleClickedCoordinates?.y === item.y
                  ? BOARD_GREEN
                  : ''
              }
            >
              {item.value != 0 && (
                <Marble
                  value={item.value}
                  size={marbleColorSize}
                  rowIndex={item.y}
                  cellIndex={item.x}
                  setMarbleClickedCoordinates={setMarbleClickedCoordinates}
                  setMarbleClicked={props.setMarbleClicked}
                />
              )}
            </Box>
          </TranslateView>
        ))}
      </ImageBackground>
    </View>
  );
};
