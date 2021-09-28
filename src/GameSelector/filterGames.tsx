import { Game } from '../interface';

export const GAME_STATE_IN_PROGRESS = 'inProgress';
export const GAME_STATE_FINISHED = 'finished';

export type GameState =
  | typeof GAME_STATE_IN_PROGRESS
  | typeof GAME_STATE_FINISHED;

export type FilterGameState = GameState | 'all';

export const filterGamesByGameState = (
  userGames: Game[] | undefined,
  filterGameState: FilterGameState,
) => {
  switch (filterGameState) {
    case GAME_STATE_IN_PROGRESS: {
      return userGames?.filter((game) => !game.hasWinner);
    }

    case GAME_STATE_FINISHED: {
      return userGames?.filter((game) => !!game.hasWinner);
    }

    default:
      return userGames;
  }
};
