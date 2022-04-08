import React,{useContext} from 'react';
import { View, Text, } from 'react-native';
import { Welcome, Description } from './styles'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import{ AuthContext } from '../../contexts/auth';
export default function CustomDrawer(props) {
  const { user } = useContext(AuthContext);

 return (
    <DrawerContentScrollView {...props}>
        <View style={{marginTop:25, alignItems: 'center', justifyContent: 'center'}}>
            <Welcome>Bem-vindo</Welcome>
            <Description>Olá, {user.name}</Description>
        </View>
        <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

