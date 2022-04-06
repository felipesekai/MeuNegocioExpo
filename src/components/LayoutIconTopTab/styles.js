import styled from 'styled-components/native';

export const Container = styled.View`
height:50px;
width:70px ;
padding: 10px;
border-radius: 15px ;
justify-content: center;
align-items: center;
`;

export const ViewFText = styled.View`
justify-content: center;
align-items: center;
`;

export const LabelText = styled.Text`
font-size: 9px;
color:${props=>props.cor} ;
text-align: center;
`;

export const ViewFTextCount = styled.View`
background-color: #ff0000;
border-radius: 15px;
margin-left: 5px;
padding: 2px; ;
position: absolute; top: 0; right: 0;
`;
export const LabelTextCount = styled.Text`
font-size: 9px;
color:${props=>props.cor} ;


`