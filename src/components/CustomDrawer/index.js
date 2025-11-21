import React, { useContext } from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Welcome, Description } from './styles';
import { AuthContext } from '../../contexts/auth';

export default function CustomDrawer(props) {
  const { user } = useContext(AuthContext);
  const userName = user?.name || 'Usuário';

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ marginTop: 25, alignItems: 'center', justifyContent: 'center' }}>
        <Welcome>Bem-vindo</Welcome>
        <Description>Olǭ, {userName}</Description>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
