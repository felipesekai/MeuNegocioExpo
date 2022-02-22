import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';
import Client from '../pages/Client/ClientList';
import Product from '../pages/Product';
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function route() {


  return (
    <Drawer.Navigator
      drawerContent = {(props)=> <CustomDrawer {...props} />}
      
      screenOptions={
        {
          headerShown: false,
          drawerActiveBackgroundColor: '#FFD700',
          drawerActiveTintColor: '#000',
          drawerInactiveBackgroundColor: '#F0E68C',
          headerBackground : '#ddd',
          drawerStyle: {
            backgroundColor: '#F5F5DC'
          }

        }
      }
    >


      <Drawer.Screen
        name="Home"
        component={Home}
      />
      <Drawer.Screen
        name="Client"
        component={Client}
        options={{
          title: 'Clientes',
         
        }}
      />  
      <Drawer.Screen
        name="Product"
        component={Product}
        options={{
          title: 'Produtos',
         
        }}
      />
    </Drawer.Navigator>);
}

