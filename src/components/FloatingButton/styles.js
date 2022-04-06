import styled from 'styled-components/native';

export const FAB = styled.TouchableOpacity`
        align-items:center;
        justify-content: center;
        padding: 10px;
        border-radius: 25px;
        box-shadow: 1px 5px 1px ${Platform.OS === 'ios' ? 'rgba(0,0,0,0.28)': '#000'};
        elevation: 3;
        background-color: ${props=>props.theme.primaryColor};
        position: absolute;
        bottom: 20px;
        right: 20px;

`;