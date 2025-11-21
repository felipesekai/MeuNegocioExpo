import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Card,
  Container,
  InputQuantity,
  ItemName,
  ItemPrice,
  Counter,
  CounterButton,
  CounterText,
  CounterValue,
} from './styles';

const CardItens = ({ item, sumTotal }) => {
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const previousQuantity = useRef(item.quantity || 0);

  useEffect(() => {
    const delta = quantity - previousQuantity.current;
    if (delta !== 0) {
      item.quantity = quantity;
      sumTotal((prev) => prev + delta * item.price);
      previousQuantity.current = quantity;
    }
  }, [quantity, sumTotal, item]);

  const decrement = useCallback(() => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  }, []);

  const increment = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  return (
    <Container>
      <Card>
        <ItemName>{item && item.name}</ItemName>
        <ItemPrice>{item && parseFloat(item.price).toFixed(2) + ' $'}</ItemPrice>
      </Card>
      <InputQuantity>
        <Counter>
          <CounterButton onPress={decrement} accessibilityLabel="Diminuir quantidade">
            <CounterText>-</CounterText>
          </CounterButton>
          <CounterValue>{quantity}</CounterValue>
          <CounterButton onPress={increment} accessibilityLabel="Aumentar quantidade">
            <CounterText>+</CounterText>
          </CounterButton>
        </Counter>
      </InputQuantity>
    </Container>
  );
};

export default CardItens;
