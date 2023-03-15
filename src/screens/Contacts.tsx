/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useTheme } from '../hooks';
import { Block, Input, Text } from '../components';
import Feather from 'react-native-vector-icons/Feather';
import { Pressable, StatusBar, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { defaultProfilePic } from '../constants/constants';
import { getUsers } from '../lib/firebaseProvider';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Loading } from '../components/Loading';
import { IUser } from '../constants/types';

const Contacts = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const [contact, setContact] = useState<Array<FirebaseFirestoreTypes.DocumentData>>();
  const [isLoading, setLoading] = useState<boolean>(true);

  const getAllUser = async () => {
    const users = await getUsers();
    const listUser: Array<FirebaseFirestoreTypes.DocumentData> = [];
    users.docs.forEach((doc) => {
      const data = doc.data();
      listUser.push(data);
    });
    setLoading(false);
    setContact(listUser);
  };

  useEffect(() => { getAllUser(); }, []);

  const styles = StyleSheet.create({
    itemList: {
      backgroundColor: colors.light,
      paddingHorizontal: 20,
      paddingVertical: 20,
      margin: 0,
    },
    paddingBottom: {
      paddingBottom: 20,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Block color={colors.light} flex={1} marginTop={StatusBar.currentHeight}>
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle={'dark-content'}
      />
      {/* App Bar */}
      <Block flex={0} >
        <ListItem containerStyle={[styles.itemList]} >
          <Pressable onPress={() => { navigation.pop(); }}>
            <Block flex={0} justify="flex-start" align="flex-start">
              <Feather name="chevron-left" size={sizes.icon30} color={colors.icon} />
            </Block>
          </Pressable>
          {/* Search */}
          <Block flex={1}>
            <Input
              placeholder="Search for contacts"
              iconRight={<Feather name="search" size={sizes.icon25} color={colors.icon} />}
              backgroundColor={colors.secondary}
            />
          </Block>
        </ListItem>
      </Block>

      {/* Chat List */}
      <Block flex={1}>
        <FlatList
          data={contact}
          alwaysBounceVertical={true}
          bounces={true}
          renderItem={({ item, index }) => {
            if (contact === undefined) { return <></>; }
            const isEnd = index === contact.length - 1;
            return (<ListItem onPress={() => {
              const toUser: IUser = {
                uid: item.uid,
                name: item.name,
                email: item.email,
                avatar: item.avatar,
                address: item.address,
                backgroundImage: item.backgroundImage,
                website: item.website,
              };
              navigation.push('DetailChat', { toUser: toUser });
            }} containerStyle={[styles.itemList, { paddingHorizontal: sizes.padding, paddingTop: 10, paddingBottom: isEnd ? 100 : 10 }]} >
              <Avatar
                title={item.name}
                size="medium"
                rounded
                source={item.avatar !== null && item.avatar !== '' ? { uri: item.avatar } : defaultProfilePic}
              />
              <ListItem.Content>
                <Text h5 bold={true} color={colors.text}>
                  {item.name ?? '-'}
                </Text>
                <Text color={colors.text}>
                  {item.email}
                </Text>
              </ListItem.Content>
            </ListItem>);
          }}
          keyExtractor={item => item.uid}
        />
      </Block>
    </Block>
  );
};

export default Contacts;
