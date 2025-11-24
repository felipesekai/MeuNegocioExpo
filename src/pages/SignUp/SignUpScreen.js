import React, { useContext, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { Container, Link, LinkText } from './styles';
import { Form } from '@unform/mobile';
import Input from './Input';
import MyButton from '../../components/MyButton';
import * as Yup from 'yup';
import { errorMenssage } from '../../utils/Strings';

const SignUpScreen = ({ onSwitchToSignIn }) => {
    const { signUp } = useContext(AuthContext);

    const formRef = useRef(null);

    async function handleSubmit(data) {
        try {
            const scheme = Yup.object().shape({
                name: Yup.string(errorMenssage.name).required(errorMenssage.name),
                email: Yup.string(errorMenssage.email).email(errorMenssage.email).required(errorMenssage.email),
                repeatEmail: Yup.string().oneOf([Yup.ref('email'), null], errorMenssage.repeatEmail),
                password: Yup.string(errorMenssage.password).min(6).required(errorMenssage.password),
                repeatPassword: Yup.string().oneOf([Yup.ref('password'), null], errorMenssage.repeatPassword),

            });

            await scheme.validate(data, {
                abortEarly: false,
            });

            signUp(data.name, data.email, data.password);

        } catch (error) {

            const valitadeErros = {}

            if (error instanceof Yup.ValidationError) {


                error.inner.forEach(err => {
                    valitadeErros[err.path] = err.message
                });
                formRef.current.setErrors(valitadeErros);
            }


        }
    }
    return (
        <Container>
            <Form style={{ width: '90%', justifyContent: "center", alignItems: "center" }} ref={formRef} onSubmit={handleSubmit}>
                <Input name="name" label="Nome:" />
                <Input name="email" label="Email:" type="email" />
                <Input name="repeatEmail" label="Confirme o Email:" type="email" />
                <Input name="password" label="Senha:" type="password" />
                <Input name="repeatPassword" label="Repita a senha:" type="password" />

            </Form>
            <MyButton title={"Cadastrar"} onClick={() => formRef.current.submitForm()} />
            <TouchableOpacity onPress={onSwitchToSignIn}>
                <Link>
                    <LinkText>Já tenho uma conta</LinkText>
                </Link>
            </TouchableOpacity>
        </Container>
    );
}

export default SignUpScreen;
