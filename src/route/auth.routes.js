import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import {useTheme} from 'styled-components';
const Stack = createNativeStackNavigator();
const AuthRoute = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle:{backgroundColor:theme.primaryColor}
    }}
    >
        <Stack.Screen name="SignIn" component={SignIn} options={{headerShown:false}} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Cadastrar" }} />
    </Stack.Navigator>
);
}

export default AuthRoute;