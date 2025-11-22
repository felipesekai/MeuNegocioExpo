import React from 'react';
import { View, FlatList } from 'react-native';
import CardProducts from './CardProducts';
import ListEmpty from '../../../components/ListEmpty';

const FlatListProducts = ({ products, openEdit, itemEdit, handlerDelete }) => {
  function handlerEdit(item) {
    openEdit(true);
    itemEdit({ ...item, id: item._id });
  }
  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<ListEmpty message="Nenhum produto cadastrado." />}
        renderItem={({ item }) => <CardProducts editItem={handlerEdit} itens={item} itemDelete={handlerDelete} />}
      />
    </View>
  );
};

export default FlatListProducts;
