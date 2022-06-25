import styled from 'styled-components/native';

export const Container = styled.View`
flex: 1;
justify-content: center;
width: 100%;
height: 100%;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
`;
export const Card = styled.TouchableOpacity`
padding: 10px;
background-color: ${props=> props.theme.cardColor};
box-shadow: 0px 3px 1px ${Platform.OS === 'ios' ? 'rgba(0,0,0,0.28)': '#000' };
elevation: 3;
margin: 3px 10px;
border-radius: 1px;
`;

export const ItemListText = styled.Text`
font-size: 18px;
font-weight: bold;
color: ${props=> props.theme.textColor};
`;







