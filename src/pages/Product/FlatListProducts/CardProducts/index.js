import React from 'react';
import { View } from 'react-native';
import { alertMenssage } from '../../../../utils/Strings';
import { Card, Container, Textp } from './styles';
import { confirmDialog } from '../../../../utils/dialogs';

const CardProducts = ({ itens: item, editItem, itemDelete }) => {
  return (
    <Container>
      <Card
        onPress={() => editItem(item)}
        onLongPress={() =>
          confirmDialog({
            title: alertMenssage.deleteTitle,
            message: alertMenssage.deleteProdutoDescription,
            onConfirm: () => itemDelete({ id: item._id }),
          })
        }
      >
        <View style={{ flex: 1 }}>
          <Textp>{item && item.name}</Textp>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Textp>{item && item.quantity}</Textp>
        </View>
        <View style={{ flex: 1, ustifyContent: 'center', alignItems: 'flex-end' }}>
          <Textp>{item && parseFloat(item.price).toFixed(2) + ' R$'}</Textp>
        </View>
      </Card>
    </Container>
  );
};

export default CardProducts;
