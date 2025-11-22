import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

export const Card = styled.TouchableOpacity`
    flex-direction: row;
    padding: 12px;    
    box-shadow: 1px 3px 3px ${Platform.OS === 'ios' ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.12)'};
    elevation: 2;
    width: 100%;
    background-color: ${props => props.theme.surfaceColor || props.theme.cardColor};
    align-items: center;
    border-radius: ${props => props.theme.radius || 12}px;
    border-width: 1px;
    border-color: ${props => props.theme.borderColor || 'transparent'};
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
    text-transform: capitalize;
    color: ${props => props.theme.textColor};
`;

const styles = StyleSheet.create({
    shadow: {
        elevation: 3,

    }
})
