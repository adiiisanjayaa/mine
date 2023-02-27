/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';


import {
  IUseData,
  ITheme,
  IUser,
} from '../constants/types';

import {
} from '../constants/mocks';
import { light } from '../constants';
import { getUserByUid, UpdateUser } from '../lib/firebaseProvider';
import auth from '@react-native-firebase/auth';

export const DataContext = React.createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de init function.
    init();
  }, []);

  async function init(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const currentUser = auth().currentUser;
      if (currentUser != null) {
        await getUserByUid(currentUser.uid.toString()).then((doc) => {
          const data = doc.data();

          if (data !== undefined) {
            console.log(data.name);
            setUser({ uid: data.uid, email: data.email, name: data.name, address: data.address, website: data.website, avatar: data.avatar, backgroundImage: data.backgroundImage });
            console.log('current user : ', user);
          }
        });
      }
    } catch (error) {
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  // handle user
  const handleUser = useCallback(
    async (payload: IUser) => {
      // set user / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(user)) {
        setUser(payload);
      }
    },
    [user, setUser],
  );

  const updateUser =
    async (payload: IUser) => {
      // set user / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(user)) {
        try {
          await UpdateUser(payload).then(() => { console.log('data updated'); });
        } catch (err) {
          console.log('failed update user', err);
        }
        handleUser(payload);
      }
    };


  const contextValue = {
    theme,
    setTheme,
    user,
    handleUser,
    updateUser,
    loading,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
