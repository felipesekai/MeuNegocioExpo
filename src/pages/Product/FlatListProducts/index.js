import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import CardProducts from './CardProducts';
import ListEmpty from '../../../components/ListEmpty';

const ListWrapper = styled.View`
  flex: 1;
  padding: 8px 12px;
`;

const FlatListProducts = ({ products, openEdit, itemEdit, handlerDelete, handlerStock, handlerHistory }) => {
  const handlerEdit = (item) => {
    openEdit(true);
    itemEdit({ ...item, id: item._id });
  };

  return (
    <ListWrapper>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<ListEmpty message="Nenhum produto cadastrado." />}
        renderItem={({ item }) => (
          <CardProducts editItem={handlerEdit} itens={item} itemDelete={handlerDelete} onAddStock={handlerStock} onHistory={handlerHistory} />
        )}
        contentContainerStyle={{ paddingBottom: 12 }}
      />
    </ListWrapper>
  );
};

export default FlatListProducts;
