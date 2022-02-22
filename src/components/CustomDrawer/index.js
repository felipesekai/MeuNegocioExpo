import React from 'react';
import { View, Text, } from 'react-native';
import { Welcome, Description } from './styles'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
export default function CustomDrawer(props) {
 return (
    <DrawerContentScrollView {...props}>
        <View style={{marginTop:25, alignItems: 'center', justifyContent: 'center'}}>
            <Welcome>Bem-vindo</Welcome>
            <Description>Ola user name</Description>
        </View>
        <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

