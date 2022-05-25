import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';
import Client from '../pages/Client';
import Product from '../pages/Product';
import CustomDrawer from '../components/CustomDrawer';
import Icon from '@expo/vector-icons/MaterialIcons';

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
        options={{                   
          drawerIcon:((color, size) => <Icon name='home' color={color} size={16}/>),
        }}
      />
      <Drawer.Screen
        name="Client"
        component={Client}
        options={{
          title: 'Clientes',          
          drawerIcon:((color, size) => <Icon name='person' color={color} size={16}/>),
        }}
      />  
      <Drawer.Screen
        name="Product"
        component={Product}
        options={{
          title: 'Produtos',
          drawerIcon:((color, size) => <Icon name='receipt-long' color={color} size={16}/>),
         
        }}
      />
    </Drawer.Navigator>);
}

