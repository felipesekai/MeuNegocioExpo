import React, { useEffect, useState, useContext } from 'react';
import { View, Text, KeyboardAvoidingView, FlatList } from 'react-native';
import FloatingButton, { Icons } from '../../../components/FloatingButton';
import { AuthContext } from '../../../contexts/auth';
import { Background } from '../../../utils/Style';
import NewRequest from '../../NewRequest';
import Card from './Card';
import { getAllOrders } from '../../../database';

const LastOrders = () => {
  const [NewRequestStatus, setNewRequestStatus] = useState(false);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const allOrders = await getAllOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  if (NewRequestStatus) {
    return (
      <NewRequest onClose={() => setNewRequestStatus(false)} />
    )

  }

  return (
    <Background>
      <View>
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <Card data={item} />
          )}
        />

      </View>
      <FloatingButton icon={Icons('add', 30, 'white')} onClick={() => setNewRequestStatus(true)} />
    </Background>);
}

export default LastOrders;
