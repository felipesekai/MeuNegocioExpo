import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { alertMenssage } from '../../../../utils/Strings';
import { Card, Container, Textp, Badge } from './styles';
import { confirmDialog } from '../../../../utils/dialogs';

const CardProducts = ({ itens: item, editItem, itemDelete, onAddStock, onHistory }) => {
  const getBadgeColor = (qty) => {
    if (qty < 5) return '#ff4444'; // Red
    if (qty < 10) return '#ffbb33'; // Yellow
    return '#00C851'; // Green
  };

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
        <View style={{ flex: 2 }}>
          <Textp>{item?.name}</Textp>
          <Text style={{ color: '#777', fontSize: 12 }}>{item?.description}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Textp>{item ? `R$ ${parseFloat(item.price).toFixed(2)}` : ''}</Textp>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Badge style={{ backgroundColor: getBadgeColor(item?.quantity ?? 0) }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>{item?.quantity ?? 0}</Text>
          </Badge>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <TouchableOpacity
              onPress={() => onHistory(item)}
              style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#eee', marginRight: 6 }}
            >
              <Text style={{ color: '#333', fontWeight: '700', fontSize: 12 }}>Hist.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onAddStock(item)}
              style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#007aff' }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>+ est.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </Container>
  );
};

export default CardProducts;
