import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
flex-direction: row;
margin: 1px 5px;
gap: 10px;

`;

export const InputQuantity = styled.View`
justify-content: center;
align-items: center;
/* flex: 1; */

`;

export const Counter = styled.View`
flex-direction: row;
align-items: center;
background-color: ${props => props.theme.primaryColor};
border-radius: 8px;
overflow: hidden;
height: 40px;
`;

export const CounterButton = styled.TouchableOpacity`
padding: 8px 12px;
background-color: transparent;
align-items: center;
justify-content: center;
`;

export const CounterText = styled.Text`
color: ${props => props.theme.textOnPrimary || '#fff'};
font-size: 16px;
font-weight: 600;
`;

export const CounterValue = styled.Text`
padding: 7px 14px;
background-color: ${props => props.theme.backgroundColor};
color: ${props => props.theme.textColor};
font-size: 16px;
font-weight: 700;
`;
export const Card = styled.View`
flex-direction: row;
align-items: center;
justify-content: space-between;
background-color: ${props => props.theme.backgroundColor};
box-shadow: 0 1px 1px ${Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.28)' : '#000'};
elevation:3;
flex: 2;
height: 40px;
margin: 3px 2px;
border-radius: 5px;
`;
export const CardBackground = styled.View`
background-color: ${props => props.theme.primaryColor};
`;
export const ItemName = styled.Text`
color: ${props => props.theme.textColor};
margin: 5px 5px;
`;
export const ItemPrice = styled.Text`
color: ${props => props.theme.textColor};
margin: 5px 5px;
`;
