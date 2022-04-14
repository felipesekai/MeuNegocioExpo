import styled from 'styled-components/native';

export const Container = styled.View`
    background-color: ${props=> Platform.OS === 'ios' ? props.theme.backgroundColor : 'transparent'};
    position: absolute;
    bottom: 0;
    flex: 1;
    width: 100%;
    height: 50%;
    `;

export const Header = styled.View`
    background-color: ${props=> props.theme.backgroundColor};
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.18);
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;
    padding: 16px;
    border-bottom-width: 2px;
    border-top-width: 2px;
    border-color: ${props=> props.theme.primaryColor};
`;