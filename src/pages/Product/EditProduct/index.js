import {
    ModalContainer,
    HeaderModal, ModalBackgroud,
} from '../../../utils/Style';
import React, { useState, useRef } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import InputText from '../../../components/Form/InputText';

const EditProduct = ({ onClose, initialValue, submitEdit }) => {

    const formRef = useRef(null);

    async function handleSubmit(data) {
        const msgErrorName = "Nome do produto é obrigatório!"
        const msgErrorQuanti = 'Quantidade do produto é obrigatório!'
        const msgErrorPrice = 'Preço do produto é obrigatório!'

        try {
            const scheme = Yup.object().shape({
                name: Yup.string(msgErrorName).required(msgErrorName),
                quantity: Yup.number(msgErrorQuanti).required(msgErrorQuanti),
                price: Yup.string(msgErrorPrice).required(msgErrorPrice),
            })

            await scheme.validate(data, { abortEarly: false });
            let newData = {...{id: initialValue.id}, ...data}
            submitEdit(newData);
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
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ModalBackgroud
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                enabled
            >
                <ModalContainer>

                    <HeaderModal>
                        {/* cancel */}
                        <TouchableOpacity
                            onPress={() => onClose(false)}
                            style={{ position: 'absolute', left: 0 }}>
                            <Icon name="close" size={30} color='#000' />
                        </TouchableOpacity>
                        {/* comfirm */}
                        <TouchableOpacity
                            onPress={() => formRef.current.submitForm()}
                            style={{ position: 'absolute', right: 0 }}>
                            <Icon name="add-task" size={30} color='#000' />
                        </TouchableOpacity>

                    </HeaderModal>

                    <Form onSubmit={handleSubmit} initialData={initialValue} style={{ width: '90%' }} ref={formRef}>
                        <InputText name="name" label="Nome" />
                        <InputText name="quantity" label="Quantidade" keyboardType="numeric" type="number" />
                        <InputText name="price" label="Preço"  keyboardType="numeric" type="number"/>
                    </Form>

                    

                </ModalContainer>
            </ModalBackgroud>
        </TouchableWithoutFeedback>
    );
}

export default EditProduct;