import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

import { Container, ViewFText, LabelText, LabelTextCount, ViewFTextCount } from './styles';

const LayoutIconTopTab = ({title,nameIcon, colors}) => {
  return (
        <Container>
            <ViewFTextCount>
            <LabelTextCount cor={colors}>30</LabelTextCount>
            </ViewFTextCount>
            <Icon name={nameIcon} size={24} color={colors}/>
            <ViewFText>
                <LabelText cor={colors}>{title}</LabelText>
                
            </ViewFText>
        </Container>
  );
}

export default LayoutIconTopTab;