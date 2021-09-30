export interface Game {
  id: number;
  board: JSON | null;
  graph?: Graph | null;
  currentPlayerId: number | null;
  players: Player[] | null;
  directionSelected: string | null;
  marbleClicked: Node | null;
  winnerId: number | null;
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
  animatedMarble: { marblesCoordinate: Node[]; direcition: string } | undefined;
  moveMarbleReference: MoveMarbleReference | undefined;
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

export interface MoveMarbleReference {
  gameId: number;
  coordinates: any;
  playerForAPI: any;
  direction: string;
  playerToken: string;
}
