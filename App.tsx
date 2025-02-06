/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Button } from 'react-native';
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
};

export const ImageContext = React.createContext<{
  selectedImage: string | null;
  setSelectedImage: (image: string) => void;
}>({
  selectedImage: null,
  setSelectedImage: () => {},
});
const Stack = createNativeStackNavigator<RootStackParamList>();
  
export default function App() {
  const linkTo = useLinkTo();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <NavigationContainer>
      <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
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
      </ImageContext.Provider>
    </NavigationContainer>
  );
}

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
