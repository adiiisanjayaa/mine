
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useData, useTheme } from '../hooks/';
import { Block, Button, Input, Text } from '../components/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StatusBar, StyleSheet, Modal, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { defaultProfilePic } from '../constants/constants';
import { Loading } from '../components/Loading';
import firestore, { } from '@react-native-firebase/firestore';
import moment from 'moment';
import { IURecentChat, IUser } from '../constants/types';
import { GetUserByUid, readMsg, deleteChatByUID } from '../lib/firebaseProvider';
// import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

const Home = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const { user } = useData();
  const [isLoading, setLoading] = useState(true);
  const [isShowPopupDelete, setShowPopupDelete] = useState(false);
  const [currentGroupUID, setCurrentGroupUID] = useState('');
  const [isRefresh, setRefresh] = useState(false);
  const [recentChat, setRecentChat] = useState<Array<IURecentChat>>([]);
  // const toast = useToast();

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    // init();
    setRefresh(false);
  }, []);

  const getUsers = async (doc) => {
    return new Promise((resolve) => {
      const x = doc.data();
      // var data: Array<IURecentChat> = [];
      return GetUserByUid(x.toUsers[0].toString()).then(async (toUsers) => {
        if (toUsers !== undefined) {
          const userData = toUsers;
          const value: IURecentChat = {
            data: x,
            userData: userData,
          };
          resolve(value);
        } else {
          console.log('toUsers undefined');
        }

      });
    });
  };

  const getMsg = () => {
    return firestore().collection('messages').where('fromUsers', 'array-contains-any', [user.uid]).onSnapshot(async (querySnapshot) => {
      var data: Array<IURecentChat> = [];

      if (querySnapshot?.docs.length > 0) {
        querySnapshot?.docs.forEach(async (x) => {
          var res = await getUsers(x);
          data.push(res as IURecentChat);
          console.log('***', data.length);
          if (querySnapshot?.docs.length === data.length) {
            setRecentChat(data);
            console.log(recentChat);
          }
        });
      } else {
        setRecentChat([]);
      }

      setLoading(false);
    });
  };

  useEffect(() => {
    const unsubscribe = getMsg();
    return () => (unsubscribe)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = StyleSheet.create({
    itemList: {
      backgroundColor: colors.light,
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: 20,
      margin: 0,
      padding: 0,
    },
    paddingBottom: {
      paddingBottom: 20,
    },
    circle: {
      width: 23,
      height: 23,
      padding: 0,
      backgroundColor: colors.info,
      borderRadius: 25,
      justifyContent: 'center', alignItems: 'center',
      marginTop: 5,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Block color={colors.light} flex={1}>

      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle={'dark-content'}
      />
      {/* App Bar */}
      <Block flex={0} paddingHorizontal={sizes.padding} padding={sizes.padding}>
        <ModalDeleteChat
          isShowPopupDelete={isShowPopupDelete}
          setShowPopupDelete={setShowPopupDelete}
          groupUID={currentGroupUID}
        />

        <Block row flex={0} marginTop={StatusBar.currentHeight} justify="space-between" align="center">
          <FontAwesome name="angle-left" size={sizes.icon30} color={colors.white} />
          <Entypo name="dots-three-vertical" size={sizes.icon20} color={colors.icon} />
        </Block>
        <Block row flex={0} marginVertical={sizes.padding} justify="space-between" align="center">
          <Text h3 bold={true} color={colors.text}>
            Chat
          </Text>
          <Pressable onPress={() => {
            navigation.push('Contacts');
            // toast.show('', {
            //   type: 'custom_type',
            //   placement: 'top',
            //   duration: 2000,
            //   animationType: 'slide-in',
            //   data: { avatar: null, name: 'Adi Sanjaya', message: 'Test Pesan' },
            // });
          }}>
            <Feather name="edit" size={sizes.icon25} color={colors.icon} />
          </Pressable>
        </Block>
        {/* Search */}
        <Input
          placeholder="Search for chat & messages"
          icon={<Feather name="search" size={sizes.icon25} color={colors.icon} />}
          backgroundColor={colors.secondary}
        />
      </Block>
      {/* Chat List */}
      <Block flex={1}>
        {recentChat === undefined || recentChat.length === 0 ?
          <Block center paddingBottom={100}>
            <Text
              bold
              size={sizes.h4}
              lineHeight={40}
              color={colors.text}
              align="center"
              marginHorizontal={sizes.m}>
              No messages yet
            </Text>
          </Block>
          : <FlatList
            data={recentChat}
            alwaysBounceVertical={true}
            bounces={true}
            refreshControl={
              <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => {
              const data = item.data;
              const userData = item.userData;
              if (userData !== undefined) {
                // const indexUser = userData[0].uid === user.uid ? 1 : 0;
                const isFrom = data.lastChatUID === user.uid ? true : false;
                const userChat = userData;
                var read: boolean = data.read;
                var isOpen: boolean = data.isOpen;
                // const isEnd = index === recentChat.length - 1;
                return (<ListItem
                  onLongPress={() => {
                    console.log('long pressed');
                    setShowPopupDelete(true);
                    setCurrentGroupUID(user.uid.toString() + userChat.uid.toString());
                  }}
                  onPress={() => {
                    if (isFrom) {
                      readMsg(user.uid.toString(), userChat.uid.toString(), false);
                    } else {
                      readMsg(user.uid.toString(), userChat.uid.toString(), true);
                    }

                    console.log(data);
                    const toUser: IUser = {
                      uid: userChat.uid,
                      name: userChat.name,
                      email: userChat.email,
                      avatar: userChat.avatar,
                      address: userChat.address,
                      backgroundImage: userChat.backgroundImage,
                      website: userChat.website,
                      token: userChat.token,
                    };
                    navigation.push('DetailChat', { toUser: toUser });
                  }} containerStyle={[styles.itemList, { paddingHorizontal: sizes.padding, paddingTop: 10, paddingBottom: 10 }]} >
                  <Avatar
                    title={userChat.name}
                    size="medium"
                    rounded
                    source={userChat.avatar != null && userChat.avatar !== '' ? { uri: userChat.avatar } : defaultProfilePic}
                  />
                  <ListItem.Content>
                    <Text h5 bold={true} color={colors.text}>
                      {userChat.name}
                    </Text>
                    <Text color={colors.text}>
                      {data.lastChat}
                    </Text>
                  </ListItem.Content>

                  <Block flex={0} justify="flex-end" align="flex-end">
                    <Text color={colors.text}>
                      {moment(data.createdAt).format('hh:mm ddd')}
                    </Text>
                    {isFrom ?
                      <Ionicons name="ios-checkmark-done" size={sizes.icon25} color={read ? colors.info : colors.icon} /> :
                      isOpen ?
                        <View /> :
                        <View style={styles.circle}>
                          <Text color={colors.light} size={10}>{data.unRead}</Text>
                        </View>
                    }
                  </Block>
                </ListItem>);
              } else {
                return <></>;
              }
            }}
            keyExtractor={item => item.data.fromUsers[0].toString() + item.data.toUsers[0].toString()}
          />}
      </Block>
    </Block>
  );
};

export default Home;

function ModalDeleteChat({ isShowPopupDelete, setShowPopupDelete, groupUID }) {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    itemList: {
      backgroundColor: colors.light,
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: 20,
      margin: 0,
      padding: 0,
    },
    paddingBottom: {
      paddingBottom: 20,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.secondary,
      padding: 20,
      borderRadius: 10,
      marginHorizontal: 30,
    },
  });

  return (<Modal animationType={'fade'} transparent={true} visible={isShowPopupDelete} onRequestClose={() => {
    console.log('Modal has been closed.');
  }}>
    <Block flex={1} center>
      <View style={styles.modal}>
        <Text bold size={sizes.p} lineHeight={20} color={colors.text} align="center" marginHorizontal={sizes.m}>
          Are you sure want to delete this chat?
        </Text>
        <Block row flex={0}>
          <Button
            radius={sizes.s}
            color={colors.danger}
            height={40}
            marginTop={sizes.spaceInput}
            marginHorizontal={10}
            onPress={async () => {
              setShowPopupDelete(false);
              await deleteChatByUID(groupUID);
            }}
          >
            <Text p transform="capitalize" color={colors.white} bold marginHorizontal={sizes.m}>
              Delete
            </Text>
          </Button>
          <Button radius={sizes.s} color={colors.primary} height={40} marginTop={sizes.spaceInput} marginHorizontal={10} onPress={() => {
            setShowPopupDelete(false);
          }}>
            <Text p transform="capitalize" color={colors.white} bold marginHorizontal={sizes.m}>
              Cancel
            </Text>
          </Button>
        </Block>
      </View>
    </Block>
  </Modal>);
}
