import React, {useState} from 'react';
import { Modal } from 'react-native';
import Header from '../../components/Header';
import { Container, HeaderList, TextHL } from './styles';
import { Background } from '../../utils/Style';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import CardProducts from '../../components/CardProducts';
import List from '../../components/List';
import NewProduct from './NewProduct';


const Product = () => {
    const [modalVisibility,setModalVisibility] = useState(false);
    const lista = [{
            key: '1',
            name: 'caja',
            price: 10,
            quantity: 500
        },
        {
            key: '2',
            name: 'caju',
            price: 9,
            quantity: 500
        },
        {
            key: '3',
            name: 'manga',
            price: 8,
            quantity: 500
        },
        {
            key: '4',
            name: 'goiaba',
            price: 8,
            quantity: 500
        },
        {
            key: '5',
            name: 'conserto de televissao smart',
            price: 8,
            quantity: 500
        },
        {
            key: '6',
            name: 'montagem de guarda roupas grande com 6 portas ou 2 a 3 portas de correr',
            price: 8,
            quantity: 500
        },
    ]
    return (

        <Background>
            <Header />
            <HeaderList>
                <TextHL>Nome</TextHL>
                <TextHL>Quantidade</TextHL>
                <TextHL>Preço</TextHL>
            </HeaderList>
            <List
                data={lista}
                renderedIem={(item) => (<CardProducts itens={item} />)}
            />

            <FloatingButton onClick={() => setModalVisibility(true)} icon={Icons("addchart", 30, 'white')} />

            {modalVisibility &&
            <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisibility}
            onRequestClose={()=>setModalVisibility(false)}
            >
                <NewProduct onClose={(bol)=>setModalVisibility(bol)} />
            </Modal>
            }
        </Background>

    );
}

export default Product;