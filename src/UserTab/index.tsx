import React from 'react';
import { UserType } from '../types';
import { Button } from 'native-base';

export const UserTab = (props: { user: UserType }) => {
  return <Button>{`${props.user.username}`}</Button>;
};
