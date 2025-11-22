import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { alertMenssage } from '../../../utils/Strings';
import ListEmpty from '../../../components/ListEmpty';
import { confirmDialog } from '../../../utils/dialogs';

const ListWrapper = styled.View`
  flex: 1;
  padding: 8px 12px;
`;

const ClientCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.surfaceColor || '#fff'};
  border-radius: ${(props) => props.theme.radius || 12}px;
  padding: 12px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${(props) => props.theme.borderColor || '#eee'};
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
  elevation: 2;
`;

const Avatar = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.cardColor || '#f5f5f5'};
  margin-right: 12px;
`;

const AvatarText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 800;
  font-size: 16px;
`;

const Info = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 700;
`;

const Phone = styled.Text`
  color: ${(props) => props.theme.textMuted || '#666'};
  font-size: 13px;
  margin-top: 2px;
`;

const FlatListClients = ({ clients, handlerEdit, handleDelete }) => {
  const renderItem = ({ item }) => {
    const initials = (item.name || 'C').slice(0, 2).toUpperCase();
    return (
      <ClientCard
        onPress={() => handlerEdit({ ...item, id: item._id })}
        onLongPress={() => {
          confirmDialog({
            title: alertMenssage.deleteTitle,
            message: alertMenssage.deleteClientDescription,
            onConfirm: () => handleDelete(item._id),
          });
        }}
      >
        <Avatar>
          <AvatarText>{initials}</AvatarText>
        </Avatar>
        <Info>
          <Name>{item.name}</Name>
          <Phone>{item.phone || 'Sem telefone'}</Phone>
        </Info>
      </ClientCard>
    );
  };

  return (
    <ListWrapper>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={clients}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<ListEmpty message="Nenhum cliente cadastrado." />}
        renderItem={renderItem}
      />
    </ListWrapper>
  );
};

export default FlatListClients;
