/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { ComingSoon, Home, Profile } from '../screens';
import { useTheme } from '../hooks/';

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
    const { colors, sizes } = useTheme();


    return (
        <Tab.Navigator tabBarOptions={{
            showLabel: false,
            keyboardHidesTabBar: true,
            style: {
                position: 'absolute',
                backgroundColor: colors.primary,
                elevation: 0,
                height: 80,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
            },
        }}>
            <Tab.Screen
                name="chat"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <SimpleLineIcons name="bubbles" size={sizes.icon30} color={focused ? colors.white : colors.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name="activity"
                component={ComingSoon}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <SimpleLineIcons name="energy" size={sizes.icon30} color={focused ? colors.white : colors.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name="camera"
                component={ComingSoon}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <SimpleLineIcons name="camera" size={sizes.icon30} color={focused ? colors.white : colors.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name="location"
                component={ComingSoon}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Entypo name="location" size={sizes.icon25} color={focused ? colors.white : colors.icon} />
                    ),
                }}
            />
            <Tab.Screen
                name="profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="ios-person-circle-outline" size={sizes.icon30} color={focused ? colors.white : colors.icon} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

