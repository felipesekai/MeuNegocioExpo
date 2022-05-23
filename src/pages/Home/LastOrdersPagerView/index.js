import { getDatabase, ref, onValue, get, query, limitToLast } from 'firebase/database';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, KeyboardAvoidingView, FlatList } from 'react-native';
import FloatingButton, { Icons } from '../../../components/FloatingButton';
import { AuthContext } from '../../../contexts/auth';
import { Background } from '../../../utils/Style';
import NewRequest from '../../NewRequest';
import Card from './Card';

const LastOrders = () => {
  const [NewRequestStatus, setNewRequestStatus] = useState(false);
  const { user } = useContext(AuthContext);
  const [listOrdered, setListOrdered] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const orderedRef = ref(db, `users/${user.id}/ordered`);
    onValue(orderedRef, (snapshot) => {
      setListOrdered([]);
      snapshot.forEach((item) => {
        let data = {
          id: item.key,
          clientId: item.val().clientId,
          clientName: item.val().clientName,
          date: item.val().date,
          total: item.val().total,
          products: item.val().products
        }

        setListOrdered(oldArray => [data, ...oldArray]);
      })
    }); 
    


  }, [])

  if (NewRequestStatus) {
    return (
      <NewRequest onClose={() => setNewRequestStatus(false)} />
    )

  }

  return (
    <Background>
      <View>
        <FlatList
          data={listOrdered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card data={item} />
          )}
        />

      </View>
      <FloatingButton icon={Icons('add', 30, 'white')} onClick={() => setNewRequestStatus(true)} />
    </Background>);
}

export default LastOrders;