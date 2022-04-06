import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskList from '../pages/Home/TaskListPagerView';
import LastOrders from '../pages/Home/LastOrdersPagerView';
import LayoutIconTopTab from '../components/LayoutIconTopTab';
import { useTheme } from 'styled-components';
const Tab = createMaterialTopTabNavigator();
export default function Toptab() {
const theme = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{                
                tabBarActiveTintColor:theme.primaryColor,
                tabBarInactiveTintColor: theme.iconSecondaryColor,
                tabBarLabelStyle: { fontSize: 11, textTransform:"capitalize" },
                tabBarIndicatorStyle: {backgroundColor: theme.primaryColor, height: 5, borderRadius: 3 },
                tabBarShowIcon: true,
                tabBarIconStyle: { borderRadius: 7,width: 100, justifyContent: 'center', alignItems: 'center' }
            }}
        >
            <Tab.Screen
                name='Last Orders'
                component={LastOrders}
                options={{
                    tabBarIcon: ({ size, color }) => <LayoutIconTopTab  nameIcon={"hail"} colors={color} />,
                    title:"Ultimos Pedidos"
                }}
            />
            <Tab.Screen
                name='Task List'
                component={TaskList}
                options={{
                    tabBarIcon: ({ size, color }) => <LayoutIconTopTab nameIcon={"home"} colors={color} />,
                    title:"Lista de Tarefas",
                }}
            />

            <Tab.Screen
                name='Last Payments'
                component={LastOrders}
                options={{
                    tabBarIcon: ({ size, color }) => <LayoutIconTopTab nameIcon={"home"} colors={color} />,
                    title: "Pedidos Pagos"
                }}
                
            />
        </Tab.Navigator>
    );
}
