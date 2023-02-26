/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { useTheme } from '../hooks';
import { Block, Button, Input, Text } from '../components';
import { Pressable, StatusBar, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import { ErrorMessage } from '@hookform/error-message';
import { ActivityIndicator } from 'react-native';
import Helper from '../utility/helper';
import { DoSignUp } from '../lib/firebaseProvider';

const SignUp = ({ navigation }) => {
  const { colors, sizes } = useTheme();
  const {
    control,
    handleSubmit,
    setError,
    register,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (isValid) {
      console.log('submited ', data);
      register('registerInput', { minLength: 4 });
      const isEmail = Helper.isValidEmail(data.email);
      if (isEmail) {
        try {
          setLoading(true);
          const signUpResult = await DoSignUp(data.email, data.password);
          setLoading(false);
          if (signUpResult.result != null) {
            console.log('User account created & signed in!');
            Toast.showWithGravity('Success, User account created', Toast.LONG, Toast.TOP);
            navigation.pop();
          } else {
            setError('registerInput', { type: 'custom', message: signUpResult.error });
          }
        } catch (error) {
          setError('registerInput', { type: 'custom', message: 'Something went wrong!' });
          console.error(error);
          setLoading(false);
        }
      } else {
        setError('registerInput', { type: 'custom', message: 'Email not valid!' });
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
              SIGN UP
            </Text>
          </Block>
          <Input
            control={control}
            name="name"
            label="Name"
            placeholder="Enter your name"
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
            name="password"
            label="Password"
            secureTextEntry={true}
            placeholder="Enter your Password"
            backgroundColor={colors.secondary}
            marginTop={sizes.spaceInput}
          />
          <ErrorMessage
            errors={errors}
            name="registerInput"
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
              Sign Up
            </Text>
          </Button>}

          <Pressable onPress={() => { navigation.push('SignIn'); }}>
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
                SIGN IN
              </Text>
            </Text>
          </Pressable>
        </Block>
      </ScrollView>
    </Block>
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

export default SignUp;
