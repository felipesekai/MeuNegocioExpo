import styled from 'styled-components/native';

export const Container = styled.View`
margin: 10px 35px;
min-width: 180px;
padding: 12px;
background-color:${props=>props.theme.primaryColor};
border-radius: ${props => props.theme.radius || 8}px;
justify-content: center;
align-items: center;
`;
export const Title = styled.Text`
font-size:16px;
font-weight: bold;
color:${props=>props.theme.textOnPrimary || props.theme.backgroundColor}
`;
