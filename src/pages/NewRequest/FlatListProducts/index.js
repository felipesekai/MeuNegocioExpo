import React, { useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { Container } from './styles';
import CardItens from './CardItens';
import { getAllProduct } from '../../../database';
import { AuthContext } from '../../../contexts/auth';
import ActiviteIndicatorCenter from '../../../components/ActiviteIndicatorCenter';
const FlatListProducts = ({ setList, list, _total, _setTotal }) => {
    const { user,loading, setLoading, theme } = useContext(AuthContext);

    useEffect(() => {
        setList([]);
        setLoading(true);
        getAllProduct(user.id).then((products) => {
            products.forEach((product) => {
                let data = { id: product.key, name: product.val().name, price: product.val().price, quantity: 0 }
                setList(oldArray => [...oldArray, data]);                
            });
           
        }).catch((error) => { })
        .finally(()=>{setLoading(false);})

    }, [])
   if(loading) {
    return (
         
        <ActiviteIndicatorCenter size={30} color={theme.primaryColor} />)
   }
    return (
        <Container>
            <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<CardItens totalItem={_total} sumTotal={(item)=>_setTotal(item)} item={item} />)}
            />


        </Container>
        
        );
}

export default FlatListProducts;