import React from 'react';
import { View } from 'react-native';

import { Container, Client, Number, Date, ViewRow } from './styles';

const Card = ({data}) => {
      return (
      <Container>
          <Client>{data && "cliente: " + data.clientName}</Client>
          <ViewRow>
              <Number>{data & 'number' + data.id}</Number>
              <Date>{data && "data: " + data.date}</Date>
          </ViewRow>

      </Container>
  );
}

export default Card;