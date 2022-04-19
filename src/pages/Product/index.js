import React, {useState, useContext, useEffect, useCallback} from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import Header from '../../components/Header';
import { Container, HeaderList, TextHL } from './styles';
import { Background } from '../../utils/Style';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import FlatListProducts from './FlatListProducts';
import NewProduct from './NewProduct';
import { insertProduct, updateProduct } from '../../database';
import { AuthContext } from '../../contexts/auth';
import EditProduct from './EditProduct';


const Product = () => {
    const [modalNewVisibility,setModalNewVisibility] = useState(false);
    const [modalEditVisibility,setModalEditVisibility] = useState(false);
    const [productEdit,setProductEdit] = useState({});
    const {user, loading, setLoading, theme} = useContext(AuthContext);
 
    function addNewProduct(product) {
        setLoading(true);
        insertProduct(user.id, product)
        .then(()=> {
            alert('Produto cadastrado!');
            setModalNewVisibility(false);
        })
        .catch((error)=>{
            alert('erro ao cadastrar Produto!')

        })
        .finally(()=>{
            setLoading(false);
        })
    } 
    function handlerEditProduct(product) {
        setLoading(true);
        
        updateProduct(user.id, product)
        .then(()=> {
            // alert('Alteração Feita!')
            setModalEditVisibility(false);

        })
        .catch((error)=>{
            alert('erro ao Alterar Produto!')

        })
        .finally(()=>{
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
            : <FlatListProducts userId={user.id} openEdit={setModalEditVisibility} itemEdit={setProductEdit} />}
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

export default Product;