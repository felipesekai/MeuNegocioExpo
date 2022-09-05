import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { getDatabase, onValue, ref } from 'firebase/database';
import CardProducts from './CardProducts';

const FlatListProducts = ({ userId, openEdit, itemEdit, handlerDelete }) => {

    const [productlist, setProductList] = useState([]);

    useEffect(() => {
        let tempList = [];
        try {
            const db = getDatabase();
            const productsRef = ref(db, 'users/' + userId + '/products')
            onValue(productsRef, (snapshot) => {
                tempList = [];
                setProductList([]);
                snapshot.forEach((product) => {
                    const data = {
                        id: product.key,
                        name: product.val().name,
                        quantity: product.val().quantity,
                        price: product.val().price
                    }

                    tempList.push(data);



                });

            })
        } catch (error) {
            console.log(error)
        }
        tempList.sort((a, b) => {
            return a.name > b.name ? 1 : -1
        });
        setProductList(tempList);


    }, []);

    function handlerEdit(item) {
        openEdit(true);
        itemEdit(item);
    }
    return (
        <View style={{ marginBottom: 20 }}>
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