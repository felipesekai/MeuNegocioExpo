import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, TouchableOpacity, Alert, Text } from 'react-native';
import { Icons } from '../../components/FloatingButton';
import { Background } from '../../utils/Style';
import { Container, ContainerClient, Header, HeaderBackground, Title } from './styles';
import FlatListProducts from './FlatListProducts';
import { Form } from '@unform/mobile';
import { format } from 'date-fns';
import InputText from '../../components/Form/InputText';
import DatePicker from '../../components/DatePicker/index';
import ModalClientSelector from './ModalClientSelector';
import { AuthContext } from '../../contexts/auth';
import { Platform } from 'react-native';
import { orderSchema } from '../../validation/schemas';
import { useProducts } from '../../hooks/useProducts';
import { useGlobal } from '../../contexts/global';
import * as Yup from 'yup';
import { useOrders } from '../../hooks/useOrders';
import { confirmDialog } from '../../utils/dialogs';
import LoaderOverlay from '../../components/LoaderOverlay';

const NewRequestScreen = ({ onClose, onCreated, initialOrder }) => {
  const formRef = useRef(null);
  const [products, setProducts] = useState([]); // selected products with quantity
  const { products: allProducts, refresh: refreshProducts } = useProducts();
  const [dataPikcerStatus, setDatePickerStatus] = useState(false);
  const [clientPickerStatus, setClientPickerStatus] = useState(false);
  const [clientSelected, setClientSelected] = useState(null);
  const [date, setDate] = useState(new Date());
  const [dateformat, setDateformat] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [total, setTotal] = useState(0);
  const { theme, setLoading } = useContext(AuthContext);
  const { setPendingOrders } = useGlobal();
  const { createOrder, mutating, updateOrderWithProducts } = useOrders();
  const isEditing = Boolean(initialOrder?._id);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (initialOrder) {
      if (initialOrder.client) {
        setClientSelected(initialOrder.client);
      }
      if (initialOrder.orderDate) {
        const parsedDate =
          initialOrder.orderDate instanceof Date ? initialOrder.orderDate : new Date(initialOrder.orderDate);
        setDate(parsedDate);
        setDateformat(format(parsedDate, 'dd/MM/yyyy'));
      }
    }
  }, [initialOrder]);

  useEffect(() => {
    if (initialOrder && allProducts.length) {
      const mapped = allProducts.map((product) => {
        const existing = initialOrder.items?.find((item) => item.productId === product._id);
        return {
          ...product,
          quantity: existing?.quantity || 0,
          price: existing?.unitPrice ?? product.price,
        };
      });
      setProducts(mapped);
    }
  }, [initialOrder, allProducts]);

  useEffect(() => {
    if (products.length > 0) {
      let _aux = 0;
      products.forEach((product) => {
        _aux += parseFloat(product.quantity * product.price) || 0;
      });
      setTotal(_aux);
    } else {
      setTotal(0);
    }
  }, [products]);

  function hanldeSelectDate(selectedDate) {
    setDatePickerStatus(Platform.OS === 'ios');
    if (selectedDate === null) {
      return;
    }
    setDate(selectedDate);
    setDateformat(format(selectedDate, 'dd/MM/yyyy'));
  }

  function hanldeSelectClient(client) {
    setClientPickerStatus(false);
    setClientSelected(client);
  }

  async function handleSubmitForm() {
    const orderProductsForDB = products
      .filter((item) => item.quantity > 0)
      .map((p) => ({
        productId: p._id,
        quantity: p.quantity,
        unitPrice: p.price, // Assuming product price is available in the products state
      }));

    const data = {
      client: clientSelected,
      date: dateformat,
      products: orderProductsForDB,
      total: total,
    };

    try {
      await orderSchema.validate(data, { abortEarly: false });
      const summary = data.products
        .map((item) => {
          const originalProduct = products.find((p) => p._id === item.productId);
          return `${originalProduct ? originalProduct.name : 'Produto'} ${item.quantity} x ${item.unitPrice}`;
        })
        .join('\n');

      confirmDialog({
        title: isEditing ? 'Atualizar Pedido?' : 'Confirmar Pedido?',
        message: `${summary}\nTotal: ${total.toFixed(2)}`,
        confirmText: isEditing ? 'Atualizar' : 'Confirmar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
          try {
            if (isEditing) {
              await updateOrderWithProducts({
                _id: initialOrder._id,
                clientId: data.client._id,
                status: initialOrder.status || 'open',
                products: data.products,
                orderDate: date,
              });
            } else {
              await createOrder({
                clientId: data.client._id,
                status: 'open',
                products: data.products,
              });
            }
            setPendingOrders((prev) => prev + 1);
            if (typeof onCreated === 'function') {
              await onCreated();
            }
            Alert.alert(isEditing ? 'Pedido atualizado!' : 'Pedido realizado!', '', [
              {
                text: 'ok',
                onPress: () => onClose(),
                style: 'cancel',
              },
            ]);
          } catch (err) {
            alert(err.message);
          }
        },
      });
    } catch (error) {
      const valitadeErros = {};

      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          if (err.path == 'client') {
            valitadeErros[err.path] = 'Cliente não foi selecionado';
          }
          if (err.path == 'date') {
            valitadeErros[err.path] = 'insira a data';
          }
          if (err.path == 'products') {
            valitadeErros[err.path] = 'nenhum produto selecionado';
            alert(valitadeErros[err.path]);
          }
        });
        formRef.current.setErrors(valitadeErros);
      }
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose}>
      <Background>
        <HeaderBackground>
          <Header>
            <TouchableOpacity onPress={() => onClose()}>
              {Icons('arrow-back', 30, theme.backgroundColor)}
            </TouchableOpacity>
            <Title>{total > 0 ? 'Total: ' + total.toFixed(2) : isEditing ? 'Editar Pedido' : 'Novo Pedido'}</Title>
            <TouchableOpacity
              style={{ marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6 }}
              onPress={() => formRef.current?.submitForm()}
              accessibilityRole="button"
              accessibilityLabel="OK"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ color: theme.backgroundColor, fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </Header>
        </HeaderBackground>

        <Container>
          <Form style={{ flex: 1 }} ref={formRef} onSubmit={handleSubmitForm}>
            <ContainerClient>
              <TouchableOpacity onPress={() => setClientPickerStatus(true)}>
                <InputText
                  name="client"
                  label="Cliente"
                  editable={false}
                  value={clientSelected ? clientSelected.name : 'Selecione um Cliente'}
                  style={{ color: theme.textColor, height: 40, width: 150 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDatePickerStatus(true)}>
                <InputText
                  name="date"
                  label="Data"
                  editable={false}
                  defaultValue={dateformat || 'dia/mes/ano'}
                  style={{ color: theme.textColor, height: 40, width: 100 }}
                />
              </TouchableOpacity>
            </ContainerClient>
            <FlatListProducts products={allProducts} list={products} setList={setProducts} _total={total} _setTotal={setTotal} />
          </Form>
        </Container>

        {dataPikcerStatus && <DatePicker date={date} onChange={hanldeSelectDate} onClose={setDatePickerStatus} />}
        {clientPickerStatus && <ModalClientSelector onClose={setClientPickerStatus} clientSelect={hanldeSelectClient} />}
        <LoaderOverlay visible={mutating} />
      </Background>
    </Modal>
  );
};

export default NewRequestScreen;
