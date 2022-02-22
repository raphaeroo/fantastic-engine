import React from 'react';
import {StatusBar} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Router} from './Routes';

function Main() {
  return (
    <>
      <Router />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </>
  );
}

export const App = gestureHandlerRootHOC(Main);
