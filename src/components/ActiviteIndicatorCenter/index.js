import React from 'react';
import { View, ActivityIndicator } from 'react-native';

// import { Container } from './styles';

const ActiviteIndicatorCenter = ({color, size}) => {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={size} color={color}/>
        </View>;
}

export default ActiviteIndicatorCenter;