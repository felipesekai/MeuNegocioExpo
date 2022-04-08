import React, {useState, useContext, useEffect, useCallback} from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import Header from '../../components/Header';
import { Container, HeaderList, TextHL } from './styles';
import { Background } from '../../utils/Style';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import FlatListProducts from './FlatListProducts';
import NewProduct from './NewProduct';
import { insertProduct } from '../../database';
import { AuthContext } from '../../contexts/auth';


const Product = () => {
    const [modalVisibility,setModalVisibility] = useState(false);
    const {user, loading, setLoading, theme} = useContext(AuthContext);
 
    function addNewProduct(product) {
        setLoading(true);
        insertProduct(user.id, product)
        .then(()=> {
            alert('Produto cadastrado!')
        })
        .catch((error)=>{
            alert('erro ao cadastrar Produto!')

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
            {loading ? <ActivityIndicator size={30} color={theme.primaryColor} /> 
            : <FlatListProducts userId={user.id}/>}
            

            <FloatingButton onClick={() => setModalVisibility(true)} icon={Icons("addchart", 30, 'white')} />

            {modalVisibility &&
            <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisibility}
            onRequestClose={()=>setModalVisibility(false)}
            >
                <NewProduct onClose={(bol)=>setModalVisibility(bol)} setNewProduct={(item)=>addNewProduct(item)} />
            </Modal>
            }
        </Background>

    );
}

export default Product;