import React, {useEffect} from 'react';
import { View } from 'react-native';

import { Card, Container,Textp, Header } from './styles';

const CardProducts = ({itens, editItem}) => {
  
  return (
    
      <Container>        
          <Card onPress={()=>editItem(itens)}>
            <View style={{flex: 1}}>
            <Textp>{itens && itens.name}</Textp>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Textp>{itens && itens.quantity}</Textp>
            </View>
            <View style={{flex: 1, ustifyContent: 'center', alignItems: 'flex-end'}}>
            <Textp>{itens && parseFloat(itens.price).toFixed(2)+" R$"}</Textp>
            </View>
          </Card>
      </Container>
  );
}

export default CardProducts;