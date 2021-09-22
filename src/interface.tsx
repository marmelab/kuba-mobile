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
}

export interface User {
  id?: number | null;
  email?: string;
  hash?: string;
  playerNumber?: number;
  marbleColor?: number;
  marblesWon?: number[];
  isConnected?: boolean;
  token?: string | null;
}

export interface GameInitialization {
  players: User[];
  game: Game | undefined;
  isLoading: boolean;
  error: any | undefined;
}
