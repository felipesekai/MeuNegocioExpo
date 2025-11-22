import React, { useState, useContext, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import FloatingButton, { Icons } from '../../../components/FloatingButton';
import { AuthContext } from '../../../contexts/auth';
import { Background } from '../../../utils/Style';
import NewRequestScreen from '../../NewRequest/NewRequestScreen';
import Card from './Card';
import { useOrders } from '../../../hooks/useOrders';

const LastOrdersScreen = () => {
  const [NewRequestStatus, setNewRequestStatus] = useState(false);
  const { user } = useContext(AuthContext);
  const { orders, refresh } = useOrders();

  const renderOrder = useCallback(({ item }) => <Card data={item} />, []);

  const keyExtractor = useCallback((item) => item._id, []);

  if (NewRequestStatus) {
    return (
      <NewRequestScreen
        onClose={() => setNewRequestStatus(false)}
        onCreated={refresh}
      />
    );
  }

  return (
    <Background>
      <View>
        <FlatList
          data={orders}
          keyExtractor={keyExtractor}
          renderItem={renderOrder}
        />

      </View>
      <FloatingButton icon={Icons('add', 30, 'white')} onClick={() => setNewRequestStatus(true)} />
    </Background>);
};

export default LastOrdersScreen;
