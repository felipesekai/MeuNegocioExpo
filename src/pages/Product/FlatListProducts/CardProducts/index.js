import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { alertMenssage } from '../../../../utils/Strings';
import { Card, Container, Textp, Header } from './styles';

const CardProducts = ({itens: item, editItem, itemDelete }) => {

  return (

    <Container>
      <Card onPress={() => editItem(item)} onLongPress={() =>
        Alert.alert(alertMenssage.deleteTitle, alertMenssage.deleteProdutoDescription,
          [
            {
              text: "sim",
              onPress: () => itemDelete(item),

            },
            {
              text: "NÃO",
              style: "cancel",
            },

          ])
      }>
        <View style={{ flex: 1 }}>
          <Textp>{item && item.name}</Textp>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Textp>{item && item.quantity}</Textp>
        </View>
        <View style={{ flex: 1, ustifyContent: 'center', alignItems: 'flex-end' }}>
          <Textp>{item && parseFloat(item.price).toFixed(2) + " R$"}</Textp>
        </View>
      </Card>
    </Container>
  );
}

export default CardProducts;