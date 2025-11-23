import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import { purchaseRepository, productRepository } from '../../database/repository';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import PurchaseModal from './PurchaseModal';
import { useProducts } from '../../hooks/useProducts';
import LoaderOverlay from '../../components/LoaderOverlay';

export default function PurchaseScreen() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState(null);
  const navigation = useNavigation();
  const { registerPurchase, mutating } = useProducts();

  const loadData = async (productId = null) => {
    const [purchaseData, productData] = await Promise.all([
      purchaseRepository.getAllByProduct(productId),
      productRepository.getAll(),
    ]);

    const productMap = productData.reduce((acc, product) => {
      acc[product._id] = product.name;
      return acc;
    }, {});

    setPurchases(purchaseData);
    setProducts(productData);
    setProductMap(productMap);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData(selectedProduct);
    });

    return unsubscribe;
  }, [navigation, selectedProduct]);

  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
    loadData(productId);
  };

  const handleExport = async () => {
    const header = 'Produto,Quantidade,Custo Unitário,Custo Total,Data\n';
    const rows = purchases.map(p =>
      `${productMap[p.productId]},${p.quantity},${p.unitCost.toFixed(2)},${p.totalCost.toFixed(2)},${new Date(p.purchasedAt).toLocaleDateString()}`
    ).join('\n');

    const csv = header + rows;
    const filename = FileSystem.documentDirectory + 'compras.csv';
    await FileSystem.writeAsStringAsync(filename, csv);
    await Sharing.shareAsync(filename);
  };

  const handleOpenPurchaseModal = () => {
    // If a product is selected in the filter, use it; otherwise, use the first product
    const productToUse = selectedProduct
      ? products.find(p => p._id === selectedProduct)
      : products[0];

    if (!productToUse) {
      alert('Nenhum produto disponível. Cadastre produtos primeiro.');
      return;
    }

    setSelectedProductForPurchase(productToUse);
    setPurchaseModalVisible(true);
  };

  const handleRegisterPurchase = async (purchaseData) => {
    try {
      await registerPurchase(purchaseData);
      alert('Compra registrada com sucesso!');
      setPurchaseModalVisible(false);
      loadData(selectedProduct); // Reload data to show new purchase
    } catch (error) {
      alert('Erro ao registrar compra!');
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{productMap[item.productId] || 'Produto não encontrado'}</Text>
      <Text style={styles.itemText}>Quantidade: {item.quantity}</Text>
      <Text style={styles.itemText}>Custo Unitário: R$ {item.unitCost.toFixed(2)}</Text>
      <Text style={styles.itemText}>Custo Total: R$ {item.totalCost.toFixed(2)}</Text>
      <Text style={styles.dateText}>Data: {new Date(item.purchasedAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Histórico de Compras" />
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => handleProductChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todos os produtos" value={null} />
          {products.map((product) => (
            <Picker.Item key={product._id} label={product.name} value={product._id} />
          ))}
        </Picker>
        <Button title="Exportar CSV" onPress={handleExport} />
      </View>
      <FlatList
        data={purchases}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

      <FloatingButton
        onClick={handleOpenPurchaseModal}
        icon={Icons('addchart', 30, 'white')}
        accessibilityLabel="Registrar compra"
      />

      <PurchaseModal
        visible={purchaseModalVisible}
        onClose={setPurchaseModalVisible}
        onConfirm={handleRegisterPurchase}
        product={selectedProductForPurchase}
        loading={mutating}
      />

      <LoaderOverlay visible={mutating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
