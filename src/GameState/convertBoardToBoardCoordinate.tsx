export type BoardCoordinate = { x: number; y: number; value: number };

export const convertBoardToBoardCoordinate = (board: [][]) => {
  let result: BoardCoordinate[] = [];

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
