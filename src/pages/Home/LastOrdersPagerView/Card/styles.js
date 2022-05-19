import styled from 'styled-components/native';

export const Container = styled.View`
background-color: ${props=> props.theme.backgroundColor};
margin: 3px 5px;
padding: 10px;
box-shadow: 1px 2px 1px ${Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.28)': "#000"};
elevation:3;
border-left-width: 2px;
border-color: ${props=> props.theme.primaryColor};

`;

export const ViewRow = styled.View`
flex-direction: row;
justify-content: space-between;
`;

export const Client = styled.Text`
`;

export const Number = styled.Text`

`;
export const Date = styled.Text`
font-weight: bold;
`;