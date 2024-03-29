import React, { useState, useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Background, Input, TitleInputs, ViewInput, } from '../../utils/Style';
import { Container, Link, LinkText } from './styles';
import MyButton from '../../components/MyButton';
import { AuthContext } from '../../contexts/auth';
const SignIn = ({navigation}) => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('sekai@sekai.com');
    const [password, setPassword] = useState('123456')
    return (
        <Background>
            <Container>
                <ViewInput>
                    <TitleInputs>Email:</TitleInputs>
                    <Input
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    /><TitleInputs>Senha:</TitleInputs>
                    <Input
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                    />


                </ViewInput>
                <MyButton onClick={() => signIn(email, password)} title={'Login'} />

                <TouchableOpacity onPress={() =>navigation.navigate("SignUp")}>
                    <Link >
                        <LinkText>Cadastrar-se</LinkText>
                    </Link>
                </TouchableOpacity>


            </Container>
        </Background>
    );
}

export default SignIn;