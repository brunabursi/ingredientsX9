import React from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useLinkTo } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type RootStackParamList = {
  homeScreen: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
  
export default function App() {
  const linkTo = useLinkTo();

  return (
    <SafeAreaProvider>
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
          <Stack.Screen name="homeScreen" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}