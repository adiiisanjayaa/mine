import React, { } from 'react';
import { useTheme } from '../hooks';
import { Block, Button, Input, Text } from '../components';
import { StatusBar, View } from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Profile = () => {
  const { colors, sizes } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = data => {
    if (isValid) {
      console.log('submited ', data);
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
      width: '100%',
      position: 'absolute',
      bottom: -50,
    },
  });

  return (
    <Block color={colors.light} flex={1} marginTop={StatusBar.currentHeight} >
      <ScrollView >
        {/* App Bar */}
        <View>
          <Image style={styles.backgroundImage} borderBottomLeftRadius={55} borderBottomRightRadius={55} source={{ uri: 'https://static.vecteezy.com/system/resources/previews/002/099/717/original/mountain-beautiful-landscape-background-design-illustration-free-vector.jpg' }} />
          <Block center={true} flex={0} row style={styles.profileImage}>
            <Avatar
              size={100}
              source={{ uri: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png' }}
            />
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
          {errors.name && <Text>Duration is required.</Text>}
          <Button
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
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default Profile;
