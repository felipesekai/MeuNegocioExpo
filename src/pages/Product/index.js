import { Button, Modal as ModalNB } from 'native-base';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, Modal } from 'react-native';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import Header from '../../components/Header';
import { AuthContext } from '../../contexts/auth';
import { deleteProduct, insertProduct, updateProduct } from '../../database';
import { Background } from '../../utils/Style';
import FlatListProducts from './FlatListProducts';
import ModalEditProduct from './ModalEditProduct';
import NewProduct from './NewProduct';
import { Container, HeaderList, TextHL } from './styles';


const Product = () => {
    const [modalNewVisibility, setModalNewVisibility] = useState(false);
    const [modalEditVisibility, setModalEditVisibility] = useState(false);
    const [productEdit, setProductEdit] = useState({});
    const { user, loading, setLoading, theme } = useContext(AuthContext);

    function addNewProduct(product) {
        setLoading(true);
        insertProduct(user.id, product)
            .then(() => {
                alert('Produto cadastrado!');
                setModalNewVisibility(false);
            })
            .catch((error) => {
                alert('erro ao cadastrar Produto!')
            })
            .finally(() => {
                setLoading(false);
            })
    }
    function handlerEditProduct(product) {
        setLoading(true);

        updateProduct(user.id, product)
            .then(() => {
                // alert('Alteração Feita!')
                setModalEditVisibility(false);

            })
            .catch((error) => {
                Alert.alert('Ops...', 'erro ao Alterar Produto!')

            })
            .finally(() => {
                setLoading(false);
            })
    }
    function handlerDeleteProduct(product) {
        setLoading(true);

        deleteProduct(user.id, product)
            .then(() => {
                Alert.alert('Produto excluido!', '');
            })
            .catch((error) => {
                Alert.alert('Ops...', 'erro ao deletar Produto!')

            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (

        <Background>
            <Header />
            <HeaderList>
                <TextHL>Nome</TextHL>
                <TextHL>Quantidade</TextHL>
                <TextHL>Preço</TextHL>
            </HeaderList>
            <Container>
                {loading ? <ActivityIndicator size={30} color={theme.primaryColor} />
                    : <FlatListProducts userId={user.id}
                        openEdit={setModalEditVisibility}
                        itemEdit={setProductEdit}
                        handlerDelete={handlerDeleteProduct} />}
            </Container>

            <FloatingButton onClick={() => setModalNewVisibility(true)} icon={Icons("addchart", 30, 'white')} />

            {/* {modalNewVisibility &&
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalNewVisibility}
                    onRequestClose={() => setModalNewVisibility(false)}
                >
                    <NewProduct onClose={(bol) => setModalNewVisibility(bol)} setNewProduct={(item) => addNewProduct(item)} />
                </Modal>
            } */}

            <NewProduct visible={modalNewVisibility} onClose={(bol) => setModalNewVisibility(bol)} setNewProduct={(item) => addNewProduct(item)} />

            <ModalEditProduct visible={modalEditVisibility} setVisble={(bol) => setModalEditVisibility(bol)} initialValue={productEdit} submitEdit={handlerEditProduct} />


        </Background>

    );
}

export default Product;