/**
 * @format
 */

import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage.notification === undefined) {
    return null;
  }
  let message_body = remoteMessage.notification.body;
  let message_title = remoteMessage.notification.title;
  Alert.alert(message_title ?? '-', message_body);
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return App;
}

AppRegistry.registerComponent(appName, () => App);
