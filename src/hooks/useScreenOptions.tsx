import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  StackHeaderTitleProps,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import { DrawerActions } from '@react-navigation/native';
import { StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types';

import Text from '../components/Text';
import useTheme from '../hooks/useTheme';
import Button from '../components/Button';
import Block from '../components/Block';

export default () => {
  const navigation = useNavigation();
  const { gradients, sizes } = useTheme();

  const menu = {
    headerStyle: { elevation: 0 },
    headerTitleAlign: 'left',
    headerTitleContainerStyle: { marginLeft: -sizes.sm },
    headerLeftContainerStyle: { paddingLeft: sizes.s },
    headerRightContainerStyle: { paddingRight: sizes.s },
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitle: ({ children }: StackHeaderTitleProps) => (
      <Text p>{children}</Text>
    ),
    headerLeft: () => (
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        {/* <Image source={icons.menu} radius={0} color={colors.icon} /> */}
        <Text>X</Text>
      </Button>
    ),
    headerRight: () => (
      <Block row flex={0} align="center" marginRight={sizes.padding}>
        <TouchableOpacity
          style={{ marginRight: sizes.sm }}
          onPress={() =>
            navigation.navigate('Screens', {
              screen: 'Profile',
            })
          }>
          {/* <Image source={icons.bell} radius={0} color={colors.icon} /> */}
          <Text>X</Text>
          <Block
            flex={0}
            right={0}
            width={sizes.s}
            height={sizes.s}
            radius={sizes.xs}
            position="absolute"
            gradient={gradients?.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Screens', {
              screen: 'Pro',
            })
          }>
          {/* <Image source={icons.basket} radius={0} color={colors.icon} /> */}
          <Text>X</Text>
          <Block
            flex={0}
            padding={0}
            justify="center"
            position="absolute"
            top={-sizes.s}
            right={-sizes.s}
            width={sizes.sm}
            height={sizes.sm}
            radius={sizes.sm / 2}
            gradient={gradients?.primary}>
            <Text white center bold size={10} lineHeight={10} paddingTop={3}>
              3
            </Text>
          </Block>
        </TouchableOpacity>
      </Block>
    ),
  } as StackHeaderOptions;

  const options = {
    stack: menu,
    components: {
      ...menu,
      headerTitle: () => (
        <Text p white>
          navigation.components
        </Text>
      ),
      headerRight: () => null,
      headerLeft: () => (
        <Button
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          {/* <Image source={icons.menu} radius={0} color={colors.white} /> */}
          <Text>X</Text>
        </Button>
      ),
    },
  };

  return options;
};
