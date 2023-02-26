import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import Menu from './Menu';
import { useData, ThemeProvider } from '../hooks';

export default () => {
  const { isDark, theme, setTheme } = useData();

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <ThemeProvider theme={theme} setTheme={setTheme}>
      <NavigationContainer theme={navigationTheme}>
        <Menu />
      </NavigationContainer>
    </ThemeProvider>
  );
};
