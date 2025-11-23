import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, TouchableOpacity, Alert, Text, View, StyleSheet } from 'react-native';
import { Icons } from '../../components/FloatingButton';
import { Background } from '../../utils/Style';
import FlatListProducts from './FlatListProducts';
import { Form } from '@unform/mobile';
import { format } from 'date-fns';
import DatePicker from '../../components/DatePicker/index';
import { AuthContext } from '../../contexts/auth';
import { Platform } from 'react-native';
import { useProducts } from '../../hooks/useProducts';
import { usePurchases } from '../../hooks/usePurchases';
import { confirmDialog } from '../../utils/dialogs';
import LoaderOverlay from '../../components/LoaderOverlay';

const PurchaseScreen = ({ onClose }) => {
  const formRef = useRef(null);
  const [products, setProducts] = useState([]); // selected products with quantity and cost
  const { products: allProducts, refresh: refreshProducts } = useProducts();
  const { createBatch, mutating } = usePurchases();
  const [datePickerStatus, setDatePickerStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateformat, setDateformat] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [total, setTotal] = useState(0);
  const { theme } = useContext(AuthContext);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (products.length > 0) {
      let _aux = 0;
      products.forEach((product) => {
        _aux += parseFloat(product.quantity * product.unitCost) || 0;
      });
      setTotal(_aux);
    } else {
      setTotal(0);
    }
  }, [products]);

  function handleSelectDate(selectedDate) {
    setDatePickerStatus(Platform.OS === 'ios');
    if (selectedDate === null) {
      return;
    }
    setDate(selectedDate);
    setDateformat(format(selectedDate, 'dd/MM/yyyy'));
  }

  async function handleSubmitForm() {
    const purchaseProductsForDB = products
      .filter((item) => item.quantity > 0)
      .map((p) => ({
        productId: p._id,
        quantity: p.quantity,
        unitCost: p.unitCost,
      }));

    if (purchaseProductsForDB.length === 0) {
      alert('Nenhum produto selecionado. Adicione quantidade e custo aos produtos.');
      return;
    }

    const summary = purchaseProductsForDB
      .map((item) => {
        const originalProduct = products.find((p) => p._id === item.productId);
        return `${originalProduct ? originalProduct.name : 'Produto'} ${item.quantity} x R$ ${item.unitCost.toFixed(2)}`;
      })
      .join('\n');

    confirmDialog({
      title: 'Confirmar Compra?',
      message: `${summary}\n\nTotal: R$ ${total.toFixed(2)}`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await createBatch(purchaseProductsForDB, date);
          Alert.alert('Compra registrada!', '', [
            {
              text: 'ok',
              onPress: () => onClose(),
              style: 'cancel',
            },
          ]);
        } catch (err) {
          alert(err.message || 'Erro ao registrar compra');
        }
      },
    });
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose}>
      <Background>
        <View style={styles.headerBackground}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => onClose()}>
              {Icons('arrow-back', 30, theme.backgroundColor)}
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.backgroundColor }]}>
              {total > 0 ? `Total: R$ ${total.toFixed(2)}` : 'Nova Compra'}
            </Text>
            <TouchableOpacity
              style={styles.okButton}
              onPress={() => formRef.current?.submitForm()}
              accessibilityRole="button"
              accessibilityLabel="OK"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.okText, { color: theme.backgroundColor }]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          <Form style={{ flex: 1 }} ref={formRef} onSubmit={handleSubmitForm}>
            <View style={styles.dateContainer}>
              <TouchableOpacity onPress={() => setDatePickerStatus(true)} style={styles.dateButton}>
                <Text style={styles.dateLabel}>Data da Compra:</Text>
                <Text style={styles.dateValue}>{dateformat}</Text>
              </TouchableOpacity>
            </View>
            <FlatListProducts products={allProducts} list={products} setList={setProducts} />
          </Form>
        </View>

        {datePickerStatus && <DatePicker date={date} onChange={handleSelectDate} onClose={setDatePickerStatus} />}
        <LoaderOverlay visible={mutating} />
      </Background>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#3b3dbf',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  okButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  okText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  dateContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default PurchaseScreen;
