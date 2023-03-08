/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { DataProvider, useTheme } from './src/hooks';
import AppNavigation from './src/navigation/App';
import { ToastProvider } from 'react-native-toast-notifications';
import { View } from 'react-native';
import { Text } from './src/components';
import { Avatar } from 'react-native-elements';
import { defaultProfilePic } from './src/constants/constants';

export default function App() {
  const { colors } = useTheme();
  return (
    <DataProvider>
      <ToastProvider renderType={{
        custom_type: (toast) => (
          <View style={{ padding: 20, marginTop: 20, width: '100%' }}>
            <View style={{ flexDirection: 'row', padding: 20, backgroundColor: colors.primary, width: '100%', borderRadius: 10, shadowColor: 'grey', shadowOffset: { height: 10, width: 5 }, shadowRadius: 10 }}>
              <Avatar
                title="user"
                size="medium"
                rounded
                source={toast.data.avatar != null && toast.data.avatar !== '' ? { uri: toast.data.avatar } : defaultProfilePic}
              />
              <View style={{ alignSelf: 'center', marginLeft: 10 }}>
                <Text bold={true} color={colors.white} size={14} >
                  {toast.data.name}
                </Text>
                <Text bold={true} color={colors.white} size={12} >
                  {toast.data.message}
                </Text>
              </View>
            </View>
          </View>
        ),
      }}>
        <AppNavigation />
      </ToastProvider>
    </DataProvider>
  );
}
