import React from 'react';
import { View, FlatList } from 'react-native';
import withObservables from '@nozbe/with-observables';
import CardProducts from './CardProducts';
import { observeProducts } from '../../../database/repository';

const FlatListProducts = ({ products, openEdit, itemEdit, handlerDelete }) => {

    function handlerEdit(item) {
        openEdit(true);
        itemEdit(item);
    }
    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={products}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (<CardProducts editItem={handlerEdit} itens={item} itemDelete={handlerDelete} />)}
            />
        </View>
    );
}

const enhance = withObservables([], () => ({
    products: observeProducts(),
}));

export default enhance(FlatListProducts);