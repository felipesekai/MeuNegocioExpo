import React, {useContext, useRef } from 'react';
import { View } from 'react-native';
import { Background } from '../../utils/Style';
import { AuthContext } from '../../contexts/auth';
import { Container } from './styles';
import { Form } from '@unform/mobile';
import Input from './Input';
import MyButton from '../../components/MyButton';
import * as Yup from 'yup';


const SignUp = () => {
    const { signUp } = useContext(AuthContext);

    const formRef = useRef(null);

    async function handleSubmit(data) {
        try {
            const scheme = Yup.object().shape({
                name: Yup.string("Necessario Preencher o campo nome!").required("Necessario Preencher o campo nome!"),
                email: Yup.string("Formato do Email é invalido!").email("Formato do Email é invalido!").required("Formato do Email é invalido!"),
                password: Yup.string("senha tem que ter no minimo 6 caracteres").min(6).required("senha tem que ter no minimo 6 caracteres"),
                repeatPassword:  Yup.string().oneOf([Yup.ref('password'), null], "senhas não conhecidem"),
        
            });

            await scheme.validate(data, {
                abortEarly: false,
            });

            signUp(data.name,data.email, data.password);

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
        <Background>
            <Container>
                <Form style={{ width: '90%' }} ref={formRef} onSubmit={handleSubmit}>
                    <Input name="name" label="Nome:" />
                    <Input name="email" label="Email:" type="email" />
                    <Input name="password" label="Senha:" type="password" />
                    <Input name="repeatPassword" label="Repita a senha:" type="password" />

                </Form>
                <MyButton title={"Cadastrar"} onClick={() => formRef.current.submitForm()} />
            </Container>
        </Background>
    );
}

export default SignUp;