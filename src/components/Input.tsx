import React, { useCallback, useState } from 'react';
import {
  TextInput,
  TextStyle,
  ViewStyle,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

import Block from './Block';
import Text from './Text';

import useTheme from '../hooks/useTheme';
import { IInputProps } from '../constants/types';
import { Controller } from 'react-hook-form';

const Input = ({
  id = 'Input',
  style,
  color,
  primary,
  secondary,
  tertiary,
  black,
  white,
  gray,
  danger,
  warning,
  success,
  info,
  disabled,
  label,
  icon,
  iconRight,
  marginBottom,
  marginTop,
  marginHorizontal,
  marginVertical,
  marginRight,
  marginLeft,
  backgroundColor,
  control,
  name,
  onFocus,
  ...props
}: IInputProps) => {
  const { colors, sizes } = useTheme();
  const [isFocused, setFocused] = useState(false);

  const handleFocus = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>, focus: boolean | ((prevState: boolean) => boolean)) => {
      setFocused(focus);
      focus && onFocus?.(event);
    },
    [setFocused, onFocus],
  );

  const colorIndex = primary
    ? 'primary'
    : secondary
      ? 'secondary'
      : tertiary
        ? 'tertiary'
        : black
          ? 'black'
          : white
            ? 'white'
            : gray
              ? 'gray'
              : danger
                ? 'danger'
                : warning
                  ? 'warning'
                  : success
                    ? 'success'
                    : info
                      ? 'info'
                      : null;
  const inputColor = color
    ? color
    : colorIndex
      ? colors?.[colorIndex]
      : colors.gray;

  const inputBoxStyles = StyleSheet.flatten([
    style,
    {
      minHeight: sizes.inputHeight,
      ...(marginBottom && { marginBottom: marginBottom }),
      ...(marginTop && { marginTop: marginTop }),
      ...(marginHorizontal && { marginHorizontal: marginHorizontal }),
      ...(marginVertical && { marginVertical: marginVertical }),
      ...(marginRight && { marginRight: marginRight }),
      ...(marginLeft && { marginLeft: marginLeft }),
    },
  ]) as ViewStyle;

  const inputContainerStyles = StyleSheet.flatten([
    {
      minHeight: sizes.inputHeight,
      borderRadius: sizes.inputRadius,
      borderWidth: isFocused ? 0 : 0,
      borderColor: isFocused ? colors.focus : inputColor,
      backgroundColor: backgroundColor,
    },
  ]) as ViewStyle;

  const inputStyles = StyleSheet.flatten([
    {
      flex: 1,
      zIndex: 2,
      height: '100%',
      fontSize: sizes.p,
      color: colors.input,
      paddingHorizontal: sizes.inputPadding,
    },
  ]) as TextStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const inputID =
    Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

  return (



    <Block flex={0} style={inputBoxStyles}>
      {label && (
        <Text bold marginBottom={sizes.s}>
          {label}
        </Text>
      )}
      <Block row align="center" justify="flex-end" style={inputContainerStyles}>
        {icon && (
          <Block marginLeft={sizes.cardPadding} flex={0}>{icon}</Block>
        )}
        {(control != null) ? <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              {...inputID}
              {...props}
              style={inputStyles}
              editable={!disabled}
              placeholderTextColor={inputColor}
              onFocus={(event) => handleFocus(event, true)}
              value={value}
              onBlur={onBlur}
              onChangeText={text => onChange(text)}
            />
          )}
          rules={{
            required: {
              value: true,
              message: 'Field is required!',
            },
          }}
        /> : <TextInput
          {...inputID}
          {...props}
          style={inputStyles}
          editable={!disabled}
          placeholderTextColor={inputColor}
          onFocus={(event) => handleFocus(event, true)}
        />}
        {iconRight && (
          <Block marginRight={sizes.cardPadding} flex={0}>{iconRight}</Block>
        )}
      </Block>
    </Block>
  );
};
export default React.memo(Input);
