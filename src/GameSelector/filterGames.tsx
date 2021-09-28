export const GAME_STATE_ALL = 'all';
export const GAME_STATE_IN_PROGRESS = 'inProgress';
export const GAME_STATE_FINISHED = 'finished';

export type FilterGames =
  | typeof GAME_STATE_ALL
  | typeof GAME_STATE_IN_PROGRESS
  | typeof GAME_STATE_FINISHED;
