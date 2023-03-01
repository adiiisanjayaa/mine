/* eslint-disable react-native/no-inline-styles */
import React, { } from 'react';
import { useTheme } from '../hooks';
import { Block, Input, Text } from '../components';
import Feather from 'react-native-vector-icons/Feather';
import { Pressable, StatusBar, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { profilePic } from '../constants/constants';

const Contacts = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const DATA = [
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'Masih Hidup',
      url: profilePic,
    },
  ];

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

  return (
    <Block color={colors.light} flex={1} marginTop={StatusBar.currentHeight}>
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
              placeholder="Search for chat & messages"
              icon={<Feather name="search" size={sizes.icon25} color={colors.icon} />}
              backgroundColor={colors.secondary}
            />
          </Block>
        </ListItem>
      </Block>

      {/* Chat List */}
      <Block flex={1}>
        <FlatList
          data={DATA}
          alwaysBounceVertical={true}
          bounces={true}
          renderItem={({ item, index }) => {
            const isEnd = index === DATA.length - 1;
            return (<ListItem onPress={() => {
              navigation.push('DetailChat');
            }} containerStyle={[styles.itemList, { paddingHorizontal: sizes.padding, paddingTop: 10, paddingBottom: isEnd ? 100 : 10 }]} >
              <Avatar
                title={item.title}
                size="medium"
                source={{ uri: item.url }}
              />
              <ListItem.Content>
                <Text h5 bold={true} color={colors.text}>
                  {item.title}
                </Text>
                <Text color={colors.text}>
                  {item.subTitle}
                </Text>
              </ListItem.Content>
            </ListItem>);
          }}
          keyExtractor={item => item.id}
        />
      </Block>
    </Block>
  );
};

export default Contacts;
