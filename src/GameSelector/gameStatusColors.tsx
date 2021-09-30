export const GAME_STATUS_COLORS: any = [];
GAME_STATUS_COLORS[0] = {
  background: ['orange.400', 'amber.400'],
  foreground: 'black',
};
GAME_STATUS_COLORS[1] = {
  background: ['emerald.400', 'lime.400'],
  foreground: 'black',
};
GAME_STATUS_COLORS[2] = {
  background: ['error.600', 'danger.300'],
  foreground: 'black',
};

export const getGameStatusColor = (
  mobilePlayer: any,
  winnerId: number | undefined | null,
) => {
  if (!!winnerId) {
    return mobilePlayer.id === winnerId
      ? GAME_STATUS_COLORS[1]
      : GAME_STATUS_COLORS[2];
  }
  return GAME_STATUS_COLORS[0];
};
