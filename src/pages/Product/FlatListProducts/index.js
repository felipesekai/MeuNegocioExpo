import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { getDatabase, onValue, ref } from 'firebase/database';
import CardProducts from './CardProducts';

const FlatListProducts = ({ userId, openEdit, itemEdit, handlerDelete }) => {

    const [productlist, setProductList] = useState([]);

    useEffect(() => {
        try {
            const db = getDatabase();
            const productsRef = ref(db, 'users/' + userId + '/products')
            onValue(productsRef, (snapshot) => {
                setProductList([]);
                snapshot.forEach((product) => {
                    const data = {
                        id: product.key,
                        name: product.val().name,
                        quantity: product.val().quantity,
                        price: product.val().price
                    }

                    setProductList(oldArray => [...oldArray, data]);

                });

            })
        } catch (error) {
            console.log(error)
        }

    }, []);

    function handlerEdit(item) {
        openEdit(true);
        itemEdit(item);
    }
    return (
    <View>
        <FlatList
            showsVerticalScrollIndicator={false}
            data={productlist}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (<CardProducts editItem={handlerEdit} itens={item} itemDelete={handlerDelete} />)}
        />
    </View>
    );
}

export default FlatListProducts;