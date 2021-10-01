import { Box, View } from 'native-base';
import React from 'react';
import { ImageBackground } from 'react-native';
import { BOARD_GREEN } from './boardColors';
import { convertBoardToBoardCoordinate } from './convertBoardToBoardCoordinate';
import { DirectionControl } from './DirectionControl';
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
  const boxMarbleSizePercent = `${boxMarbleSize}%`;

  const isMarbleClickable = (value: number) => {
    return !props.preview && props.user.playerNumber === value && props.myTurn;
  };

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
        {boardCoordinate.map((item) => {
          const zIndex =
            marbleClickedCoordinates?.x === item.x &&
            marbleClickedCoordinates?.y === item.y
              ? 1
              : 0;
          return (
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
                width: boxMarbleSizePercent,
                height: boxMarbleSizePercent,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: zIndex,
                elevation: zIndex,
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
                    clickable={isMarbleClickable(item.value)}
                    value={item.value}
                    size={marbleColorSize}
                    rowIndex={item.y}
                    cellIndex={item.x}
                    setMarbleClickedCoordinates={setMarbleClickedCoordinates}
                    setMarbleClicked={props.setMarbleClicked}
                    clicked={
                      marbleClickedCoordinates?.x === item.x &&
                      marbleClickedCoordinates?.y === item.y
                    }
                  />
                )}
              </Box>
            </TranslateView>
          );
        })}
        {!props.preview && marbleClickedCoordinates && (
          <>
            {marbleClickedCoordinates.y > 0 && (
              <DirectionControl
                direction="N"
                checkAndMoveMarble={props.checkAndMoveMarble}
                coordinates={marbleClickedCoordinates}
                boxMarbleSize={boxMarbleSize}
                setMarbleClickedCoordinates={setMarbleClickedCoordinates}
              />
            )}

            {marbleClickedCoordinates.x < 6 && (
              <DirectionControl
                direction="E"
                checkAndMoveMarble={props.checkAndMoveMarble}
                coordinates={marbleClickedCoordinates}
                boxMarbleSize={boxMarbleSize}
                setMarbleClickedCoordinates={setMarbleClickedCoordinates}
              />
            )}

            {marbleClickedCoordinates.y < 6 && (
              <DirectionControl
                direction="S"
                checkAndMoveMarble={props.checkAndMoveMarble}
                coordinates={marbleClickedCoordinates}
                boxMarbleSize={boxMarbleSize}
                setMarbleClickedCoordinates={setMarbleClickedCoordinates}
              />
            )}

            {marbleClickedCoordinates.x > 0 && (
              <DirectionControl
                direction="W"
                checkAndMoveMarble={props.checkAndMoveMarble}
                coordinates={marbleClickedCoordinates}
                boxMarbleSize={boxMarbleSize}
                setMarbleClickedCoordinates={setMarbleClickedCoordinates}
              />
            )}
          </>
        )}
      </ImageBackground>
    </View>
  );
};
