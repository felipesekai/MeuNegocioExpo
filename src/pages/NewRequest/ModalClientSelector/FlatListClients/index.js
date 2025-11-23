import React from 'react';
import { FlatList } from 'react-native';
import { Card, ItemListText } from './styles';
import { useClients } from '../../../../hooks/useClients';
import ListEmpty from '../../../../components/ListEmpty';

const FlatListClients = ({ handlerSelect }) => {
    const { clients, refresh } = useClients();

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={clients}
            keyExtractor={item => item._id}
            onRefresh={refresh}
            refreshing={false}
            ListEmptyComponent={<ListEmpty message="Nenhum cliente cadastrado." />}
            renderItem={({ item }) => (
                <Card onPress={() => handlerSelect({ ...item })}>
                    <ItemListText>{item.name}</ItemListText>
                </Card>)}
        />
    );
}

export default FlatListClients;
