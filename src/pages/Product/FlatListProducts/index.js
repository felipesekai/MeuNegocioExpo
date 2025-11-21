import React from 'react';
import { View, FlatList } from 'react-native';
import CardProducts from './CardProducts';

const FlatListProducts = ({ products, openEdit, itemEdit, handlerDelete }) => {

    function handlerEdit(item) {
        openEdit(true);
        itemEdit({ ...item, id: item._id });
    }
    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={products}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (<CardProducts editItem={handlerEdit} itens={item} itemDelete={handlerDelete} />)}
            />
        </View>
    );
}

export default FlatListProducts;
