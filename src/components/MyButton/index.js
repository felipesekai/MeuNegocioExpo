import React,{ useContext} from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { Container, Title } from './styles';
import { useTheme } from 'styled-components';

const MyButton = ({title, onClick}) => {
    const {loading} = useContext(AuthContext);
    const theme = useTheme();
    return (

        <TouchableOpacity onPress={onClick}>
            <Container>{loading? <ActivityIndicator color={theme.backgroundColor} size={20} />:
                <Title>{title}</Title>
                }
            </Container>
        </TouchableOpacity>
    );
}

export default MyButton;