import { ACCOUNT, GAME_SELECTOR, GAME_STATE } from '../constants';

export const useNavigation = (navigation: any) => {
  const navigateToGameState = (id: number) => {
    navigation.navigate(GAME_STATE, {
      gameId: id,
    });
  };

  const navigateToGameSelector = () => {
    navigation.navigate(GAME_SELECTOR);
  };

  const navigateToUserAccount = () => {
    navigation.navigate(ACCOUNT);
  };

  return { navigateToGameState, navigateToGameSelector, navigateToUserAccount };
};
