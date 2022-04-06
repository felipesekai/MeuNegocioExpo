import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';

import { Card, ItemListText } from '../styles';

const FlatListClients = ({list, handlerEdit}) => {

    const [listClients, setListClients] = useState(list);

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={listClients}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
                <Card  onLongPress={() =>handlerEdit(item)}>
                    <ItemListText>{item.nome}</ItemListText>
                </Card>)}
        />
    );
}

export default FlatListClients;