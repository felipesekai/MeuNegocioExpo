import React, { useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { Background } from '../../../../../utils/Style';
import CardItens from './CardItens';
import MyButton from '../../../../../components/MyButton';
import { getAllProduct } from '../../../../../database';
import { AuthContext } from '../../../../../contexts/auth';
// import { Container } from './styles';

const FlatListProducts = ({ userId }) => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setProducts([])
        getAllProduct(user.id).then((products) => {
            products.forEach((product) => {
                let data = { key: product.key, name: product.val().name, price: product.val().price, quantity: 0 }
                setProducts(oldArray => [...oldArray, data]);
                console.log(data);
            })
        }).catch((error) => { })

    }, [])
    
    return (
        <Background>
            <FlatList
                data={products}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (<CardItens item={item} />)}
            />

            <MyButton title={'Confirmar'} onClick={() => console.log(products.filter(item => item.quantity > 0))} />

        </Background>);
}

export default FlatListProducts;