import React, { useState } from 'react';
import { Text, View, LogBox, StatusBar, useColorScheme } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/route';
import themes from './src/utils/themes';
import { ThemeProvider } from 'styled-components';
import AuthProvider from './src/contexts/auth';
import { app } from "./src/services/firebaseConnect";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

LogBox.ignoreAllLogs();

export default function App() {
  const deviceTheme = useColorScheme();
  const theme = themes[deviceTheme] || themes.light;
  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <NativeBaseProvider>
            <Routes />
          </NativeBaseProvider>
        </AuthProvider>
      </ThemeProvider>
      <StatusBar backgroundColor="#F4A460" />
    </NavigationContainer>
  );
}
