import React, { useState, useContext, useCallback, useMemo } from 'react';
import { View, FlatList, Alert, TextInput } from 'react-native';
import FloatingButton, { Icons } from '../../../components/FloatingButton';
import { AuthContext } from '../../../contexts/auth';
import { Background } from '../../../utils/Style';
import NewRequestScreen from '../../NewRequest/NewRequestScreen';
import Card from './Card';
import { useOrders } from '../../../hooks/useOrders';
import { useFocusEffect } from '@react-navigation/native';
import LoaderOverlay from '../../../components/LoaderOverlay';
import ListEmpty from '../../../components/ListEmpty';
import { confirmDialog } from '../../../utils/dialogs';
import { useClients } from '../../../hooks/useClients';
import OrderDetailsModal from './OrderDetailsModal';

const LastOrdersScreen = () => {
  const [NewRequestStatus, setNewRequestStatus] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const { orders, refresh, loading, getOrderDetails, updateStatus } = useOrders();
  const { clients, refresh: refreshClients } = useClients();

  useFocusEffect(
    useCallback(() => {
      refresh({ force: true });
      refreshClients({ force: true });
    }, [refresh, refreshClients]),
  );

  const unpaidOrders = useMemo(() => orders.filter((o) => o.status !== 'paid'), [orders]);
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return unpaidOrders;
    return unpaidOrders.filter((order) => {
      const client = clients.find((c) => c._id === order.clientId);
      const name = client?.name?.toLowerCase() || '';
      return name.includes(term);
    });
  }, [unpaidOrders, clients, search]);

  const openOrderDetails = useCallback(
    async (order) => {
      try {
        const fullOrder = await getOrderDetails(order._id);
        if (!fullOrder) {
          Alert.alert('Pedido não encontrado');
          return;
        }
        setViewingOrder(fullOrder);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível abrir o pedido.');
      }
    },
    [getOrderDetails],
  );

  const togglePaid = useCallback(
    (order) => {
      confirmDialog({
        title: order.status === 'paid' ? 'Marcar como não pago?' : 'Marcar como pago?',
        message: order.status === 'paid' ? 'Este pedido voltará para a lista de pendentes.' : 'Este pedido será marcado como pago.',
        onConfirm: async () => {
          await updateStatus(order._id, order.status === 'paid' ? 'pending' : 'paid');
        },
      });
    },
    [updateStatus],
  );

  const renderOrder = useCallback(
    ({ item }) => <Card data={item} onPress={() => openOrderDetails(item)} onLongPress={() => togglePaid(item)} />,
    [openOrderDetails, togglePaid],
  );

  const keyExtractor = useCallback((item) => item._id, []);

  if (NewRequestStatus) {
    return (
      <NewRequestScreen
        onClose={() => {
          setNewRequestStatus(false);
          setEditingOrder(null);
          refresh({ force: true });
        }}
        onCreated={refresh}
        initialOrder={editingOrder}
      />
    );
  }

  return (
    <Background>
      <View>
        <TextInput
          placeholder="Filtrar por cliente"
          value={search}
          onChangeText={setSearch}
          style={{
            marginHorizontal: 12,
            marginTop: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: '#fff',
          }}
        />
        <FlatList
          data={filteredOrders}
          keyExtractor={keyExtractor}
          renderItem={renderOrder}
          ListEmptyComponent={<ListEmpty message="Nenhum pedido pendente." />}
        />

      </View>
      <FloatingButton
        icon={Icons('add', 30, 'white')}
        onClick={() => {
          setEditingOrder(null);
          setNewRequestStatus(true);
        }}
        accessibilityLabel="Criar pedido"
      />
      <LoaderOverlay visible={loading} />
      <OrderDetailsModal
        visible={Boolean(viewingOrder)}
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onEdit={() => {
          setEditingOrder(viewingOrder);
          setViewingOrder(null);
          setNewRequestStatus(true);
        }}
      />
    </Background>);
};

export default LastOrdersScreen;
