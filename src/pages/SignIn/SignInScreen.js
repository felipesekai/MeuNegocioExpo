import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Input, TitleInputs, ViewInput, } from '../../utils/Style';
import { Container, Link, LinkText } from './styles';
import MyButton from '../../components/MyButton';
import { AuthContext } from '../../contexts/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ onSwitchToSignUp }) => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const loadCredentials = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('saved_email');
                const savedPassword = await AsyncStorage.getItem('saved_password');
                if (savedEmail && savedPassword) {
                    setEmail(savedEmail);
                    setPassword(savedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.log('Error loading credentials', error);
            }
        };
        loadCredentials();
    }, []);

    const handleSignIn = async () => {
        if (rememberMe) {
            await AsyncStorage.setItem('saved_email', email);
            await AsyncStorage.setItem('saved_password', password);
        } else {
            await AsyncStorage.removeItem('saved_email');
            await AsyncStorage.removeItem('saved_password');
        }
        signIn(email, password);
    };

    return (
        <Container>
            <ViewInput>
                <TitleInputs>Email:</TitleInputs>
                <Input
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    placeholder="your-email@email.com"
                /><TitleInputs>Senha:</TitleInputs>
                <Input
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    placeholder="your-password"
                />

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
                    onPress={() => setRememberMe(!rememberMe)}
                >
                    <View style={{
                        width: 20,
                        height: 20,
                        borderWidth: 2,
                        borderColor: '#f4a460',
                        marginRight: 10,
                        backgroundColor: rememberMe ? '#f4a460' : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {rememberMe && <Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text>}
                    </View>
                    <Text style={{ color: '#000' }}>Lembrar-me</Text>
                </TouchableOpacity>

            </ViewInput>
            <MyButton onClick={handleSignIn} title={'Login'} />

            <TouchableOpacity onPress={onSwitchToSignUp}>
                <Link >
                    <LinkText>Cadastrar-se</LinkText>
                </Link>
            </TouchableOpacity>
        </Container>
    );
}

export default SignInScreen;
