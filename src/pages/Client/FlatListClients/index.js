import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, ItemListText } from '../styles';
import { alertMenssage } from '../../../utils/Strings';
import ListEmpty from '../../../components/ListEmpty';
import { confirmDialog } from '../../../utils/dialogs';

const FlatListClients = ({ clients, handlerEdit, handleDelete }) => {
  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={clients}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<ListEmpty message="Nenhum cliente cadastrado." />}
        renderItem={({ item }) => (
          <Card
            onPress={() => handlerEdit({ ...item, id: item._id })}
            onLongPress={() => {
              confirmDialog({
                title: alertMenssage.deleteTitle,
                message: alertMenssage.deleteClientDescription,
                onConfirm: () => handleDelete(item._id),
              });
            }}
          >
            <ItemListText>{item.name}</ItemListText>
          </Card>
        )}
      />
    </View>
  );
};

export default FlatListClients;
