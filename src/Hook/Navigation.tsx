export const useNavigation = (navigation: any) => {
  const navigateToGameState = (id: number) => {
    navigation.navigate('GameState', {
      gameId: id,
    });
  };

  const navigateToGameSelector = () => {
    navigation.navigate('GameSelector');
  };

  const navigateToUserAccount = () => {
    navigation.navigate('Account');
  };

  return { navigateToGameState, navigateToGameSelector, navigateToUserAccount };
};
