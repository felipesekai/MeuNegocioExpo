import React, { useContext } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { Container, Title } from './styles';
import { useTheme } from 'styled-components';

const MyButton = ({ title, onClick, accessibilityLabel }) => {
  const { loading } = useContext(AuthContext);
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onClick}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Container>
        {loading ? <ActivityIndicator color={theme.textOnPrimary || theme.backgroundColor} size={20} /> : <Title>{title}</Title>}
      </Container>
    </TouchableOpacity>
  );
};

export default MyButton;
