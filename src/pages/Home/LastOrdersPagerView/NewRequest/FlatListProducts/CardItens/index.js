import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';

import { Card, Container, InputQuantity, ItemName, ItemPrice } from './styles';

const CardItens = ({item}) => {
    const [quantity, setQuantity] = useState('');

    useEffect(() => {       
        item.quantity = quantity;

        // console.log(item);
    },[quantity])
    return (

        <Container>
            <Card>
            <ItemName>{item&& item.name}</ItemName>
            <ItemPrice>{item && parseFloat(item.price).toFixed(2) +' $'}</ItemPrice>
            </Card>
            <InputQuantity>
            <TextInput
            value={quantity}
            placeholder='0'           
            keyboardType='numeric'
            onChangeText={setQuantity}
            />
            </InputQuantity>
            
            
        </Container>
    );
}

export default CardItens;