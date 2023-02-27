import React, { } from 'react';
import { useTheme } from '../hooks/';
import { Block, Input, Text } from '../components/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { useData } from '../hooks';


const Home = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const { handleUser, user } = useData();
  const DATA = [
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
    {
      id: Math.random().toString(),
      title: 'Adi Sanjaya',
      subTitle: 'hii how are you today ?',
      url: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    },
  ];

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
            Chats
          </Text>
          <Feather name="edit" size={sizes.icon25} color={colors.icon} />
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
        <FlatList
          data={DATA}
          alwaysBounceVertical={true}
          bounces={true}
          renderItem={({ item, index }) => {
            const isEnd = index === DATA.length - 1;
            // eslint-disable-next-line react-native/no-inline-styles
            return (<ListItem onPress={() => {
              handleUser({ uid: 'sdf', email: 'sds', address: 'sds', avatar: 'sds', backgroundImage: 'sds', name: 'sds', website: 'sds' });
              console.log('current user : ', user);
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

              <Block flex={0} justify="flex-end" align="flex-end">
                <Text color={colors.text}>
                  14:50
                </Text>
                <Ionicons name="ios-checkmark-done" size={sizes.icon25} color={colors.icon} />
              </Block>
            </ListItem>);
          }}
          keyExtractor={item => item.id}
        />
      </Block>
    </Block>
  );
};

export default Home;
