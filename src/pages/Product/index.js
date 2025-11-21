import React, {useState, useContext, useEffect, useCallback} from 'react';
import { ActivityIndicator, Modal, Alert } from 'react-native';
import Header from '../../components/Header';
import { Container, HeaderList, TextHL } from './styles';
import { Background } from '../../utils/Style';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import FlatListProducts from './FlatListProducts';
import NewProduct from './NewProduct';
import { saveProduct, deleteProduct, getAllProducts } from '../../database';
import { AuthContext } from '../../contexts/auth';
import EditProduct from './EditProduct';


const Product = () => {
    const [modalNewVisibility,setModalNewVisibility] = useState(false);
    const [modalEditVisibility,setModalEditVisibility] = useState(false);
    const [productEdit,setProductEdit] = useState({});
    const { loading, setLoading, theme} = useContext(AuthContext);
    const [products, setProducts] = useState([]); // State to hold products

    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to fetch products from the local database
    async function fetchProducts() {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (err) {
        console.log(err);
        alert("Error fetching products");
      } finally {
        setLoading(false);
      }
    }    async function addNewProduct(product) {
        setLoading(true);
        try {
            await saveProduct({ name: product.name, description: product.description, price: parseFloat(product.price) });
            alert('Produto cadastrado!');
            setModalNewVisibility(false);
            fetchProducts(); // Re-fetch products to update the list
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
            alert('Produto alterado!'); // Added alert for clarity
            setModalEditVisibility(false);
            fetchProducts(); // Re-fetch products to update the list
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
            fetchProducts(); // Re-fetch products to update the list
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
                    products={products} // Pass the products list
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

export default Product;
