import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.TouchableOpacity`
background-color: ${props => props.theme.backgroundColor};
margin: 3px 5px;
padding: 10px;
box-shadow: 1px 2px 1px ${Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.28)' : "#000"};
elevation:3;
border-left-width: 2px;
border-color: ${props => props.theme.primaryColor};
border-radius: ${props => props.theme.radius || 8}px;

`;

export const ViewRow = styled.View`
flex-direction: row;
justify-content: space-between;
`;

export const Client = styled.Text`
color: ${props => props.theme.textColor};
`;

export const Number = styled.Text`
color: ${props => props.theme.textColor};
`;
export const Date = styled.Text`
font-weight: bold;
color: ${props => props.theme.textMuted || props.theme.textColor};
`;

export const Status = styled.Text`
margin-top: 4px;
color: ${props => (props.children === 'Pago' ? props.theme.success : props.theme.danger || '#c0392b')};
font-weight: 700;
`;
