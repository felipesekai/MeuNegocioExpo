import React, { useState, useContext, useCallback } from 'react';
import { Modal, Alert, TextInput, View, Text, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import { Container, HeaderList, TextHL } from './styles';
import { Background } from '../../utils/Style';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import FlatListProducts from './FlatListProducts';
import NewProduct from './NewProduct';
import { AuthContext } from '../../contexts/auth';
import EditProduct from './EditProduct';
import { useProducts } from '../../hooks/useProducts';
import { useFocusEffect } from '@react-navigation/native';
import LoaderOverlay from '../../components/LoaderOverlay';
import { confirmDialog } from '../../utils/dialogs';
import PurchaseModal from './PurchaseModal';
import PurchaseList from './PurchaseList';

const ProductScreen = () => {
  const [modalNewVisibility, setModalNewVisibility] = useState(false);
  const [modalEditVisibility, setModalEditVisibility] = useState(false);
  const [productEdit, setProductEdit] = useState({});
  const { setLoading } = useContext(AuthContext);
  const { products, refresh, createProduct, updateProduct, deleteProduct, registerPurchase, loading, mutating } = useProducts();
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [purchaseListVisible, setPurchaseListVisible] = useState(false);
  const [stockTarget, setStockTarget] = useState(null);

  useFocusEffect(
    useCallback(() => {
      refresh({ force: true });
    }, [refresh]),
  );

  async function addNewProduct(product) {
    setLoading(true);
    try {
      await createProduct({ name: product.name, description: product.description, price: parseFloat(product.price), quantity: Number(product.quantity) || 0 });
      alert('Produto cadastrado!');
      setModalNewVisibility(false);
      refresh({ force: true });
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
      await updateProduct({ _id: product.id, name: product.name, description: product.description, price: parseFloat(product.price), quantity: Number(product.quantity) || 0 });
      alert('Produto alterado!');
      setModalEditVisibility(false);
      refresh({ force: true });
    } catch (error) {
      Alert.alert('Ops...', 'Erro ao Alterar Produto!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handlerDeleteProduct(product) {
    confirmDialog({
      title: 'Excluir produto',
      message: 'Deseja realmente excluir este produto?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteProduct(product.id);
          Alert.alert('Produto excluido!', '');
          refresh({ force: true });
        } catch (error) {
          Alert.alert('Ops...', 'Erro ao deletar Produto!');
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
    });
  }

  async function handleRegisterPurchase(purchaseData) {
    try {
      await registerPurchase(purchaseData);
      alert('Compra registrada com sucesso!');
      setPurchaseModalVisible(false);
    } catch (error) {
      alert('Erro ao registrar compra!');
      console.log(error);
    }
  }

  return (
    <Background>
      <Header />
      <HeaderList>
        <TextHL>Nome</TextHL>
        <TextHL>Quantidade</TextHL>
        <TextHL>Preco</TextHL>
      </HeaderList>
      <Container>
        <FlatListProducts
          products={products}
          openEdit={setModalEditVisibility}
          itemEdit={setProductEdit}
          handlerDelete={handlerDeleteProduct}
          handlerStock={(item) => {
            setStockTarget(item);
            setPurchaseModalVisible(true);
          }}
          handlerHistory={(item) => {
            setStockTarget(item);
            setPurchaseListVisible(true);
          }}
        />
      </Container>

      <FloatingButton onClick={() => setModalNewVisibility(true)} icon={Icons('addchart', 30, 'white')} accessibilityLabel="Adicionar produto" />

      {modalNewVisibility && (
        <Modal transparent={true} animationType="slide" visible={modalNewVisibility} onRequestClose={() => setModalNewVisibility(false)}>
          <NewProduct onClose={(bol) => setModalNewVisibility(bol)} setNewProduct={(item) => addNewProduct(item)} />
        </Modal>
      )}
      {modalEditVisibility && (
        <Modal transparent={true} animationType="slide" visible={modalEditVisibility} onRequestClose={() => setModalEditVisibility(false)}>
          <EditProduct onClose={(bol) => setModalEditVisibility(bol)} initialValue={productEdit} submitEdit={handlerEditProduct} />
        </Modal>
      )}

      <PurchaseModal
        visible={purchaseModalVisible}
        onClose={setPurchaseModalVisible}
        onConfirm={handleRegisterPurchase}
        product={stockTarget}
        loading={mutating}
      />

      <PurchaseList
        visible={purchaseListVisible}
        onClose={setPurchaseListVisible}
        product={stockTarget}
      />

      <LoaderOverlay visible={loading || mutating} />
    </Background>
  );
};

export default ProductScreen;
