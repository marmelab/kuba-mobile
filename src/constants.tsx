import Constants from 'expo-constants';

export const API_URL = Constants?.manifest?.extra?.API_URL;
export const GATEWAY_URL = Constants?.manifest?.extra?.GATEWAY_URL;

export const DIRECTION_CHARS = {
  north: '\u25b2',
  east: '\u25ba',
  south: '\u25bc',
  west: '\u25c4',
};

export const DIRECTIONS_ICONS = {
  north: 'arrow-bold-up',
  east: 'arrow-bold-right',
  south: 'arrow-bold-down',
  west: 'arrow-bold-left',
};
