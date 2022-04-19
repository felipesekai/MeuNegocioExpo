import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList } from 'react-native';
import { getDatabase, ref, onValue } from "firebase/database"
import { Card, ItemListText } from './styles';
import { AuthContext } from '../../../../contexts/auth';

const FlatListClients = ({ handlerSelect }) => {
    const { setLoading, user } = useContext(AuthContext);
    const [listClients, setListClients] = useState([]);


    useEffect(() => {
        try {
            setLoading(true);
            const db = getDatabase();
            const clientsRef = ref(db, `users/${user.id}/clients/`);
            onValue(clientsRef, (snapshot) => {
                setListClients([]);

                snapshot.forEach(item => {
                    let data = { key: item.key, name: item.val().name, phone: item.val().phone };
                    setListClients(oldArray => [...oldArray, data]);
                });
               
            })
        } catch (error) {

        }
        setLoading(false);

    }, [])

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={listClients}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
                <Card onPress={() => handlerSelect(item)}>
                    <ItemListText>{item.name}</ItemListText>
                </Card>)}
        />
    );
}

export default FlatListClients;