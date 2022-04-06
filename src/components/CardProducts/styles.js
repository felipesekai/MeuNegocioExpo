import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const Card = styled.TouchableOpacity`
    flex-direction: row;
    padding: 10px;    
    box-shadow: 0px 3px 1px ${Platform.OS === 'ios' ? 'rgba(0,0,0,0.28)': '#000' };
    elevation: 3;
    width: 100%;
    background-color: ${props=> props.theme.cardColor};
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

const styles = StyleSheet.create({
    shadow:{
        elevation: 3,

    }
})