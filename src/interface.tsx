export interface Game {
  id: number;
  board: JSON | null;
  graph?: Graph | null;
  currentPlayer: number | null;
  players: Player[] | null;
  directionSelected: string | null;
  marbleClicked: Node | null;
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
  username?: string;
}

export interface GameInitialization {
  players: User[];
  game: Game | undefined;
  isLoading: boolean;
  error: any | undefined;
  marblesCoordinateToAnimate: any | undefined;
}

export interface Node {
  x: number;
  y: number;
  value: number;
  isExit: Boolean;
}

export interface Edge {
  from: string;
  to: string;
  direction: Direction;
}

export interface Graph {
  nodes: {
    [coordinates: string]: Node;
  };
  edges: Array<Edge>;
}

export type Direction = 'N' | 'S' | 'E' | 'W';
