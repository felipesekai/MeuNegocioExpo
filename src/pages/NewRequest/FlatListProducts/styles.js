import styled from 'styled-components/native';

export const Container = styled.View`
flex: ${Platform.OS === 'ios' ? 1 : 'none'};
height: ${Platform.OS === 'ios' ? 0 : '70%'};
margin-bottom: 2px;
`;