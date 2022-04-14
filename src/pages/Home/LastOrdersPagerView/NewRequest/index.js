import React, { useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Icons } from '../../../../components/FloatingButton';
import { Background } from '../../../../utils/Style';
import { Container, ContainerClient, Header, HeaderBackground, Title } from './styles';
import { useTheme } from 'styled-components';
import FlatListProducts from './FlatListProducts';
import { Form } from '@unform/mobile';
import { format } from 'date-fns';
import InputText from '../../../../components/Form/InputText';
import DatePicker from '../../../../components/DatePicker/index';
const NewRequest = ({ onClose }) => {
    const theme = useTheme();
    const [dataPikcerStatus,setDatePickerStatus]= useState(false);
    const [date, setDate] = useState(new Date());
    const [dateformat, setDateformat] = useState('dia/mes/ano');
  
    function hanldeSelectDate(date) {
        setDatePickerStatus(Platform.OS === 'ios');
        if (date === null) { return; }
        setDate(date);
        setDateformat(format(date, 'dd/MM/yyyy'));
    }
    
    return (
        <Modal animationType='slide' onRequestClose={() => onClose()}>
            <Background>
                <HeaderBackground>
                    <Header>
                        <TouchableOpacity onPress={() => onClose()}>
                            {Icons('arrow-back', 30, theme.backgroundColor)}
                        </TouchableOpacity>
                        <Title>Novo Pedido</Title>
                    </Header>
                </HeaderBackground>
                <Container>
                    <Form style={{ flex: 1 }}>
                        <ContainerClient>
                            <TouchableOpacity>
                            <InputText 
                            name='client' 
                            label='Cliente' editable={false} 
                            placeholder='Selecione um Cliente'
                            style={{color: theme.textColor, height:40}}
                            />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>setDatePickerStatus(true)}>
                            <InputText name='data' 
                            label='Data' editable={false} 
                            defaultValue={dateformat} 
                            style={{color: theme.textColor, height:40}}/>
                            </TouchableOpacity>
                            
                        </ContainerClient>

                        <FlatListProducts />
                    </Form>
                   

                </Container>
         {dataPikcerStatus && <DatePicker date={date} onChange={hanldeSelectDate} onClose={setDatePickerStatus}/>}
                
                
            </Background>

        </Modal>
    );
}

export default NewRequest;