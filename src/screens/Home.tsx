
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useData, useTheme } from '../hooks/';
import { Block, Input, Text } from '../components/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable, StatusBar, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { defaultProfilePic } from '../constants/constants';
import { Loading } from '../components/Loading';
import firestore, { } from '@react-native-firebase/firestore';
import moment from 'moment';
import { IURecentChat, IUser } from '../constants/types';
import { GetUserByUid } from '../lib/firebaseProvider';


const Home = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const { user } = useData();
  const [isLoading, setLoading] = useState(true);
  const [isRefresh, setRefresh] = useState(false);
  const [recentChat, setRecentChat] = useState<Array<IURecentChat>>([]);

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    // init();
    setRefresh(false);
  }, []);

  const getUsers = async (doc) => {
    return new Promise((resolve) => {
      const x = doc.data();
      // var data: Array<IURecentChat> = [];
      return GetUserByUid(x.users[0].toString()).then(async (user1) => {
        return GetUserByUid(x.users[1].toString()).then((user2) => {
          if (user1 !== undefined && user2 !== undefined) {
            const userData = [user1, user2];
            const value: IURecentChat = {
              data: x,
              userData: userData,
            };
            resolve(value);
          } else {
            console.log('user1 and user2 undefined');
          }
        });
      });
    });
  };

  useEffect(() => {
    console.log('user tolol: ', user);
    const unsubscribe = firestore().collection('messages').where('users', 'array-contains-any', [user.uid]).onSnapshot(async (querySnapshot) => {
      var data: Array<IURecentChat> = [];
      querySnapshot?.docs.forEach(async (x) => {
        var res = await getUsers(x);
        data.push(res as IURecentChat);
        console.log('***', data.length);
        if (querySnapshot?.docs.length === data.length) {
          setRecentChat(data);
        }
      });
      setLoading(false);
    });
    return () => unsubscribe();
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
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Block color={colors.light} flex={1}>
      {/* App Bar */}
      <Block flex={0} paddingHorizontal={sizes.padding} padding={sizes.padding}>
        <Block row flex={0} marginTop={StatusBar.currentHeight} justify="space-between" align="center">
          <FontAwesome name="angle-left" size={sizes.icon30} color={colors.white} />
          <Entypo name="dots-three-vertical" size={sizes.icon20} color={colors.icon} />
        </Block>
        <Block row flex={0} marginVertical={sizes.padding} justify="space-between" align="center">
          <Text h3 bold={true} color={colors.text}>
            Chat
          </Text>
          <Pressable onPress={() => { navigation.push('Contacts'); }}>
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
                const indexUser = userData[0].uid === user.uid ? 1 : 0;
                const userChat = userData[indexUser];
                var read: boolean = data.read.user1.uid === user.uid ? data.read.user2.read : data.read.user1.read;
                // const isEnd = index === recentChat.length - 1;
                return (<ListItem onPress={() => {
                  const toUser: IUser = {
                    uid: userChat.uid,
                    name: userChat.name,
                    email: userChat.email,
                    avatar: userChat.avatar,
                    address: userChat.address,
                    backgroundImage: userChat.backgroundImage,
                    website: userChat.website,
                  };
                  navigation.push('DetailChat', { toUser: toUser });
                }} containerStyle={[styles.itemList, { paddingHorizontal: sizes.padding, paddingTop: 10, paddingBottom: 10 }]} >
                  <Avatar
                    title={userChat.name}
                    size="medium"
                    rounded
                    source={userChat.avatar != null ? { uri: userChat.avatar } : defaultProfilePic}
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
                    <Ionicons name="ios-checkmark-done" size={sizes.icon25} color={read ? colors.info : colors.icon} />
                  </Block>
                </ListItem>);
              } else {
                return <></>;
              }
            }}
            keyExtractor={item => item.userData[0].uid.toString() + item.userData[1].uid.toString()}
          />}
      </Block>
    </Block>
  );
};

export default Home;
