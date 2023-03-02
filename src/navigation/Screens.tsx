import React, { } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';

import { Root } from '../screens';
import { useScreenOptions } from '../hooks';
import DetailChat from '../screens/DetailChat';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import { useData } from '../hooks';
import Contacts from '../screens/Contacts';
import { SplashScreen } from '../components/SplashScreen';

const Stack = createStackNavigator();

export default () => {
  const screenOptions = useScreenOptions();
  const { loading, user } = useData();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      {user ?
        <Stack.Navigator screenOptions={screenOptions.stack} >
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ title: 'Root' }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: 'Sign In' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Sign Up' }}
          />
          <Stack.Screen
            name="DetailChat"
            component={DetailChat}
            options={{ title: 'Detail Chat' }}
          />
          <Stack.Screen
            name="Contacts"
            component={Contacts}
            options={{ title: 'Contacts' }}
          />
        </Stack.Navigator >
        :
        <Stack.Navigator screenOptions={screenOptions.stack} >
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: 'Sign In' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Sign Up' }}
          />
        </Stack.Navigator >}
    </>

  );
};
