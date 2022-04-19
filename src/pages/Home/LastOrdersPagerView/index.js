import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import FloatingButton, { Icons } from '../../../components/FloatingButton';

import { Background } from '../../../utils/Style';
import NewRequest from '../../NewRequest';

const LastOrders = () => {
  const [NewRequestStatus, setNewRequestStatus] = useState(false);
  if (NewRequestStatus) {
    return (
            <NewRequest onClose={() => setNewRequestStatus(false)} />
          )

  }

  return (
    <Background>
      <View>
        <Text>Last Order</Text>

      </View>
      <FloatingButton icon={Icons('add', 30, 'white')} onClick={() => setNewRequestStatus(true)} />
    </Background>);
}

export default LastOrders;