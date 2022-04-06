import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { FAB } from './styles';

const FloatingButton = ({ icon, onClick }) => {
    return (
        <FAB onPress={() => onClick()}>
            {icon}
        </FAB>

    );
};

export const Icons = (name, size, color) => {
    return <Icon name={name} size={size} color={color} />
}

export default FloatingButton;