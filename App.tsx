/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useLinkTo } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ImageDetailsScreen from './screens/ImageDetailsScreen';
type RootStackParamList = {
  ImagePicker: undefined;
  ImageDetails: { imageUri: string };
  Settings: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const linkTo = useLinkTo();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerRight: () => (
            <Button
              title="Settings"
              onPress={() => linkTo('Settings') } 
            />
          ),
        }}
      >
        <Stack.Screen name="ImagePicker" component={HomeScreen} />
        <Stack.Screen name="ImageDetails" component={ImageDetailsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
