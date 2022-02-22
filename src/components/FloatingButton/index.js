import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const FloatingButton = ({name, icon, onClick}) => {
    return (
        <TouchableOpacity
        onPress={() => onClick()}
        style={styles.container}>
            {icon}
        </TouchableOpacity>
    );
};

export const Icons = (name, size, color)=>{
   return <Icon name={name} size={size} color={color} />
}

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset:{width:0, height:3},
        shadowOpacity: 0.5,
        backgroundColor: '#F4A460',
        position: 'absolute',
        bottom: 20,
        right: 20,
    }
});


export default FloatingButton;