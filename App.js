import React from 'react';
import { Text, View,LogBox ,StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/route';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

export default function App() {
 return (
   <NavigationContainer>
     <Routes/>

     <StatusBar backgroundColor="#F4A460" />
   </NavigationContainer>
  );
}
