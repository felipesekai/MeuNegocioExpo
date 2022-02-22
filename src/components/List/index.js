import React from 'react';
import { View, FlatList } from 'react-native';

// import { Container } from './styles';

const List = ({data, renderedIem}) => {
  return <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={item =>item.key.toString()}
        renderItem={({item}) => renderedIem(item)}
        />
}

export default List;