import styled from 'styled-components/native';

export const Container = styled.View`
margin: 10px 35px;
width:175px;
padding: 10px;
background-color:${props=>props.theme.primaryColor};
border-radius: 5px;
justify-content: center;
align-items: center;
`;
export const Title = styled.Text`
font-size:16px;
font-weight: bold;
color:${props=>props.theme.backgroundColor}
`;
