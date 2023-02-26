import React, { useCallback, useContext, useState } from 'react';

import {
  IUser,
  IUseData,
  ITheme,
} from '../constants/types';

import {
  USERS,
} from '../constants/mocks';
import { light } from '../constants';

export const DataContext = React.createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser>(USERS[0]);
  const [users, setUsers] = useState<IUser[]>(USERS);

  // handle users / profiles
  const handleUsers = useCallback(
    (payload: IUser[]) => {
      // set users / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(users)) {
        setUsers({ ...users, ...payload });
      }
    },
    [users, setUsers],
  );

  // handle user
  const handleUser = useCallback(
    (payload: IUser) => {
      // set user / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(user)) {
        setUser(payload);
      }
    },
    [user, setUser],
  );

  const contextValue = {
    theme,
    setTheme,
    user,
    users,
    handleUsers,
    handleUser,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
