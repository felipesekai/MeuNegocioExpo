import styled from 'styled-components/native';

export const Container = styled.View`
flex: 1;
`;

export const HeaderList = styled.SafeAreaView`
    flex-direction: row;
    margin: 1px 10px;
    justify-content: space-between;
    border-radius: 5px;

`;


export const TextHL = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${props=>props.theme.textColor};
`;