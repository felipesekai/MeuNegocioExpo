import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTheme } from 'styled-components';
import MyButton from '../../components/MyButton';

const UserScreen = () => {
  const { user, theme } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    // TODO: Implementar atualização de perfil no Firebase
    Alert.alert('Em breve', 'Funcionalidade de edição de perfil será implementada em breve!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Background>
        <Header title="Perfil" />
        <View style={styles.container}>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            Faça login para ver seu perfil
          </Text>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <Header title="Meu Perfil" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Avatar */}
          <View style={[styles.avatarContainer, { backgroundColor: theme.primaryColor }]}>
            <Icon name="person" size={80} color={theme.backgroundColor} />
          </View>

          {/* User Info Card */}
          <View style={[styles.card, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.infoRow}>
              <Icon name="person-outline" size={24} color={theme.textMuted} />
              <View style={styles.infoContent}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Nome</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Seu nome"
                    placeholderTextColor={theme.textMuted}
                  />
                ) : (
                  <Text style={[styles.value, { color: theme.textColor }]}>{user.name}</Text>
                )}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

            <View style={styles.infoRow}>
              <Icon name="email" size={24} color={theme.textMuted} />
              <View style={styles.infoContent}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Email</Text>
                <Text style={[styles.value, { color: theme.textColor }]}>{user.email}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

            <View style={styles.infoRow}>
              <Icon name="fingerprint" size={24} color={theme.textMuted} />
              <View style={styles.infoContent}>
                <Text style={[styles.label, { color: theme.textMuted }]}>ID do Usuário</Text>
                <Text style={[styles.valueSmall, { color: theme.textMuted }]} numberOfLines={1}>
                  {user.id}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
                onPress={handleCancel}
              >
                <Icon name="close" size={20} color={theme.textColor} />
                <Text style={[styles.buttonText, { color: theme.textColor }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: theme.primaryColor }]}
                onPress={handleSave}
              >
                <Icon name="check" size={20} color={theme.textOnPrimary} />
                <Text style={[styles.buttonText, { color: theme.textOnPrimary }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.primaryColor }]}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="edit" size={20} color={theme.textOnPrimary} />
              <Text style={[styles.editButtonText, { color: theme.textOnPrimary }]}>
                Editar Perfil
              </Text>
            </TouchableOpacity>
          )}

          {/* Stats Card */}
          <View style={[styles.statsCard, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.statsTitle, { color: theme.textColor }]}>Estatísticas</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="people" size={32} color={theme.primaryColor} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>-</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Clientes</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="inventory" size={32} color={theme.primaryColor} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>-</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Produtos</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="receipt" size={32} color={theme.primaryColor} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>-</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Pedidos</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueSmall: {
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsCard: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default UserScreen;
