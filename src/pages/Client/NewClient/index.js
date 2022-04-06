import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ModalContainer, Input, ViewInput, TextOverInputs, HeaderModal, ModalBackgroud, } from '../../../utils/Style';
import { styles } from '../../../utils/Style';
import Icon from '@expo/vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';
import { insertClient, insertUser } from '../../../database';
import { AuthContext } from '../../../contexts/auth';

export default function NewClient({ modalClose, setClient, client }) {

  const {user} = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if(client){
      setName(client.nome);
      setPhone(client.telefone);
    }
  },[]);

  // insertClient()

  function addUser() {
    // if(client){
    //   setClient(name, phone);

    //   modalClose(false);

    //   return
    // }
    if (name !== '' && phone !== '') {
      setClient(name, phone);
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
