import React, { useRef, useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ModalContainer, HeaderModal, ModalBackgroud, } from '../../../utils/Style';

import Icon from '@expo/vector-icons/MaterialIcons';
import { Form } from '@unform/mobile';
import InputText from '../../../components/Form/InputText';
import InputPhone from '../../../components/Form/InputPhone';
import * as Yup from 'yup';

export default function NewClient({ setClient }) {

  // const { user } = useContext(AuthContext);
  const formRef = useRef(null);

  const msgErrorName = 'Nome é obrigatório!';
  const msgErrorPhone = 'Telefone é obrigatório!';

  async function handleSubmit(data) {

    try {
      const scheme = Yup.object().shape({
        name: Yup.string(msgErrorName).required(msgErrorName),
        phone: Yup.string(msgErrorPhone).required(msgErrorPhone),
      });

      await scheme.validate(data, { abortEarly: false });

      setClient(data);

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

        <ModalContainer
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          enabled
        >
          <HeaderModal>
            <TouchableOpacity
              onPress={()=>formRef.current.submitForm()}
              style={{ position: 'absolute', right: 0 }}>
              <Icon name="how-to-reg" size={30} color='#000' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => modalClose(false)}
              style={{ position: 'absolute', left: 0 }}>
              <Icon name="close" size={30} color='#000' />
            </TouchableOpacity>
          </HeaderModal>

          <Form style={{ width: '100%' }} onSubmit={handleSubmit} ref={formRef}>
            <InputText name='name' label={"Nome"} type="text" />
            <InputPhone name={'phone'} label={"Telefone"} />
          </Form>

        </ModalContainer>


      </ModalBackgroud>

    </TouchableWithoutFeedback>

  );
}
