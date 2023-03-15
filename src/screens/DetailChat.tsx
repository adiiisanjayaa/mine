/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useData, useTheme } from '../hooks';
import { Block, Input, Text } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import { defaultProfilePic, typeChat } from '../constants/constants';
import { getMessageByGroupUid, sentMessage } from '../lib/firebaseProvider';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { IUser } from '../constants/types';
import Moment from 'moment';
import { useForm } from 'react-hook-form';

type StackParamsList = {
  DetailChat: { toUser: IUser };
}

const DetailChat = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const route = useRoute<RouteProp<StackParamsList, 'DetailChat'>>();
  const [isLoading, setLoading] = useState(true);
  const [currentGroupUID, setCurrentGroupUID] = useState<string>();
  const [toUser, setToUser] = useState<IUser>();
  const [messages, setMessages] = useState<Array<FirebaseFirestoreTypes.DocumentData>>();
  const { user } = useData();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length]);
  async function init(): Promise<void> {
    try {
      setToUser(route.params.toUser);
      const fromUid = user.uid;
      const toUid = route.params !== undefined ? route.params.toUser.uid : '';
      console.log('currentUserUid: ', fromUid);
      console.log('toUid: ', toUid);
      console.log('groupUID : ', toUid.toString() + fromUid.toString());
      getMessages(fromUid.toString(), toUid.toString());
    } catch (error) {
    } finally {
      //loading finished
      setLoading(false);
    }
  }

  const getMessages = (fromUid: string, toUid: string) => {
    getMessageByGroupUid(fromUid.toString(), toUid.toString()).then((res) => {
      setMessages(res?.result);
      setCurrentGroupUID(res?.groupUID);
      console.log('message: ', res);
    });
  };

  const sentNewMessage = (message: string) => {
    const fromUid = user.uid;
    const toUid = route.params !== undefined ? route.params.toUser.uid : '';
    sentMessage(currentGroupUID, user, route.params.toUser, message, typeChat.text.toString()).then(() => {
      getMessages(fromUid.toString(), toUid.toString());
      reset();
    });
  };

  const onSubmit = async (data) => {
    if (isValid) {
      console.log('submited ', data);
      sentNewMessage(data.message);
    }
  };

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
      flex: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
          <Avatar
            title={toUser?.name ?? '-'}
            size="medium"
            rounded
            source={toUser?.avatar != null && toUser?.avatar !== '' ? { uri: toUser?.avatar } : defaultProfilePic}
          />
          <ListItem.Content>
            <Text h5 bold={true} color={colors.text}>
              {toUser?.name ?? '-'}
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
        {messages === undefined ?
          <Block color={colors.light} marginTop={StatusBar.currentHeight} style={styles.container} >
            <Loading />
          </Block> : <FlatList
            data={messages}
            style={[styles.flatList]}
            alwaysBounceVertical={true}
            bounces={true}
            inverted
            renderItem={({ item }) => {
              const isFrom = item.fromUid === user.uid;
              return (
                <Block row flex={0} style={[(!isFrom ? styles.containerItemChatLeft : styles.containerItemChatRight), { marginVertical: 5 }]}>
                  <Block flex={0} style={!isFrom ? styles.containerItemChatLeft : styles.containerItemChatRight}>
                    <Block flex={0} style={!isFrom ? styles.chatLeft : styles.chatRight}>
                      <Text
                        size={12}
                        color={!isFrom ? colors.primary : colors.white}
                        bold>
                        {item.content}
                      </Text>
                    </Block>
                    <Text
                      size={10}
                      color={colors.gray}>
                      {Moment(item.createdAt).format('hh:mm ddd')}
                    </Text>
                  </Block>
                </Block>
              );
            }}
            keyExtractor={item => item.createdAt}
          />
        }
      </Block>

      <View style={styles.inputContainer}>
        <Input
          control={control}
          name="message"
          placeholder="Type your message here..."
          iconRight={
            <Pressable onPress={handleSubmit(onSubmit)}>
              <Ionicons name="send" size={sizes.icon25} color={colors.icon} />
            </Pressable>
          }
          backgroundColor={colors.white}
          onSubmitEditing={handleSubmit(onSubmit)}
        />
      </View>
    </Block>
  );
};

export default DetailChat;
