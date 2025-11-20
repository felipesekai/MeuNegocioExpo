import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import MyButton from '../../components/MyButton';
import { AuthContext } from '../../contexts/auth';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import { synchronize } from '../../services/sync';

const containerStyle = { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 };
const titleStyle = { fontSize: 22, fontWeight: 'bold', marginBottom: 10 };
const emailStyle = { fontSize: 16, marginBottom: 20, color: '#666' };
const syncTextStyle = { fontSize: 12, color: '#666', marginBottom: 40 };

const Account = () => {
    const { user, signOut, loading: authLoading, theme } = useContext(AuthContext);
    const [showSignIn, setShowSignIn] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);

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
                    <Text style={{...titleStyle, color: theme.textColor}}>Bem-vindo, {user.name}</Text>
                    <Text style={{...emailStyle, color: theme.textColor}}>{user.email}</Text>
                    <Text style={{...syncTextStyle, color: theme.textColor}}>Última sincronização: {lastSync}</Text>
                    
                    <MyButton
                        title={isSyncing ? "Sincronizando..." : "Sincronizar Dados"}
                        onClick={handleSync}
                        disabled={isSyncing}
                    />
                    <View style={{marginTop: 20}}/>
                    <MyButton
                        title="Sair"
                        onClick={signOut}
                        disabled={isSyncing}
                    />
                </View>
            </Background>
        );
    }

    return (
        <Background>
            <Header />
            <View style={containerStyle}>
                {showSignIn ? (
                    <SignIn onSwitchToSignUp={() => setShowSignIn(false)} />
                ) : (
                    <SignUp onSwitchToSignIn={() => setShowSignIn(true)} />
                )}
            </View>
        </Background>
    );
}

export default Account;
