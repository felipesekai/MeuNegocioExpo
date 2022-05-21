import styled from 'styled-components/native';


export const Header = styled.View`
flex-direction: row;
margin: 15px 10px;
align-items: center;
`;
export const HeaderBackground = styled.View`
background-color: ${props=> props.theme.primaryColor};
box-shadow: 1px 1px 1px ${Platform.OS === 'ios' ? 'rgba(0,0,0,0.18)' : '#000'};
elevation: 2;
`;
export const Container = styled.View`
flex: 1;
`;
export const ButtonView = styled.View`
align-items: center;

`;
export const ContainerClient = styled.View`
flex-direction: row;
justify-content:space-between;
margin: 5px 10px;
`;
export const Title = styled.Text`
color: ${props=>props.theme.backgroundColor};
margin: 2px 15px;
font-size: 18px;
font-weight: bold;

`;