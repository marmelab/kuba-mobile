export interface Game {
  id: number;
  board: JSON | null;
  currentPlayer: number | null;
  players: Player[] | null;
  directionSelected: string | null;
  marbleClicked: JSON | null;
  hasWinner: boolean;
  started: boolean;
}

export interface Player {
  playerNumber: number;
  marbleColor: number;
  marblesWon: number[];
};
