import React, { useState, useContext, useCallback } from 'react';
import { Modal } from 'react-native';
import { Background } from '../../utils/Style';
import Header from '../../components/Header';
import { Container } from './styles';
import FloatingButton from '../../components/FloatingButton';
import Icon from '@expo/vector-icons/MaterialIcons';
import FlatListClients from './FlatListClients';
import { AuthContext } from '../../contexts/auth';
import { useTheme } from 'styled-components';
import EditClient from './EditClient';
import NewClient from './NewClient';
import { useClients } from '../../hooks/useClients';
import { useFocusEffect } from '@react-navigation/native';
import LoaderOverlay from '../../components/LoaderOverlay';
import { confirmDialog } from '../../utils/dialogs';

export default function ClientScreen() {
  const theme = useTheme();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalEditVisibility, setModalEditVisibility] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const { setLoading } = useContext(AuthContext);
  const { clients, refresh, createClient, updateClient, deleteClient, loading, mutating } = useClients();

  useFocusEffect(
    useCallback(() => {
      refresh({ force: true });
    }, [refresh]),
  );

  function editPerson(person) {
    setUserEdit(person);
    setModalEditVisibility(true);
  }

  async function addClient(client) {
    setLoading(true);
    try {
      await createClient({ name: client.name, phone: client.phone, email: client.email, address: client.address });
      alert('Success');
      setModalVisibility(false);
      refresh({ force: true });
    } catch (err) {
      console.log(err);
      alert('Error saving client');
    } finally {
      setLoading(false);
    }
  }

  async function editClient(client) {
    setLoading(true);
    try {
      await updateClient({ _id: client.id, name: client.name, phone: client.phone, email: client.email, address: client.address });
      alert('Success');
      setModalEditVisibility(false);
      refresh({ force: true });
    } catch (err) {
      console.log(err);
      alert('Error updating client');
    } finally {
      setUserEdit(null);
      setLoading(false);
    }
  }

  function removeClient(client) {
    const clientId = typeof client === 'string' ? client : client.id;
    confirmDialog({
      title: 'Excluir cliente',
      message: 'Deseja realmente excluir este cliente?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteClient(clientId);
          alert('Cliente Excluido!');
          refresh({ force: true });
        } catch (err) {
          console.log(err);
          alert('Error deleting client');
        } finally {
          setLoading(false);
          setModalVisibility(false);
        }
      },
    });
  }

  return (
    <Background>
      <Header />
      <Container>
        <FlatListClients clients={clients} handlerEdit={editPerson} handleDelete={removeClient} />
      </Container>

      {modalVisibility && (
        <Modal transparent animationType="slide" visible={modalVisibility} onRequestClose={() => setModalVisibility(false)}>
          <NewClient modalClose={setModalVisibility} setClient={addClient} />
        </Modal>
      )}
      {modalEditVisibility && (
        <Modal transparent animationType="slide" visible={modalEditVisibility} onRequestClose={() => setModalEditVisibility(false)}>
          <EditClient modalClose={setModalEditVisibility} initialValue={userEdit} updateClient={(client) => editClient(client)} />
        </Modal>
      )}
      <FloatingButton
        onClick={() => setModalVisibility(true)}
        icon={<Icon name="person-add" size={30} color="white" />}
        accessibilityLabel="Adicionar cliente"
      />
      <LoaderOverlay visible={loading || mutating} />
    </Background>
  );
}
