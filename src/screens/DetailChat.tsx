/* eslint-disable react-native/no-inline-styles */
import React, { } from 'react';
import { useTheme } from '../hooks';
import { Block, Input, Text } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';

enum ChatPosition {
  left,
  right
}

const DetailChat = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const DATA = [
    {
      id: Math.random().toString(),
      content: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    }, {
      id: Math.random().toString(),
      content: 'Haloo pagi',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    }, {
      id: Math.random().toString(),
      content: 'Haloo pagi',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    }, {
      id: Math.random().toString(),
      content: 'Haloo pagi',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    }, {
      id: Math.random().toString(),
      content: 'Haloo pagi',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    }, {
      id: Math.random().toString(),
      content: 'Haloo pagi',
      time: '14:55 PM',
      position: ChatPosition.left,
    },
    {
      id: Math.random().toString(),
      content: 'Haloo pagi juga',
      time: '14:57 PM',
      position: ChatPosition.right,
    },

  ];

  const styles = StyleSheet.create({
    itemList: {
      backgroundColor: colors.light,
      padding: 20,
      margin: 0,
      borderBottomColor: colors.gray,
      borderBottomWidth: 0.2,
    },
    flatList: {
      paddingHorizontal: 20,
      marginTop: 20,
    },
    chatRight: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderTopLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    chatLeft: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    containerItemChatLeft: {
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
    },
    containerItemChatRight: {
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
    },
    inputContainer: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      bottom: 0,
      padding: sizes.padding,
      backgroundColor: colors.primary,
      // position: 'absolute',
      flex: 0,
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
          <Avatar
            title="Adi Sanjaya"
            size="medium"
            source={{ uri: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png' }}
          />
          <ListItem.Content>
            <Text h5 bold={true} color={colors.text}>
              Adi Sanjaya
            </Text>
            <Text color={colors.gray}>
              Online
            </Text>
          </ListItem.Content>

          <Block flex={0} justify="flex-end" align="flex-end">
            <Entypo name="dots-three-vertical" size={sizes.icon20} color={colors.icon} />
          </Block>
        </ListItem>
      </Block>

      {/* Chat List */}
      <Block flex={1}>
        <FlatList
          data={DATA}
          inverted
          style={[styles.flatList]}
          alwaysBounceVertical={true}
          bounces={true}
          renderItem={({ item }) => {
            return (
              <Block row flex={0} style={[(item.position === ChatPosition.left ? styles.containerItemChatLeft : styles.containerItemChatRight), { marginVertical: 5 }]}>
                <Block flex={0} style={item.position === ChatPosition.left ? styles.containerItemChatLeft : styles.containerItemChatRight}>
                  <Block flex={0} style={item.position === ChatPosition.left ? styles.chatLeft : styles.chatRight}>
                    <Text
                      size={12}
                      color={item.position === ChatPosition.left ? colors.primary : colors.white}
                      bold>
                      {item.content}
                    </Text>
                  </Block>
                  <Text
                    size={10}
                    color={colors.gray}>
                    {item.time}
                  </Text>
                </Block>
              </Block>
            );
          }}
          keyExtractor={item => item.id}
        />
      </Block>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Type your message here..."
          iconRight={<Ionicons name="send" size={sizes.icon25} color={colors.icon} />}
          backgroundColor={colors.white}
        />
      </View>
    </Block>
  );
};

export default DetailChat;
