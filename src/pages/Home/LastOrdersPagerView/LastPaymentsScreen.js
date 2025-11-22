import React, { useState, useContext, useCallback, useMemo } from 'react';
import { View, FlatList, Alert, TextInput } from 'react-native';
import { AuthContext } from '../../../contexts/auth';
import { Background } from '../../../utils/Style';
import Card from './Card';
import { useOrders } from '../../../hooks/useOrders';
import { useFocusEffect } from '@react-navigation/native';
import LoaderOverlay from '../../../components/LoaderOverlay';
import ListEmpty from '../../../components/ListEmpty';
import { confirmDialog } from '../../../utils/dialogs';
import { useClients } from '../../../hooks/useClients';

const LastPaymentsScreen = () => {
  const { user } = useContext(AuthContext);
  const { orders, refresh, loading, getOrderDetails, updateStatus } = useOrders();
  const { clients, refresh: refreshClients } = useClients();
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      refresh({ force: true });
      refreshClients({ force: true });
    }, [refresh, refreshClients]),
  );

  const paidOrders = useMemo(() => orders.filter((o) => o.status === 'paid'), [orders]);
  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return paidOrders;
    return paidOrders.filter((order) => {
      const client = clients.find((c) => c._id === order.clientId);
      const name = client?.name?.toLowerCase() || '';
      return name.includes(term);
    });
  }, [paidOrders, clients, search]);

  const openOrder = useCallback(async (order) => {
    try {
      const fullOrder = await getOrderDetails(order._id);
      if (!fullOrder) {
        Alert.alert('Pedido não encontrado');
        return;
      }
      // Payments screen is view-only; could navigate to editor if needed
      Alert.alert('Pedido pago', `Cliente: ${fullOrder.client?.name || ''}\nTotal: ${order.totalAmount.toFixed(2)}`);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível abrir o pedido.');
    }
  }, [getOrderDetails]);

  const markAsUnpaid = useCallback(
    (order) => {
      confirmDialog({
        title: 'Marcar como não pago?',
        message: 'Este pedido voltará para a lista de pendentes.',
        onConfirm: async () => {
          await updateStatus(order._id, 'pending');
        },
      });
    },
    [updateStatus],
  );

  const renderOrder = useCallback(
    ({ item }) => <Card data={item} onPress={() => openOrder(item)} onLongPress={() => markAsUnpaid(item)} />,
    [openOrder, markAsUnpaid],
  );

  const keyExtractor = useCallback((item) => item._id, []);

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
          ListEmptyComponent={<ListEmpty message="Nenhum pedido pago." />}
        />
      </View>
      <LoaderOverlay visible={loading} />
    </Background>);
};

export default LastPaymentsScreen;
