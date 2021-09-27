import Constants from 'expo-constants';

export const API_URL = Constants?.manifest?.extra?.API_URL;
export const GATEWAY_URL = Constants?.manifest?.extra?.GATEWAY_URL;

export const GAME_STATE = 'GameState';
export const GAME_SELECTOR = 'GameSelector';
export const ACCOUNT = 'Account';
export const HOME = 'Home';
export const LOGIN = 'Login';

export const DIRECTION_CHARS = {
  north: '\u25b2',
  east: '\u25ba',
  south: '\u25bc',
  west: '\u25c4',
};
