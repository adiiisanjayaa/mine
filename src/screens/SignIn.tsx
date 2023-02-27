/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useData, useTheme } from '../hooks';
import { Block, Button, Input, Text } from '../components';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native-gesture-handler';
import Helper from '../utility/helper';
import Toast from 'react-native-simple-toast';
import { ErrorMessage } from '@hookform/error-message';
import { DoSignIn } from '../lib/firebaseProvider';

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
  const { handleUser } = useData();

  const onSubmit = async (data) => {
    if (isValid) {
      console.log('submited ', data);
      register('loginInput', { minLength: 4 });
      const isEmail = Helper.isValidEmail(data.email);
      if (isEmail) {
        try {
          setLoading(true);
          const signInResult = await DoSignIn(data.email, data.password);
          setLoading(false);
          if (signInResult.result != null) {
            console.log('User account signed in!', signInResult.result);
            const firebaseUser = signInResult.result.user;
            handleUser({
              uid: firebaseUser.uid ?? '',
              name: firebaseUser.displayName ?? '',
              address: '',
              email: firebaseUser.email ?? '',
              website: '',
              avatar: firebaseUser.photoURL ?? '',
              backgroundImage: '',
            });

            Toast.showWithGravity('Success, User account signed in', Toast.LONG, Toast.TOP);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Root' }],
            });
          } else {
            setError('loginInput', { type: 'custom', message: signInResult.error });
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
          setError('loginInput', { type: 'custom', message: 'Email or password incorrect' });
        }
      } else {
        setError('loginInput', { type: 'custom', message: 'Email not valid!' });
      }
    }
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
            secureTextEntry={true}
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
              lineHeight={20}
              marginTop={10}
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
