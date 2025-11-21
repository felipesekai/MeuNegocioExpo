import React, { useState, useContext, useEffect } from 'react';
import { Modal, ActivityIndicator, } from 'react-native';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import { Container } from './styles';
import FloatingButton from '../../components/FloatingButton';
import Icon from '@expo/vector-icons/MaterialIcons';
import FlatListClients from './FlatListClients';
import { AuthContext } from '../../contexts/auth';
import { saveClient, deleteClient, getAllClients } from '../../database';
import { useTheme } from 'styled-components';
import EditClient from './EditClient';
import NewClient from './NewClient';

export default function Client() {
  const theme = useTheme();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalEditVisibility, setModalEditVisibility] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const { loading, setLoading } = useContext(AuthContext);
  const [clients, setClients] = useState([]); // State to hold clients

  useEffect(() => {
    fetchClients();
  }, []);

  // Function to fetch clients from the local database
  async function fetchClients() {
    setLoading(true);
    try {
      const allClients = await getAllClients();
      setClients(allClients);
    } catch (err) {
      console.log(err);
      alert("Error fetching clients");
    } finally {
      setLoading(false);
    }
  }

  function editPerson(person) {
    setUserEdit(person);
    setModalEditVisibility(true);
  }

  async function addClient(client) {
    setLoading(true);
    try {
      await saveClient({ name: client.name, phone: client.phone, email: client.email, address: client.address });
      alert("Success");
      setModalVisibility(false);
      fetchClients(); // Re-fetch clients to update the list
    } catch (err) {
      console.log(err);
      alert("Error saving client");
    } finally {
      setLoading(false);
    }
  }

  async function editClient(client) {
    setLoading(true);
    try {
      await saveClient({ _id: client.id, name: client.name, phone: client.phone, email: client.email, address: client.address });
      alert("Success");
      setModalEditVisibility(false);
      fetchClients(); // Re-fetch clients to update the list
    } catch (err) {
      console.log(err);
      alert("Error updating client");
    } finally {
      setUserEdit(null);
      setLoading(false);
    }
  }

  async function removeClient(client) {
    setLoading(true);
    try {
      const clientId = typeof client === 'string' ? client : client.id;
      await deleteClient(clientId);
      alert("Cliente Excluído!");
      fetchClients(); // Re-fetch clients to update the list
    } catch (err) {
      console.log(err);
      alert("Error deleting client");
    } finally {
      setLoading(false);
      setModalVisibility(false);
    }
  }

  return (
    <Background>
      <Header />
      <Container>
        <FlatListClients clients={clients} handlerEdit={editPerson} handleDelete={removeClient} />
      </Container>

      {modalVisibility &&
        <Modal
          transparent={true}
          animationType="slide" visible={modalVisibility} onRequestClose={() => setModalVisibility(false)}>
          <NewClient modalClose={setModalVisibility}
            setClient={addClient} />
        </Modal>
      }
      {modalEditVisibility &&
        <Modal
          transparent={true}
          animationType="slide" visible={modalEditVisibility} onRequestClose={() => setModalEditVisibility(false)}>
          <EditClient modalClose={setModalEditVisibility}
            initialValue={userEdit} updateClient={(client) => editClient(client)} />
        </Modal>
      }
      {/*botao add novo cliente*/}
      <FloatingButton onClick={() => setModalVisibility(true)}
        icon={<Icon name='person-add' size={30} color="white" />} />

    </Background>
  );
}
