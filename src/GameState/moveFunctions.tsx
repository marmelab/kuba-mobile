import { API_URL } from '../constants';
import { MoveMarbleReference } from '../interface';

export const isMovePossible = async (
  gameId: number,
  playerToken: string,
  player: number,
  direction: string,
) => {
  const response = await fetch(
    `${API_URL}/games/${gameId}/authorized-move?player=${player}&direction=${direction}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + playerToken,
      },
    },
  );
  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  }
};

export const moveMarble = async (
  moveMarbleReference: MoveMarbleReference | undefined,
) => {
  const response = await fetch(
    `${API_URL}/games/${moveMarbleReference?.gameId}/move-marble`,
    {
      method: 'POST',
      body: JSON.stringify({
        coordinates: moveMarbleReference?.coordinates,
        direction: moveMarbleReference?.direction,
        player: moveMarbleReference?.playerForAPI,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + moveMarbleReference?.playerToken,
      },
    },
  );

  if (!response.ok) {
    throw Error(response.statusText);
  }

  return await response.json();
};
