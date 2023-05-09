/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useTheme } from '../hooks';
import { Block, Button, Input, Text } from '../components';
import { ActivityIndicator, Alert, Pressable, StatusBar, View } from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useData } from '../hooks';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DoSignOut } from '../lib/firebaseProvider';
// import Toast from 'react-native-simple-toast';
import { defaultProfilePic } from '../constants/constants';
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const { user, updateUser } = useData();
  const [isLoading, setLoading] = useState(false);
  const [avatarData, setAvatarData] = useState('');
  const includeExtra = true;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: user.name,
      address: user.address,
      website: user.website,
      email: user.email,
    },
  });

  const onSubmit = async (data) => {
    if (isValid) {
      console.log('Update Profile : ', data);
      setLoading(true);
      await updateUser({
        uid: user.uid,
        email: data.email,
        address: data.address,
        name: data.name,
        website: data.website,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
      });
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    itemList: {
      backgroundColor: colors.light,
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: 20,
      margin: 0,
      padding: 0,
    },
    flatList: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    behind: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 0,
      top: 0,
    },
    subHeaderImage: {},
    backgroundImage: {
      height: 150,
      width: '100%',
    },
    profileImage: {
      height: 100,
      width: 100,
      position: 'absolute',
      bottom: -50,
      alignSelf: 'center',
    },
    header: {
      width: '100%',
      position: 'absolute',
      top: 0,
      padding: 10,
    },
    logout: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    editIcon: {
      backgroundColor: colors.primary,
      justifyContent: 'center', alignItems: 'center',
      borderRadius: 50,
      width: 30,
      height: 30,
      position: 'absolute',
      right: 0,
      bottom: 0,
      borderColor: 'white',
      borderWidth: 3,
    },
  });

  return (
    <Block color={colors.light} flex={1} marginTop={StatusBar.currentHeight} >
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle={'dark-content'}
      />
      <ScrollView >
        {/* App Bar */}
        <View>
          <Image style={styles.backgroundImage} borderBottomLeftRadius={55} borderBottomRightRadius={55} source={{ uri: user.backgroundImage !== null && user.backgroundImage !== '' ? user.backgroundImage : 'https://static.vecteezy.com/system/resources/previews/002/099/717/original/mountain-beautiful-landscape-background-design-illustration-free-vector.jpg' }} />
          <Block center={true} flex={0} row style={styles.header} justify="flex-end" align="center">
            <Pressable onPress={async () => {
              const signOut = await DoSignOut();
              if (signOut) {
                // Toast.showWithGravity('Success, signed out', Toast.LONG, Toast.BOTTOM);
                Alert.alert('Signed out',);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignIn' }],
                });
              } else {
                // Toast.showWithGravity('Failed, sign out', Toast.LONG, Toast.BOTTOM);
                Alert.alert('Failed sign out',);
              }
            }}>
              <Block style={styles.logout}><MaterialIcons name="logout" size={sizes.icon25} color={colors.white} /></Block>
            </Pressable>
          </Block>
          <Block center={true} flex={1} row style={styles.profileImage} >
            <Avatar
              size={100}
              rounded={true}
              source={user.avatar !== null && user.avatar !== '' ? { uri: user.avatar } : avatarData !== '' ? { uri: avatarData } : defaultProfilePic}
            />
            <Pressable onPress={async () => {
              const result = await launchImageLibrary({
                selectionLimit: 0,
                mediaType: 'photo',
                includeBase64: false,
                includeExtra,
              },);
              if (result.assets !== undefined) {
                console.log('result image library : ', result.assets[0].uri);
                if (result.assets[0].uri !== undefined) {
                  setAvatarData(result.assets[0].uri);
                }
              }
            }}>
              <Block style={styles.editIcon}><Ionicons name="camera" size={15} color={colors.white} /></Block>
            </Pressable>
          </Block>
        </View>

        <Block flex={0} marginTop={sizes.l} marginBottom={80} style={{ padding: sizes.padding }}>
          <Input
            control={control}
            name="name"
            placeholder="Enter your name"
            label="Name"
            backgroundColor={colors.secondary}
          />
          <Input
            control={control}
            name="address"
            label="Address"
            placeholder="Enter your address"
            backgroundColor={colors.secondary}
            marginTop={sizes.spaceInput}
          />
          <Input
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            backgroundColor={colors.secondary}
            marginTop={sizes.spaceInput}
          />
          <Input
            control={control}
            name="website"
            label="Website"
            placeholder="Enter your website"
            backgroundColor={colors.secondary}
            marginTop={sizes.spaceInput}
          />
          {/* <ErrorMessage
            errors={errors}
            name="updateProfile"
            render={({ message }) => <Text
              p
              color={colors.danger}
              bold
              lineHeight={20}
              marginTop={10}
              align="left">
              *{message}
            </Text>}
          /> */}
          {isLoading ? <ActivityIndicator color={colors.primary} size={50} style={{ marginTop: 10 }} /> : <Button
            radius={sizes.s}
            color={colors.primary}
            marginTop={sizes.spaceInput}
            onPress={handleSubmit(onSubmit)}>
            <Text
              p
              transform="capitalize"
              color={colors.white}
              bold
              marginHorizontal={sizes.m}>
              Submit
            </Text>
          </Button>}
        </Block>
      </ScrollView>
    </Block>
  );
};

export default Profile;
