import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, TouchableOpacity, Alert } from 'react-native';
import { Icons } from '../../components/FloatingButton';
import { Background } from '../../utils/Style';
import { ButtonView, Container, ContainerClient, Header, HeaderBackground, Title } from './styles';
import FlatListProducts from './FlatListProducts';
import { Form } from '@unform/mobile';
import { format } from 'date-fns';
import InputText from '../../components/Form/InputText';
import DatePicker from '../../components/DatePicker/index';
import ModalClientSelector from './ModalClientSelector';
import MyButton from '../../components/MyButton';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/auth';
import { createOrder, getAllProducts } from '../../database';
import { Platform } from 'react-native';

const NewRequest = ({ onClose }) => {
    const formRef = useRef(null);
    const [products, setProducts] = useState([]); // This state holds selected products with quantity
    const [allProducts, setAllProducts] = useState([]); // This state holds all products from DB
    const [dataPikcerStatus, setDatePickerStatus] = useState(false);
    const [clientPickerStatus, setClientPickerStatus] = useState(false);
    const [clientSelected, setClientSelected] = useState(null);
    const [date, setDate] = useState(new Date());
    const [dateformat, setDateformat] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [total, setTotal] = useState(0);
    const { theme, setLoading } = useContext(AuthContext); // Destructure setLoading from AuthContext

    useEffect(() => {
        // Fetch all products on component mount
        async function fetchAllProducts() {
            setLoading(true);
            try {
                const fetchedProducts = await getAllProducts();
                setAllProducts(fetchedProducts);
            } catch (error) {
                console.error("Error fetching all products:", error);
                Alert.alert("Erro", "Não foi possível carregar os produtos.");
            } finally {
                setLoading(false);
            }
        }
        fetchAllProducts();
    }, []);

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
        if (selectedDate === null) { return; }
        setDate(selectedDate);
        setDateformat(format(selectedDate, 'dd/MM/yyyy'));
    }

    function hanldeSelectClient(client) {
        setClientPickerStatus(false);
        setClientSelected(client);
    }

    async function handleSubmitForm() {
        // Filter products with quantity > 0 and map to the format expected by createOrder
        const orderProductsForDB = products
            .filter((item) => item.quantity > 0)
            .map(p => ({
                productId: p._id,
                quantity: p.quantity,
                unitPrice: p.price // Assuming product price is available in the products state
            }));

        const data = {
            client: clientSelected,
            date: dateformat,
            products: orderProductsForDB, // Use the new format for DB
            total: total
        }

        try {
            const scheme = Yup.object().shape({
                client: Yup.object().required(),
                date: Yup.string().required(),
                products: Yup.array().min(1).required(),
            });

            await scheme.validate(data, { abortEarly: false });
            Alert.alert("Confirmar Pedido?",
                data.products.map(item => {
                    // Find the original product name from the 'products' state for the alert message
                    const originalProduct = products.find(p => p._id === item.productId);
                    return '\n' + (originalProduct ? originalProduct.name : 'Produto') + ' ' + item.quantity + ' x ' + item.unitPrice;
                }).join('') + '\n' + 'Total: ' + total.toFixed(2),
                [{
                    text: 'cancelar',
                    onPress: () => console.log('cancelado'),
                    style: 'cancel'
                },
                {
                    text: 'ok',
                    onPress: async () => {
                        try {
                            await createOrder({
                                clientId: data.client._id,
                                status: 'open',
                                products: data.products
                            });
                            Alert.alert("Pedido realizado!", '',
                                [{
                                    text: 'ok',
                                    onPress: () => onClose(),
                                    style: 'cancel'
                                }]
                            );
                        } catch (err) {
                            alert(err.message);
                        }
                    }

                }]
            );

        } catch (error) {

            const valitadeErros = {}

            if (error instanceof Yup.ValidationError) {


                error.inner.forEach(err => {
                    if (err.path == 'client') {
                        valitadeErros[err.path] = 'Cliente não foi selecionado'

                    }
                    if (err.path == 'date') {
                        valitadeErros[err.path] = 'insira a data'

                    }
                    if (err.path == 'products') {
                        valitadeErros[err.path] = 'nenhum produto selecionado'
                        alert(valitadeErros[err.path])
                    }

                });
                formRef.current.setErrors(valitadeErros);
            }
        }
    }

    return (
        <Modal animationType='slide' onRequestClose={onClose}>
            <Background>
                <HeaderBackground>
                    <Header>
                        <TouchableOpacity onPress={() => onClose()}>
                            {Icons('arrow-back', 30, theme.backgroundColor)}
                        </TouchableOpacity>
                        <Title>{total > 0 ? 'Total: ' + total.toFixed(2) : 'Novo Pedido'}</Title>
                    </Header>
                </HeaderBackground>

                <Container>
                    <Form style={{ flex: 1 }} ref={formRef} onSubmit={handleSubmitForm}>
                        <ContainerClient>
                            <TouchableOpacity onPress={() => setClientPickerStatus(true)}>
                                <InputText
                                    name='client'
                                    label='Cliente' editable={false}
                                    value={clientSelected ? clientSelected.name : 'Selecione um Cliente'}
                                    style={{ color: theme.textColor, height: 40, width: 150 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setDatePickerStatus(true)}>
                                <InputText name='date'
                                    label='Data' editable={false}
                                    defaultValue={dateformat || 'dia/mes/ano'}
                                    style={{ color: theme.textColor, height: 40, width: 100 }} />
                            </TouchableOpacity>

                        </ContainerClient>
                        <FlatListProducts products={allProducts} list={products} setList={setProducts} _total={total} _setTotal={setTotal} />
                        <ButtonView>
                            <MyButton title={'Confirmar'} onClick={() => formRef.current.submitForm()} />
                        </ButtonView>
                    </Form>



                </Container>


                {dataPikcerStatus && <DatePicker date={date} onChange={hanldeSelectDate} onClose={setDatePickerStatus} />}
                {clientPickerStatus && <ModalClientSelector onClose={setClientPickerStatus} clientSelect={hanldeSelectClient} />}

            </Background>
        </Modal>
    );
}

export default NewRequest;
