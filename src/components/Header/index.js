import React from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Container, ViewUser } from './styles';
import { useNavigation } from '@react-navigation/native'
import Icon from '@expo/vector-icons/MaterialIcons';
export default function Header() {
  const navigation = useNavigation();
 return (
   <Container>
    <TouchableWithoutFeedback onPress={()=> navigation.toggleDrawer()}>
        <Icon name="menu" size={30} color="#fff"/>
    </TouchableWithoutFeedback>

    <ViewUser>
    <TouchableOpacity onPress={()=> {}}>
        <Icon name="account-circle" size={30} color="#fff"/>
    </TouchableOpacity>
    </ViewUser>
   </Container>
  );
}