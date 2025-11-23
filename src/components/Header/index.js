import React from 'react';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Container, ViewUser } from './styles';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons';

export default function Header() {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('User');
  };

  return (
    <Container>
      <TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" size={30} color="#fff" />
      </TouchableWithoutFeedback>

      <ViewUser>
        <TouchableOpacity onPress={handleProfilePress}>
          <Icon name="account-circle" size={30} color="#fff" />
        </TouchableOpacity>
      </ViewUser>
    </Container>
  );
}