import React,{useContext} from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Background } from '../../../utils/Style';
import FlatListClients from './FlatListClients';
import { Icons } from '../../../components/FloatingButton';
import { Container, Header } from './styles';
import { AuthContext } from '../../../contexts/auth';

const ModalClientSelector = ({onClose, clientSelect}) => {

    const {theme} = useContext(AuthContext);

    function handleSelect(client){
        alert('Cliente seleccionado '+ client.name);
        clientSelect(client);
    }

    return (<Modal animationType='slide' onRequestClose={() =>onClose(false)}>
        <Background>
            <Header>
                <TouchableOpacity onPress={() => onClose(false)}>
                    {Icons('arrow-back', 30, theme.primaryColor)}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onClose(false)}>
                    {Icons('done', 30, theme.primaryColor)}
                </TouchableOpacity>

            </Header>
            <Container>
                <FlatListClients handlerSelect={handleSelect} />
            </Container>
        </Background>
    </Modal>);
}

export default ModalClientSelector;