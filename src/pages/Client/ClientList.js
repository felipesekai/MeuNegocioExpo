import React, { useState, useContext, useEffect } from 'react';
import {Modal, ActivityIndicator, } from 'react-native';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import { Container} from './styles';
import FloatingButton from '../../components/FloatingButton';
import Icon from '@expo/vector-icons/MaterialIcons';

import FlatListClients from './FlatListClients';
import { AuthContext } from '../../contexts/auth';
import { updateClient, insertClient } from '../../database';
import { useTheme } from 'styled-components';
import EditClient from './EditClient';
import NewClient from './NewClient';

export default function Client() {
  const theme = useTheme();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalEditVisibility, setModalEditVisibility] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const { user, loading, setLoading } = useContext(AuthContext);



  function editPerson(person) {
    setUserEdit(person);
    setModalEditVisibility(true);

  }


  function addClient(name, phone) {
    if (user) {
      insertClient(user.id, name, phone).then(() => { alert("success") }).catch(err => console.log(err))
    }
  }

  function editClient(clientId, name, phone) {
    if (user) {
      updateClient(user.id, clientId, name, phone).then(() => { alert("success") })
      .catch(err => console.log(err)).finally(() => {setUserEdit(null)});
    }
  }


  return (
    <Background>
      <Header />
      <Container>
        {loading
          ? <ActivityIndicator color={theme.primaryColor} size={30} />
          : <FlatListClients handlerEdit={editPerson} userId={user.id} />
        }

      </Container>

      {modalVisibility &&
        <Modal
          transparent={true}
          animationType="slide" visible={modalVisibility} onRequestClose={() => setModalVisibility(false)}>
          <NewClient modalClose={setModalVisibility} 
          setClient={(name, phone) => addClient(name, phone)}/>
        </Modal>
      }
        {modalEditVisibility &&
        <Modal
          transparent={true}
          animationType="slide" visible={modalEditVisibility} onRequestClose={() => setModalEditVisibility(false)}>
          <EditClient modalClose={setModalEditVisibility} 
          client={userEdit} updateClient={(id,name,phone)=>editClient(id,name,phone)}/>
        </Modal>
      }
      {/*botao add novo cliente*/}
      <FloatingButton onClick={() => setModalVisibility(true)}
        icon={<Icon name='person-add' size={30} color="white" />} />

    </Background>
  );
}