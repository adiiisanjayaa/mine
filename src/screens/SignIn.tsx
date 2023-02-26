/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useTheme } from '../hooks';
import { Block, Button, Input, Text } from '../components';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
import Helper from '../utility/helper';
import Toast from 'react-native-simple-toast';
import { ErrorMessage } from '@hookform/error-message';

const SignIn = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });
  const [isLoading, setLoading] = useState(false);

  const onSubmit = data => {
    if (isValid) {
      console.log('submited ', data);
      register('loginInput', { minLength: 4 });
      const isEmail = Helper.isValidEmail(data.email);
      if (isEmail) {
        try {
          DoSignIn(data.email, data.password);
        } catch (error) {
          console.log(error);
        }
      } else {
        setError('loginInput', { type: 'custom', message: 'Email not valid!' });
      }
    }
  };

  const DoSignIn = (email: string,
    password: string,) => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        console.log('User account signed in!');
        Toast.showWithGravity('Success, User account signed in', Toast.LONG, Toast.TOP);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          setError('loginInput', { type: 'custom', message: 'That email address is already in use!' });
        } else if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          setError('loginInput', { type: 'custom', message: 'That email address is invalid!' });
        } else {
          setError('loginInput', { type: 'custom', message: 'Email or password incorrect' });
        }

        console.error(error);
      });
  };

  return (
    <Block color={colors.light} marginTop={StatusBar.currentHeight} style={{ padding: sizes.padding }} >
      <ScrollView >
        <Block flex={1} marginTop={sizes.l} >
          <Block style={styles.container}>
            <Text
              size={sizes.h2}
              transform="capitalize"
              color={colors.black}
              bold
              lineHeight={50}
              align="center"
              marginHorizontal={sizes.l}>
              SIGN IN
            </Text>
          </Block>
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
            name="password"
            label="Password"
            placeholder="Enter your Password"
            backgroundColor={colors.secondary}
            marginTop={sizes.spaceInput}
          />
          <ErrorMessage
            errors={errors}
            name="loginInput"
            render={({ message }) => <Text
              p
              color={colors.danger}
              bold
              lineHeight={30}
              align="left">
              *{message}
            </Text>}
          />
          {isLoading ? <ActivityIndicator color={colors.primary} size={50} style={{ marginTop: 10 }} /> : <Button
            radius={sizes.s}
            color={colors.primary}
            marginTop={sizes.m}
            onPress={handleSubmit(onSubmit)}>
            <Text
              p
              transform="capitalize"
              color={colors.white}
              bold
              marginHorizontal={sizes.m}>
              Sign In
            </Text>
          </Button>}
          <Pressable onPress={() => { navigation.push('SignUp'); }}>
            <Text
              p
              color={colors.black}
              bold
              lineHeight={50}
              align="center"
              marginHorizontal={sizes.l}>
              Don't have an account? {' '}
              <Text
                p
                color={colors.success}
                bold
                lineHeight={50}
                align="center"
                marginHorizontal={sizes.l}>
                SIGN UP
              </Text>
            </Text>
          </Pressable>
        </Block>
      </ScrollView >
    </Block >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUp: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default SignIn;
