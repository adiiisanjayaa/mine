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
import { Alert } from 'react-native';
// import Toast from 'react-native-simple-toast';

export const DataContext = React.createContext({});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de init function.
    console.log('current user : ', user);
    if (user === undefined) {
      console.log('run init');
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function init(): Promise<void> {
    try {
      const currentUser = auth().currentUser;
      if (currentUser != null) {
        await getUserByUid(currentUser.uid.toString()).then((doc) => {
          const data = doc.data();
          if (data !== undefined) {
            handleUser({
              uid: data.uid,
              email: data.email,
              name: data.name,
              address: data.address,
              website: data.website,
              avatar: data.avatar,
              backgroundImage: data.backgroundImage,
            });
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
    async (payload: IUser | undefined) => {
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
          await UpdateUser(payload).then(() => {
            init();
            // Toast.showWithGravity('Success update profile', Toast.LONG, Toast.BOTTOM);
            Alert.alert('Profile updated',);
          });
        } catch (err) {
          console.log('failed update user', err);
          // Toast.showWithGravity('Failed, update profile', Toast.LONG, Toast.BOTTOM);
          Alert.alert('Failed update profile',);
        }
      }
    };

  const contextValue = {
    theme,
    setTheme,
    user,
    setUser,
    handleUser,
    updateUser,
    loading,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
