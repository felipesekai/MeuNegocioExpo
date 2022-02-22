import styled from 'styled-components/native';

export const Card = styled.View`
    flex-direction: row;
    padding: 5px;
    elevation: 3;
    box-shadow: 0px 3px 1px rgba(0,0,0,0.28);
    width: 100%;
    background-color: #FAFAD2;
    align-items: center;
    border-radius: 5px;
`;

export const Container = styled.View`
padding: 4px;
padding-left: 10px;
padding-right: 10px;
`;

export const Header = styled(Card)`
    elevation: 0;
    background-color: none;

`;
export const Textp = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #000;
`;