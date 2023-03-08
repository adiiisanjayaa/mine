/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Logo from '../assets/images/logo-yellow.svg';

export const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('init splash');
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Animated.View // Special animatable View
                style={{
                    opacity: fadeAnim, // Bind opacity to animated value
                }}>
                <Logo width={200} />
            </Animated.View>

        </View>
    );
};
