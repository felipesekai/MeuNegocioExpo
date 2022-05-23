import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { getDatabase, ref, onValue } from "firebase/database"
import { Card, ItemListText } from '../styles';
import { AuthContext } from '../../../contexts/auth';
import { alertMenssage } from '../../../utils/Strings';

const FlatListClients = ({ handlerEdit, userId, handleDelete }) => {
    const { setLoading } = useContext(AuthContext);
    const [listClients, setListClients] = useState([]);


    useEffect(() => {
        try {
            setLoading(true);
            const db = getDatabase();
            const clientsRef = ref(db, `users/${userId}/clients/`);
            onValue(clientsRef, (snapshot) => {
                setListClients([]);

                snapshot.forEach(item => {
                    let data = { id: item.key, name: item.val().name, phone: item.val().phone };
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
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Card onPress={() => handlerEdit(item)} 
                onLongPress={() =>{
                    Alert.alert(alertMenssage.deleteClientTitle, alertMenssage.deleteClientDescription,
                       [
                        {
                            text: "sim",
                            onPress: () => handleDelete(item),                              
                            
                        },
                           {
                               text: "NÃO",                               
                               style: "cancel",
                           },
                          
                       ]);
                }}>
                    <ItemListText>{item.name}</ItemListText>
                </Card>)}
        />
    );
}

export default FlatListClients;