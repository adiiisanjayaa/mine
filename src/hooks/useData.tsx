import React, { useCallback, useContext, useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import {
  IUseData,
  ITheme,
} from '../constants/types';

import {
} from '../constants/mocks';
import { light } from '../constants';

export const DataContext = React.createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<FirebaseAuthTypes.UserCredential>();

  // handle user
  const handleUser = useCallback(
    (payload: FirebaseAuthTypes.UserCredential) => {
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
    handleUser,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
