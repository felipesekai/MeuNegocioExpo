import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';

import { Card, Container, InputQuantity, ItemName, ItemPrice } from './styles';

const CardItens = ({ item, sumTotal, totalItem }) => {
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        if (item.quantity > quantity && quantity !=='') {
            item.quantity = quantity;
            sumTotal(totalItem - (item.quantity * item.price));
        }else if(quantity ===''){
            sumTotal(totalItem - (item.quantity * item.price));
                item.quantity = 0;
        }
        
        else {
            item.quantity = quantity;
            sumTotal(totalItem + (item.quantity * item.price));
        }

        // console.log(item);
    }, [quantity])
    return (

        <Container>
            <Card>
                <ItemName>{item && item.name}</ItemName>
                <ItemPrice>{item && parseFloat(item.price).toFixed(2) + ' $'}</ItemPrice>
            </Card>
            <InputQuantity>
                <TextInput
                    style={{flex: 1}}
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