const ANIMATED_ACTION_BY_DIRECTION: any = [];
ANIMATED_ACTION_BY_DIRECTION['E'] = { translate: 'translateX', value: 43 };
ANIMATED_ACTION_BY_DIRECTION['W'] = { translate: 'translateX', value: -43 };
ANIMATED_ACTION_BY_DIRECTION['N'] = { translate: 'translateY', value: -43 };
ANIMATED_ACTION_BY_DIRECTION['S'] = { translate: 'translateY', value: 43 };

export const getAnimatedActionByDirection = (direction: string) => {
  if (!direction) {
    return { translate: 'translateY', value: 0 };
  }
  return ANIMATED_ACTION_BY_DIRECTION[direction];
};
