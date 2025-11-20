import React from 'react';
import { View, FlatList, Alert } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Card, ItemListText } from '../styles';
import { alertMenssage } from '../../../utils/Strings';
import { observeClients } from '../../../database/repository';
import Client from '../../../database/model/Client'; // Import model for type hinting

const FlatListClients = ({ clients, handlerEdit, handleDelete }) => {
    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={clients}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => handlerEdit(item)}
                        onLongPress={() => {
                            Alert.alert(alertMenssage.deleteTitle, alertMenssage.deleteClientDescription,
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
        </View>
    );
}

const enhance = withObservables([], () => ({
    clients: observeClients(),
}));

export default enhance(FlatListClients);