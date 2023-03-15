/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Logo from '../assets/images/logo.svg';
import { useTheme } from '../hooks';
import Block from './Block';

export const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();

    useEffect(() => {
        console.log('init splash');
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <Block
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.light,
            }}>
            <Animated.View // Special animatable View
                style={{
                    opacity: fadeAnim, // Bind opacity to animated value
                }}>
                <Logo width={200} />
            </Animated.View>

        </Block>
    );
};
