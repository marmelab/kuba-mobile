export type BoardCoordinate = { x: number; y: number; value: number };

export const convertBoardToBoardCoordinate = (board: [][]) => {
  let result: BoardCoordinate[] = [];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const value = board[y][x];
      result.push({ x, y, value });
    }
  }

  return result;
};
