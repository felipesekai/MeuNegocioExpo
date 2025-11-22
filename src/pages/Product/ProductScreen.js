import React, { useState, useContext } from 'react';
import { Modal, Alert } from 'react-native';
import Header from '../../components/Header';
import { Container, HeaderList, TextHL } from './styles';
import { Background } from '../../utils/Style';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import FlatListProducts from './FlatListProducts';
import NewProduct from './NewProduct';
import { saveProduct, deleteProduct } from '../../database';
import { AuthContext } from '../../contexts/auth';
import EditProduct from './EditProduct';
import { useProducts } from '../../hooks/useProducts';

const ProductScreen = () => {
    const [modalNewVisibility,setModalNewVisibility] = useState(false);
    const [modalEditVisibility,setModalEditVisibility] = useState(false);
    const [productEdit,setProductEdit] = useState({});
    const { setLoading, theme} = useContext(AuthContext);
    const { products, refresh } = useProducts();

    async function addNewProduct(product) {
        setLoading(true);
        try {
            await saveProduct({ name: product.name, description: product.description, price: parseFloat(product.price) });
            alert('Produto cadastrado!');
            setModalNewVisibility(false);
            refresh();
        } catch (error) {
            alert('Erro ao cadastrar Produto!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    } 

    async function handlerEditProduct(product) {
        setLoading(true);
        try {
            await saveProduct({ _id: product.id, name: product.name, description: product.description, price: parseFloat(product.price) });
            alert('Produto alterado!');
            setModalEditVisibility(false);
            refresh();
        } catch (error) {
            Alert.alert('Ops...','Erro ao Alterar Produto!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }   

    async function handlerDeleteProduct(product) {
        setLoading(true);
        try {
            await deleteProduct(product.id);
            Alert.alert('Produto excluido!','');
            refresh();
        } catch (error) {
            Alert.alert('Ops...','Erro ao deletar Produto!');
            console.log(error);
        } finally {
            setLoading(false);
        }
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
                <FlatListProducts
                    products={products}
                    openEdit={setModalEditVisibility} 
                    itemEdit={setProductEdit} 
                    handlerDelete={handlerDeleteProduct} />
            </Container>

            <FloatingButton onClick={() => setModalNewVisibility(true)} icon={Icons("addchart", 30, 'white')} />

            {modalNewVisibility &&
            <Modal
            transparent={true}
            animationType="slide"
            visible={modalNewVisibility}
            onRequestClose={()=>setModalNewVisibility(false)}
            >
                <NewProduct onClose={(bol)=>setModalNewVisibility(bol)} setNewProduct={(item)=>addNewProduct(item)} />
            </Modal>
            } 
            {modalEditVisibility &&
            <Modal
            transparent={true}
            animationType="slide"
            visible={modalEditVisibility}
            onRequestClose={()=>setModalEditVisibility(false)}
            >
                <EditProduct onClose={(bol)=>setModalEditVisibility(bol)} 
                initialValue={productEdit}
                submitEdit={handlerEditProduct} />
            </Modal>
            }
        </Background>

    );
}

export default ProductScreen;
