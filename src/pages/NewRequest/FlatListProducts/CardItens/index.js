import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import NumericInput from 'react-native-numeric-input'
import { Card, Container, InputQuantity, ItemName, ItemPrice } from './styles';
import { useTheme } from 'styled-components';
const CardItens = ({ item, sumTotal, totalItem }) => {
    const [quantity, setQuantity] = useState(0);

    const theme = useTheme();

    useEffect(() => {
        if (item.quantity > quantity && quantity !== 0) {
            item.quantity = quantity;
            sumTotal(totalItem - (item.quantity * item.price));
        } else if (quantity === 0) {
            sumTotal(totalItem - (item.quantity * item.price));
            item.quantity = 0;
        }
        else {
            item.quantity = quantity;
            sumTotal(totalItem + (item.quantity * item.price));
        }

    }, [quantity])
    return (

        <Container>
            <Card>
                <ItemName>{item && item.name}</ItemName>
                <ItemPrice>{item && parseFloat(item.price).toFixed(2) + ' $'}</ItemPrice>
            </Card>
            <InputQuantity>
                <NumericInput
                    borderColor={theme.primaryColor}
                    leftButtonBackgroundColor={theme.primaryColor}
                    rightButtonBackgroundColor={theme.primaryColor}
                    rounded={true}  
                    totalWidth={102}
                    containerStyle={{borderWidth:2}} 
                    style={{ flex: 1,}}
                    value={quantity}
                    minValue={0}
                    onChange={setQuantity} />
            </InputQuantity>


        </Container>
    );
}

export default CardItens;