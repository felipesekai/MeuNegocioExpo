import React, {useEffect, useState} from 'react';
import { View, FlatList } from 'react-native';
import { getDatabase, onValue, ref } from 'firebase/database';
import CardProducts from './CardProducts';

const FlatListProducts = ({userId}) => {

  const [productlist, setProductList] = useState([]);

  useEffect(()=>{
    try {
        const db = getDatabase();
        const productsRef = ref(db, 'users/'+userId+'/products')
        onValue(productsRef, (snapshot)=>{
            setProductList([]);
                snapshot.forEach((product)=>{
                    const data = {
                        key : product.key,
                        name : product.val().name,
                        quantity : product.val().quantity,
                        price : product.val().price
                    }
                        
                    setProductList(oldArray=>[...oldArray, data]);
                    
                });
            
        })
    } catch (error) {
        console.log(error)
    }
  
},[]);

  return <FlatList
        showsVerticalScrollIndicator={false}
        data={productlist}
        keyExtractor={item =>item.key.toString()}
        renderItem={({item}) =>  (<CardProducts itens={item} />)}
        />
}

export default FlatListProducts;