import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTheme } from 'styled-components';
import MyButton from '../../components/MyButton';
import { synchronize } from '../../services/sync';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import SignInScreen from '../SignIn/SignInScreen';
import SignUpScreen from '../SignUp/SignUpScreen';
import { clientRepository, productRepository, orderRepository } from '../../database/repository';
import { useFocusEffect } from '@react-navigation/native';

const UserScreen = () => {
  const { user, signOut, theme, loading: authLoading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);

  // Stats
  const [clientsCount, setClientsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  async function loadStats() {
    try {
      const clients = await clientRepository.getAll();
      const products = await productRepository.getAll();
      const orders = await orderRepository.getAll();

      setClientsCount(clients.length);
      setProductsCount(products.length);
      setOrdersCount(orders.length);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function loadLastSync() {
    const lastSyncTime = await AsyncStorage.getItem('last_synced_at');
    if (lastSyncTime) {
      setLastSync(format(parseInt(lastSyncTime, 10), "dd/MM/yyyy HH:mm"));
    } else {
      setLastSync('Nunca');
    }
  }

  useEffect(() => {
    if (user) {
      loadLastSync();
      loadStats();
      setName(user.name);
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadStats();
      }
    }, [user])
  );

  const handleSave = () => {
    Alert.alert('Em breve', 'Funcionalidade de edição de perfil será implementada em breve!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  async function handleSync() {
    setIsSyncing(true);
    const result = await synchronize(user.id);
    if (result.success) {
      Alert.alert('Sucesso', 'Seus dados foram sincronizados com a nuvem.');
      await loadLastSync();
    } else {
      Alert.alert('Erro', 'Não foi possível sincronizar seus dados.');
      console.error(result.error);
    }
    setIsSyncing(false);
  }

  async function handleLocalBackup() {
    setIsBackingUp(true);
    try {
      const dbPath = `${FileSystem.documentDirectory}SQLite/meunegocio.db`;
      const dbExists = await FileSystem.getInfoAsync(dbPath);
      if (!dbExists.exists) {
        Alert.alert('Erro', 'Banco local não encontrado.');
        setIsBackingUp(false);
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Erro', 'Compartilhamento não disponível.');
        setIsBackingUp(false);
        return;
      }

      const tempPath = `${FileSystem.cacheDirectory}meunegocio-backup-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.db`;
      await FileSystem.copyAsync({ from: dbPath, to: tempPath });
      await Sharing.shareAsync(tempPath);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível gerar o backup.');
    } finally {
      setIsBackingUp(false);
    }
  }

  async function handleRestore() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      Alert.alert(
        'Confirmar Restauração',
        `Restaurar backup do arquivo:\n${asset.name}?\n\nIsso substituirá todos os dados atuais.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Restaurar',
            onPress: async () => {
              try {
                const dbPath = `${FileSystem.documentDirectory}SQLite/meunegocio.db`;
                const sqliteDir = `${FileSystem.documentDirectory}SQLite/`;
                const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
                if (!dirInfo.exists) {
                  await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
                }
                await FileSystem.copyAsync({ from: asset.uri, to: dbPath });
                Alert.alert('Sucesso', 'Backup restaurado! Reinicie o aplicativo.');
              } catch (err) {
                console.error(err);
                Alert.alert('Erro', 'Falha ao restaurar.');
              }
            }
          }
        ]
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao selecionar arquivo.');
    }
  }

  if (!user) {
    return (
      <Background>
        <Header title="Perfil" />
        <View style={styles.container}>
          {showSignIn ? (
            <SignInScreen onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpScreen onSwitchToSignIn={() => setShowSignIn(true)} />
          )}
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
            <Icon name="person" size={70} color={theme.backgroundColor} />
          </View>

          {/* User Info Card */}
          <View style={[styles.card, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.infoRow}>
              <Icon name="person-outline" size={22} color={theme.textMuted} />
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
              <Icon name="email" size={22} color={theme.textMuted} />
              <View style={styles.infoContent}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Email</Text>
                <Text style={[styles.value, { color: theme.textColor }]} numberOfLines={1}>{user.email}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

            <View style={styles.infoRow}>
              <Icon name="fingerprint" size={22} color={theme.textMuted} />
              <View style={styles.infoContent}>
                <Text style={[styles.label, { color: theme.textMuted }]}>ID do Usuário</Text>
                <Text style={[styles.valueSmall, { color: theme.textMuted }]} numberOfLines={1}>{user.id}</Text>
              </View>
            </View>
          </View>

          {/* Edit Buttons */}
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
              <Text style={[styles.editButtonText, { color: theme.textOnPrimary }]}>Editar Perfil</Text>
            </TouchableOpacity>
          )}

          {/* Stats Card */}
          <View style={[styles.statsCard, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.statsTitle, { color: theme.textColor }]}>Estatísticas</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="people" size={32} color={theme.primaryColor} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>{clientsCount}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Clientes</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="inventory" size={32} color={theme.primaryColor} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>{productsCount}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Produtos</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="receipt" size={32} color={theme.primaryColor} />
                <Text style={[styles.statValue, { color: theme.textColor }]}>{ordersCount}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Pedidos</Text>
              </View>
            </View>
          </View>

          {/* Backup & Sync Section */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.sectionHeader}>
              <Icon name="cloud-upload" size={26} color={theme.primaryColor} />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Backup e Sincronização</Text>
            </View>

            <Text style={[styles.syncInfo, { color: theme.textMuted }]}>
              Última sincronização: {lastSync}
            </Text>

            <MyButton
              title={isSyncing ? "Sincronizando..." : "Sincronizar com Nuvem"}
              onClick={handleSync}
              disabled={isSyncing || isBackingUp}
            />

            <View style={{ marginTop: 10 }} />

            <MyButton
              title={isBackingUp ? "Gerando backup..." : "Exportar Backup Local"}
              onClick={handleLocalBackup}
              disabled={isBackingUp || isSyncing}
            />

            <View style={{ marginTop: 10 }} />

            <MyButton
              title="Importar Backup"
              onClick={handleRestore}
              disabled={isSyncing || isBackingUp}
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: theme.danger }]}
            onPress={signOut}
            disabled={isSyncing}
          >
            <Icon name="exit-to-app" size={20} color={theme.danger} />
            <Text style={[styles.logoutText, { color: theme.danger }]}>Sair da Conta</Text>
          </TouchableOpacity>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 16,
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
    marginBottom: 16,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  sectionCard: {
    width: '100%',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  syncInfo: {
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    width: '100%',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UserScreen;
