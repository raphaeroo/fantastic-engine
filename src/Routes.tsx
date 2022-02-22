import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {HomeScreen} from './Home';
import {ImageForGallery} from './ImageForGallery';
import {VisionCamera} from './VisionCamera';

const Stack = createStackNavigator();

export function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ImageForGallery" component={ImageForGallery} />
        <Stack.Screen name="VisionCamera" component={VisionCamera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
