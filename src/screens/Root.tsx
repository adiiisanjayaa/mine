import React, { useEffect } from 'react';
import BottomNavBar from '../components/BottomNavBar';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useToast } from 'react-native-toast-notifications';

const Root = () => {
  const toast = useToast();
  useEffect(() => {
    init();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification === undefined) {
        return null;
      }
      console.log('NOTIFICATION:', remoteMessage);
      let message_body = remoteMessage.notification.body;
      let message_title = remoteMessage.notification.title;
      let avatar = remoteMessage.data !== undefined ? remoteMessage.data.photoUrl : null;

      const message = message_title + ': ' + message_body;
      toast.show(message, {
        type: 'custom_type',
        placement: 'top',
        duration: 2000,
        animationType: 'slide-in',
        data: { avatar: avatar, name: message_title, message: message_body },
      });
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  };

  return (
    <BottomNavBar />
  );
};

export default Root;
