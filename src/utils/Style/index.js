import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

export const Background = styled.SafeAreaView`
    flex: 1;
    background-color: ${props => props.theme.backgroundColor};
    
`;
export const Container = styled.View``;

export const styles = StyleSheet.create({
    TInputMasked: {
        padding: 10,
        width: '100%',
        height: 50,
        borderWidth: 2,
        borderRadius: 7,
        marginBottom: 5,
        borderColor: '#f4a460'
    },
});

export const ModalBackgroud = styled.KeyboardAvoidingView`
width: 100%;
position: absolute;
bottom: 0;
background-color: ${props => props.theme.surfaceColor || '#fff'};
border-top-left-radius: ${props => props.theme.radius || 10}px;
border-top-right-radius: ${props => props.theme.radius || 10}px;
elevation: 5;
box-shadow: 3px 0 3px ${Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.28)' : "#000"} ;
`;
export const ModalContainer = styled.KeyboardAvoidingView`
padding: 10px;
padding-left: 20px;
padding-right: 20px;
justify-content: flex-start;
align-items: center;
margin-bottom:50px;
`;

export const Input = styled.TextInput`
padding: 10px;
width: 100%;
height:50px;
border-width: 2px;
 border-radius: ${props => props.theme.radius || 8}px;
 border-color: ${props => props.erro ? props.theme.danger || 'red' : props.theme.borderColor || props.theme.primaryColor};
 color: ${props => props.theme.textColor};
 background-color: ${props => props.theme.surfaceColor || '#fff'};
`;

export const ViewInput = styled.View`
justify-content: flex-start;
width: 90%;
margin-bottom: 5px;
`;

export const TitleInputs = styled.Text`
font-size: 18px;
color:${props => props.theme.textColor};
`;

export const HeaderModal = styled.View`
width: 100%;
margin-bottom: 10px;
height: 40px;

`;
