import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from '../pages/Home/TaskListPagerView';
import LastOrders from '../pages/Home/LastOrdersPagerView/LastOrdersScreen';
import LastPayments from '../pages/Home/LastOrdersPagerView/LastPaymentsScreen';
import LayoutIconTopTab from '../components/LayoutIconTopTab';
import { useTheme } from 'styled-components';
import { orderRepository } from '../database/repository';

const Tab = createMaterialTopTabNavigator();

export default function Toptab() {
    const theme = useTheme();
    const [ordersCount, setOrdersCount] = useState(0);
    const [tasksCount, setTasksCount] = useState(0);
    const [paymentsCount, setPaymentsCount] = useState(0);

    useEffect(() => {
        loadCounts();

        // Atualizar contadores a cada 5 segundos
        const interval = setInterval(loadCounts, 5000);
        return () => clearInterval(interval);
    }, []);

    async function loadCounts() {
        try {
            // Carregar pedidos
            const allOrders = await orderRepository.getAll();

            // Badge "Últimos Pedidos" deve mostrar pedidos PENDENTES (não pagos)
            // pois é isso que a tela LastOrdersScreen exibe por padrão
            const unpaidOrders = allOrders.filter(order => !order.paid && order.status !== 'paid');
            setOrdersCount(unpaidOrders.length);

            // Badge "Pedidos Pagos" deve mostrar pedidos PAGOS
            const paidOrders = allOrders.filter(order => order.paid || order.status === 'paid');
            setPaymentsCount(paidOrders.length);

            // Carregar tarefas do AsyncStorage (mesma lógica do useTasks)
            const storedTasks = await AsyncStorage.getItem('tasks_store');
            if (storedTasks) {
                const tasks = JSON.parse(storedTasks);
                // Badge "Lista de Tarefas" mostra tarefas pendentes
                const pendingTasks = tasks.filter(t => !t.done);
                setTasksCount(pendingTasks.length);
            } else {
                setTasksCount(0);
            }

        } catch (error) {
            console.error('Error loading counts:', error);
        }
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.primaryColor,
                tabBarInactiveTintColor: theme.iconSecondaryColor,
                tabBarLabelStyle: { fontSize: 11, textTransform: "capitalize" },
                tabBarIndicatorStyle: { backgroundColor: theme.primaryColor, height: 5, borderRadius: 3 },
                tabBarShowIcon: true,
                tabBarIconStyle: { borderRadius: 7, width: 100, justifyContent: 'center', alignItems: 'center' },
                tabBarBadgeStyle: { backgroundColor: theme.danger || '#ff4444', color: '#fff' }
            }}
        >
            <Tab.Screen
                name='Last Orders'
                component={LastOrders}
                options={{
                    tabBarIcon: ({ size, color }) => <LayoutIconTopTab nameIcon={"receipt-long"} colors={color} count={ordersCount} />,
                    title: "Ultimos Pedidos",
                }}
            />
            <Tab.Screen
                name='Task List'
                component={TaskList}
                options={{
                    tabBarIcon: ({ size, color }) => <LayoutIconTopTab nameIcon={"list-alt"} colors={color} count={tasksCount} />,
                    title: "Lista de Tarefas",
                }}
            />

            <Tab.Screen
                name='Last Payments'
                component={LastPayments}
                options={{
                    tabBarIcon: ({ size, color }) => <LayoutIconTopTab nameIcon={"payments"} colors={color} count={paymentsCount} />,
                    title: "Pedidos Pagos"
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        elevation: 3,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
