import React, { useContext } from 'react';
import { View } from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { AuthContext } from '../contexts/auth';
// import { Container } from './styles';

const route = () => {
  const { user } = useContext(AuthContext);

  return user ? <AppRoutes /> : <AuthRoutes />;
}

export default route;