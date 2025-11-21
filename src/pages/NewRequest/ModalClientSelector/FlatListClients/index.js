import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Card, ItemListText } from './styles';
import { getAllClients } from '../../../../database';

const FlatListClients = ({ handlerSelect }) => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        async function fetchClients() {
            try {
                const fetchedClients = await getAllClients();
                setClients(fetchedClients);
            } catch (error) {
                console.error("Error fetching clients for selector:", error);
            }
        }
        fetchClients();
    }, []);

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={clients}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
                <Card onPress={() => handlerSelect({ ...item })}>
                    <ItemListText>{item.name}</ItemListText>
                </Card>)}
        />
    );
}

export default FlatListClients;
