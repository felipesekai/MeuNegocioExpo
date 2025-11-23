import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Welcome, Description } from './styles';
import { AuthContext } from '../../contexts/auth';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTheme } from 'styled-components';

export default function CustomDrawer(props) {
  const { user, signOut } = useContext(AuthContext);
  const theme = useTheme();
  const userName = user?.name || 'Usuário';

  return (
    <DrawerContentScrollView {...props} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header com gradiente e avatar */}
      <View style={[styles.header, { backgroundColor: theme.primaryColor }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { borderColor: theme.backgroundColor }]}>
            <Icon name="person" size={50} color={theme.backgroundColor} />
          </View>
        </View>
        <Welcome>Bem-vindo</Welcome>
        <Description>Olá, {userName}</Description>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <DrawerItemList {...props} />
      </View>

      {/* Footer com botão de sair */}
      <View style={[styles.footer, { borderTopColor: theme.borderColor }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Icon name="exit-to-app" size={24} color={theme.danger || '#ff4444'} />
          <Description style={[styles.logoutText, { color: theme.danger || '#ff4444' }]}>Sair</Description>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  footer: {
    borderTopWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});
