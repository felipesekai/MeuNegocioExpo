import {
  ModalContainer,
  HeaderModal,
  ModalBackgroud,
} from '../../../utils/Style';
import React, { useRef } from 'react';
  import { TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { Form } from '@unform/mobile';
import { productSchema } from '../../../validation/schemas';
import InputText from '../../../components/Form/InputText';
import * as Yup from 'yup';

const NewProduct = ({ onClose, setNewProduct }) => {
  const formRef = useRef(null);

  async function handleSubmit(data) {
    try {
      await productSchema.validate(data, { abortEarly: false });
      setNewProduct(data);
    } catch (error) {
      const valitadeErros = {};
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          valitadeErros[err.path] = err.message;
        });
        formRef.current.setErrors(valitadeErros);
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ModalBackgroud behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
        <ModalContainer>
          <HeaderModal>
            <TouchableOpacity onPress={() => onClose(false)} style={{ position: 'absolute', left: 0 }}>
              <Icon name="close" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => formRef.current.submitForm()} style={{ position: 'absolute', right: 0 }}>
              <Icon name="add-task" size={30} color="#000" />
            </TouchableOpacity>
          </HeaderModal>

          <Form onSubmit={handleSubmit} style={{ width: '90%' }} ref={formRef}>
            <InputText name="name" label="Nome" />
            <InputText name="description" label="Descrição" />
            <InputText name="price" label="Preço" keyboardType="numeric" type="number" />
            <InputText name="quantity" label="Quantidade" keyboardType="numeric" type="number" />
          </Form>
        </ModalContainer>
      </ModalBackgroud>
    </TouchableWithoutFeedback>
  );
};

export default NewProduct;
