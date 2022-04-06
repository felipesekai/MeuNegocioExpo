import React, { useState, useContext } from 'react';
import { Text, View, FlatList, Modal, } from 'react-native';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import { Container, Card, ItemListText, ModalContainer } from './styles';
import FloatingButton from '../../components/FloatingButton';
import Icon from '@expo/vector-icons/MaterialIcons';
import NewClient from './NewClient';
import FlatListClients from './FlatListClients';
import { AuthContext } from '../../contexts/auth';
import { insertClient } from '../../database';

export default function Client() {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const {user} = useContext(AuthContext);
  const [people, setPeople] = useState([
    { key: 1, nome: 'felipe', telefone: '123465789' },
    { key: 2, nome: 'marcos', telefone: '123465789' },
    { key: 3, nome: 'jose', telefone: '123465789' },
  ]);
  console.log(user.id)

  function addClient(name, phone) {
    setPeople(oldArray => [{ key: people.length + 1, nome: name, phone: phone }, ...oldArray]);
    if(user){
      insertClient(user.id, name, phone).then(() => {alert("success")}).catch(err => console.log(err))
    }
   

    // console.log(people);
  }

  function editPerson(person){
    setModalVisibility(true);
    setUserEdit(person);
  }

  return (
    <Background>
      <Header />
      <Container>
        <FlatListClients handlerEdit={editPerson} list={people}/>

      </Container>

      {modalVisibility &&
        <Modal
          transparent={true}
          animationType="slide" visible={modalVisibility} onRequestClose={() => setModalVisibility(false)}>
          <NewClient modalClose={setModalVisibility} setClient={(name, phone) => addClient(name, phone)} client={userEdit}/>
        </Modal>
      }
      {/*botao add novo cliente*/}
      <FloatingButton onClick={() => setModalVisibility(true)}
        icon={<Icon name='person-add' size={30} color="white" />} />

    </Background>
  );
}