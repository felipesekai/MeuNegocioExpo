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
    setVisble: (bol: boolean) => void,
    initialValue: product,
    submitEdit: (data: product) => void

}


const ModalEditProduct = ({ initialValue, submitEdit, visible, setVisble, }: modalProps) => {

    const formRef = useRef(null);

    async function handleSubmit(data: product) {
        const msgErrorName = "Nome do produto é obrigatório!"
        const msgErrorQuanti = 'Quantidade do produto é obrigatório!'
        const msgErrorPrice = 'Preço do produto é obrigatório!'

        try {
            const scheme = Yup.object().shape({
                name: Yup.string().required(msgErrorName),
                quantity: Yup.number().required(msgErrorQuanti),
                price: Yup.string().required(msgErrorPrice),
            })

            await scheme.validate(data, { abortEarly: false });
            let newData = { ...{ id: initialValue.id }, ...data }
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
        <Modal
            avoidKeyboard
            // justifyContent={"flex-end"}
            bottom='4' size='lg'
            isOpen={visible}
            onClose={() => setVisble(false)}
        >
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Edit a Product</Modal.Header>
                <Modal.Body>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <ModalBackgroud
                            behavior={Platform.OS === 'ios' ? 'padding' : ''}
                            enabled
                        >
                            <ModalContainer>
                                <Form onSubmit={handleSubmit} initialData={initialValue} style={{ width: '90%' }} ref={formRef}>
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

    // return (
    //     <Form onSubmit={handleSubmit} initialData={initialValue} style={{ width: '90%' }} ref={formRef}>
    //         <InputText name="name" label="Nome" />
    //         <InputText name="quantity" label="Quantidade" keyboardType="numeric" type="number" />
    //         <InputText name="price" label="Preço" keyboardType="numeric" type="number" />
    //     </Form>
    // );
}

export default ModalEditProduct;