import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Modal, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import MyButton from '../../components/MyButton';
import { AuthContext } from '../../contexts/auth';
import SignInScreen from '../SignIn/SignInScreen';
import SignUpScreen from '../SignUp/SignUpScreen';
import { synchronize } from '../../services/sync';
import * as FileSystem from 'expo-file-system';

const containerStyle = { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 };
const titleStyle = { fontSize: 22, fontWeight: 'bold', marginBottom: 10 };
const emailStyle = { fontSize: 16, marginBottom: 20, color: '#666' };
const syncTextStyle = { fontSize: 12, color: '#666', marginBottom: 40 };

const AccountScreen = () => {
    const { user, signOut, loading: authLoading, theme } = useContext(AuthContext);
    const [showSignIn, setShowSignIn] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [backups, setBackups] = useState([]);

    async function loadBackups() {
        try {
            const folder = `${FileSystem.documentDirectory}backups/`;
            const dirInfo = await FileSystem.getInfoAsync(folder);
            if (!dirInfo.exists) {
                setBackups([]);
                return;
            }
            const files = await FileSystem.readDirectoryAsync(folder);

            const formattedBackups = files.map(filename => {
                try {
                    // Extract timestamp from "meunegocio-backup-1732376993000.db"
                    const timestamp = parseInt(filename.split('-')[2].split('.')[0], 10);
                    return {
                        name: filename,
                        time: timestamp,
                        label: format(timestamp, "dd/MM/yyyy 'às' HH:mm")
                    };
                } catch (e) {
                    return { name: filename, time: 0, label: filename };
                }
            }).sort((a, b) => b.time - a.time); // Sort by newest

            setBackups(formattedBackups);
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível listar os backups.');
        }
    }

    async function handleRestore(filename) {
        Alert.alert(
            'Confirmar Restauração',
            'Isso substituirá todos os dados atuais pelos do backup. Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sim, Restaurar',
                    onPress: async () => {
                        try {
                            const dbPath = `${FileSystem.documentDirectory}SQLite/meunegocio.db`;
                            const backupPath = `${FileSystem.documentDirectory}backups/${filename}`;

                            await FileSystem.copyAsync({ from: backupPath, to: dbPath });

                            setShowRestoreModal(false);
                            Alert.alert('Sucesso', 'Backup restaurado! Por favor, reinicie o aplicativo para carregar os dados.');
                        } catch (err) {
                            console.error(err);
                            Alert.alert('Erro', 'Falha ao restaurar o backup.');
                        }
                    }
                }
            ]
        );
    }

    async function loadLastSync() {
        const lastSyncTime = await AsyncStorage.getItem('last_synced_at');
        if (lastSyncTime) {
            setLastSync(format(parseInt(lastSyncTime, 10), "dd/MM/yyyy 'às' HH:mm"));
        } else {
            setLastSync('Nunca');
        }
    }

    useEffect(() => {
        loadLastSync();
    }, [user]);

    async function handleSync() {
        setIsSyncing(true);
        const result = await synchronize(user.id);
        if (result.success) {
            Alert.alert('Sucesso', 'Seus dados foram sincronizados com a nuvem.');
            await loadLastSync();
        } else {
            Alert.alert('Erro', 'Não foi possível sincronizar seus dados. Tente novamente.');
            console.error(result.error);
        }
        setIsSyncing(false);
    }

    async function handleLocalBackup() {
        setIsBackingUp(true);
        try {
            const dbPath = `${FileSystem.documentDirectory}SQLite/meunegocio.db`;
            const folder = `${FileSystem.documentDirectory}backups/`;
            const dbExists = await FileSystem.getInfoAsync(dbPath);
            if (!dbExists.exists) {
                Alert.alert('Erro', 'Banco local não encontrado para backup.');
                setIsBackingUp(false);
                return;
            }

            const dirInfo = await FileSystem.getInfoAsync(folder);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
            }
            const backupPath = `${folder}meunegocio-backup-${Date.now()}.db`;
            await FileSystem.copyAsync({ from: dbPath, to: backupPath });
            Alert.alert('Backup salvo', `Arquivo salvo em:\n${backupPath}`);
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível gerar o backup local.');
        } finally {
            setIsBackingUp(false);
        }
    }

    if (authLoading) {
        return (
            <Background><Header /><View style={containerStyle}><ActivityIndicator size="large" color={theme.primaryColor} /></View></Background>
        );
    }

    if (user) {
        return (
            <Background>
                <Header />
                <View style={containerStyle}>
                    <Text style={{ ...titleStyle, color: theme.textColor }}>Bem-vindo, {user.name}</Text>
                    <Text style={{ ...emailStyle, color: theme.textColor }}>{user.email}</Text>
                    <Text style={{ ...syncTextStyle, color: theme.textColor }}>Última sincronização: {lastSync}</Text>

                    <MyButton
                        title={isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
                        onClick={handleSync}
                        disabled={isSyncing}
                    />
                    <View style={{ marginTop: 12 }} />
                    <MyButton
                        title={isBackingUp ? "Gerando backup..." : "Backup Local"}
                        onClick={handleLocalBackup}
                        disabled={isBackingUp || isSyncing}
                    />
                    <View style={{ marginTop: 12 }} />
                    <MyButton
                        title="Restaurar Backup"
                        onClick={() => {
                            loadBackups();
                            setShowRestoreModal(true);
                        }}
                        disabled={isSyncing || isBackingUp}
                    />
                    <View style={{ marginTop: 20 }} />
                    <MyButton
                        title="Sair"
                        onClick={signOut}
                        disabled={isSyncing}
                    />
                </View>

                <Modal
                    visible={showRestoreModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowRestoreModal(false)}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '90%', backgroundColor: '#FFF', borderRadius: 10, padding: 20, maxHeight: '80%' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>Selecione um Backup</Text>
                            {backups.length === 0 ? (
                                <Text style={{ color: '#666', textAlign: 'center', marginVertical: 20 }}>Nenhum backup encontrado.</Text>
                            ) : (
                                <FlatList
                                    data={backups}
                                    keyExtractor={(item) => item.name}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                                            onPress={() => handleRestore(item.name)}
                                        >
                                            <Text style={{ fontSize: 16, color: '#333' }}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                            <View style={{ marginTop: 15 }}>
                                <MyButton title="Fechar" onClick={() => setShowRestoreModal(false)} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </Background >
        );
    }

    return (
        <Background>
            <Header />
            <View style={containerStyle}>
                {showSignIn ? (
                    <SignInScreen onSwitchToSignUp={() => setShowSignIn(false)} />
                ) : (
                    <SignUpScreen onSwitchToSignIn={() => setShowSignIn(true)} />
                )}
            </View>
        </Background>
    );
}

export default AccountScreen;
