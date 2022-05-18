import { getDatabase, ref, onValue, get } from 'firebase/database';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, KeyboardAvoidingView, FlatList } from 'react-native';
import FloatingButton, { Icons } from '../../../components/FloatingButton';
import { AuthContext } from '../../../contexts/auth';
import { Background } from '../../../utils/Style';
import NewRequest from '../../NewRequest';

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
          date: item.val().date,
          total: item.val().total,
          products: item.val().products
        }
        setListOrdered(oldArray => [...oldArray, data]);
      })
    });

    // let client = null;
    // const clientsRef = ref(db, `users/${user.id}/clients/${item.val().clientId}`);
    // get(clientsRef).then((clients) =>    
    // {
    //  clients.filter((item) => item.key==)

    // }        )

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
            <View>
              <Text>{"Cliente: " + item.clientId}</Text>
              <Text>{"number: " + item.id}</Text>
              <Text>{"data: " + item.date}</Text>
            </View>)}
        />
        <Text>Last Order</Text>

      </View>
      <FloatingButton icon={Icons('add', 30, 'white')} onClick={() => setNewRequestStatus(true)} />
    </Background>);
}

export default LastOrders;