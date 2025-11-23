import React from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';
import { FAB } from './styles';

const FloatingButton = ({ icon, onClick, accessibilityLabel = 'Ação' }) => {
  return (
    <FAB
      onPress={() => onClick()}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {icon}
    </FAB>
  );
};

export const Icons = (name, size, color) => {
  return <Icon name={name} size={size} color={color} />;
};

export default FloatingButton;
