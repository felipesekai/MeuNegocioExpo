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
import { insertNewOrder } from '../../database';

const NewRequest = ({ onClose }) => {
    const formRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [dataPikcerStatus, setDatePickerStatus] = useState(false);
    const [clientPickerStatus, setClientPickerStatus] = useState(false);
    const [clientSelected, setClientSelected] = useState(null);
    const [date, setDate] = useState(new Date());
    const [dateformat, setDateformat] = useState(null);
    const [total, setTotal] = useState(0);
    const { user, theme } = useContext(AuthContext);
    useEffect(() => {


        if (products.length > 0 || products !== []) {
            setTotal(0);
            let _aux = 0;

            products.forEach((product) => {
                _aux += parseFloat(product.quantity * product.price) || 0;
            });
            setTotal(_aux)
        }
    }, [total]);

    function hanldeSelectDate(date) {
        setDatePickerStatus(Platform.OS === 'ios');
        if (date === null) { return; }
        setDate(date);
        setDateformat(format(date, 'dd/MM/yyyy'));
    }

    function hanldeSelectClient(client) {
        setClientPickerStatus(false);
        setClientSelected(client);
    }

    async function handleSubmitForm() {
        const data = {
            client: clientSelected,
            date: dateformat,
            products: products.filter((item) => item.quantity > 0),
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
                data.products.map(item => '\n' + item.name) + '\n' + 'Total: ' + total,
                [{
                    text: 'cancelar',
                    onPress: () => console.log('cancelado'),
                    style: 'cancel'
                },
                {
                    text: 'ok',
                    onPress: () => {                        
                        insertNewOrder(user.id, clientSelected, data)
                        .then(() => {
                            Alert.alert("Pedidio realizado!", '',
                                [{
                                    text: 'ok',
                                    onPress: () => onClose(),
                                    style: 'cancel'
                                }])
                        }).catch((err) => { alert(err.message) })
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
        <Modal animationType='fade' onRequestClose={onClose}>
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
                        <FlatListProducts list={products} setList={(list) => setProducts(list)} _total={total} _setTotal={setTotal} />
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