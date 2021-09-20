export interface Game {
  id: number;
  board: JSON | null;
  currentPlayer: number | null;
  players: JSON | null;
  directionSelected: string | null;
  marbleClicked: JSON | null;
  hasWinner: boolean;
  started: boolean;
}
