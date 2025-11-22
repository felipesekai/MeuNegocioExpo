import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Card,
  Container,
  ItemName,
  ItemPrice,
} from './styles';
import Counter from '../../../../components/Counter';

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
      <Counter value={quantity} onChange={setQuantity} min={0} accessibilityLabel="Quantidade" />
    </Container>
  );
};

export default CardItens;
