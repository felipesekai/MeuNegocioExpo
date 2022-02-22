import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const Background = styled.SafeAreaView`
    flex: 1;
    background-color: #F4A460;
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
    },
});

export const ModalBackgroud = styled.KeyboardAvoidingView`
width: 100%;
padding-bottom: 50px;
position: absolute;
bottom: 0;
background-color: #fff;
border-top-left-radius: 10px;
border-top-right-radius: 10px;
elevation: 5;
box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.40);
`;
export const ModalContainer = styled.KeyboardAvoidingView`
padding: 10px;
padding-left: 20px;
padding-right: 20px;
justify-content: flex-start;
align-items: center;
margin-bottom:20px;
`;

export const Input = styled.TextInput`
padding: 10px;
width: 100%;
height:50px;
border-width: 2px;
border-radius: 7px;
margin-bottom: 5px;
/* border-color: #D2B48C; */

/* background-color: #D2B48C; */
`;

export const ViewInput = styled.View`
/* margin-top: 10px; */
/* margin-bottom:10px; */
justify-content: flex-start;
width: 90%;
`;

export const TextOverInputs = styled.Text`
font-size: 18px;
font-weight: bold;
color: #000;
`;

export const HeaderModal = styled.View`
width: 100%;
margin-bottom: 10px;
height: 40px;

`;