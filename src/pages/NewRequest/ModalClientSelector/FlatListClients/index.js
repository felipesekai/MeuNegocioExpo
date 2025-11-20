import React from 'react';
import { FlatList } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Card, ItemListText } from './styles';
import { observeClients } from '../../../../database/repository';

const FlatListClients = ({ clients, handlerSelect }) => {
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={clients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Card onPress={() => handlerSelect(item)}>
                    <ItemListText>{item.name}</ItemListText>
                </Card>)}
        />
    );
}

const enhance = withObservables([], () => ({
    clients: observeClients(),
}));

export default enhance(FlatListClients);