import React, { } from 'react';
import { useTheme } from '../hooks';
import { Block, Text } from '../components';
import { StatusBar, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

const ComingSoon = () => {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundImage: {
      width: 300,
      height: 200,
    },
  });

  return (
    <Block color={colors.light} marginTop={StatusBar.currentHeight} style={styles.container} >
      <StatusBar
        animated={true}
        backgroundColor="#ffffff"
        barStyle={'dark-content'}
      />
      <Image
        style={styles.backgroundImage}
        resizeMode="contain"
        source={require('../assets/images/coming-soon.png')}
      />
      <Text
        transform="capitalize"
        bold
        size={sizes.h4}
        lineHeight={40}
        marginHorizontal={sizes.m}>
        Coming Soon
      </Text>
    </Block>
  );
};

export default ComingSoon;
