import React from 'react';
import { View } from 'react-native';

import { Container, Client, Number, Date, ViewRow } from './styles';

const Card = ({data}) => {
      return (
      <Container>
          <Client>{data && "Cliente: " + data.clientName}</Client>
          <ViewRow>
              <Number>{data && 'Total: ' + data.total.toFixed(2)}</Number>
              <Date>{data && "Data: " + data.date}</Date>
          </ViewRow>

      </Container>
  );
}

export default Card;