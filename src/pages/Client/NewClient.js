import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ModalContainer, Input, ViewInput, TextOverInputs, HeaderModal, ModalBackgroud, } from '../../components/Style';
import { styles } from '../../components/Style';
import Icon from '@expo/vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';

export default function NewClient({ modalClose, setUser }) {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // const formatText = (text) => {


  //     let format = text.match(/(\d{2})\D*(\d{5}|\d{4})\D*(\d{4})$/);
  //     console.log(format);

  //     if(format) {
  //     var final = `(${format[1]}) ${format[2]}-${format[3]}`;
  //     console.log(final);
  //     setPhone(final);
  //     return final;
  //   }
  //   setPhone(text);


  // };

  function addUser() {
    if (name !== '' && phone !== '') {
      setUser(name, phone);
      modalClose(false);
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
              onPress={addUser}
              style={{ position: 'absolute', right: 0 }}>
              <Icon name="how-to-reg" size={30} color='#000' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => modalClose(false)}
              style={{ position: 'absolute', left: 0 }}>
              <Icon name="close" size={30} color='#000' />
            </TouchableOpacity>
          </HeaderModal>


          {/* //view dos inputs */}
          <ViewInput>
            <TextOverInputs>Nome</TextOverInputs>
            <Input placeholder="Nome"
              value={name}
              onChangeText={(text) => setName(text)}
              
            />
            <TextOverInputs>Telefone</TextOverInputs>
            <TextInputMask
              style={styles.TInputMasked}
              placeholder="(99) 9999-9999"
              type={'cel-phone'}
              value={phone}
              keyboardType='phone-pad'
              onChangeText={(text) => setPhone(text)}
              options={{
                maskType: 'BRL',
                dddMask: '(99)',
                withDDD: true,
              }}
            />
          </ViewInput>


        </ModalContainer>


      </ModalBackgroud>

    </TouchableWithoutFeedback>

  );
}
