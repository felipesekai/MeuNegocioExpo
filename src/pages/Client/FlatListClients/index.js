import React from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, ItemListText } from '../styles';
import { alertMenssage } from '../../../utils/Strings';

const FlatListClients = ({ clients, handlerEdit, handleDelete }) => {
    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={clients}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <Card onPress={() => handlerEdit({ ...item, id: item._id })}
                        onLongPress={() => {
                            Alert.alert(alertMenssage.deleteTitle, alertMenssage.deleteClientDescription,
                                [
                                    {
                                        text: "sim",
                                        onPress: () => handleDelete(item._id),
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
        </View>
    );
}

export default FlatListClients;
