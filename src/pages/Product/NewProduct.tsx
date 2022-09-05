import { Form } from '@unform/mobile';
import React, { useRef } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import * as Yup from 'yup';
import InputText from '../../components/Form/InputText';
import { ModalBackgroud, ModalContainer } from '../../utils/Style';
import Icon from '@expo/vector-icons/MaterialIcons';
import { Button, Modal } from 'native-base';


type product = {
    id?: string,
    name: string,
    price: number,
    quantity: number,

}

type modalProps = {
    visible: boolean,
    onClose: (bol: boolean) => void,
    setNewProduct: (data: product) => void

}

const NewProduct = ({ setNewProduct, visible, onClose, }: modalProps) => {

    const formRef = useRef(null);

    async function handleSubmit(data) {
        const stringN = "Nome do produto é obrigatório!"
        const stringQ = 'Quantidade do produto é obrigatório!'
        const stringP = 'Preço do produto é obrigatório!'

        try {
            const scheme = Yup.object().shape({
                name: Yup.string().required(stringN),
                quantity: Yup.number().required(stringQ),
                price: Yup.string().required(stringP),
            })

            await scheme.validate(data, { abortEarly: false });
            let newData = {
                name: data.name,
                quantity: data.quantity,
                price: data.price
            }

            setNewProduct(data);

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
        <Modal
            avoidKeyboard
            // justifyContent={"flex-end"}
            bottom='4' size='lg'
            isOpen={visible}
            onClose={() => onClose(false)}
        >
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Cadastre um novo Produto</Modal.Header>
                <Modal.Body>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <ModalBackgroud
                            behavior={Platform.OS === 'ios' ? 'padding' : ''}
                            enabled
                        >
                            <ModalContainer>
                                <Form onSubmit={handleSubmit} style={{ width: '90%' }} ref={formRef}>
                                    <InputText name="name" label="Nome" />
                                    <InputText name="quantity" label="Quantidade" keyboardType="numeric" type="number" />
                                    <InputText name="price" label="Preço" keyboardType="numeric" type="number" />
                                </Form>
                            </ModalContainer>
                        </ModalBackgroud>
                    </TouchableWithoutFeedback>
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={() => formRef.current.submitForm()}>ok</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );

}

export default NewProduct;