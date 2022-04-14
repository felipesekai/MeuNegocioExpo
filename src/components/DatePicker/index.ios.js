import React, { useState } from 'react';
import { TouchableOpacity, Platform, Text, Modal, DatePickerIOSBase } from 'react-native';
import RNDatePicker from '@react-native-community/datetimepicker';
import { Container, Header } from './styles';

const DatePicker = ({ date, onClose, onChange }) => {

    const [dateNow, setDateNow] = useState(new Date(date));

    return (
        <Modal transparent={true} onRequestClose={() => onClose(false)} >
        <Container>
            <Header>                
                    <TouchableOpacity onPress={() => onClose(false)}>
                        <Text>Fechar</Text>
                    </TouchableOpacity>                
            </Header>
            
            <RNDatePicker
                value={dateNow}
                mode='date'
                display="default"
                onChange={(event, d) => {      
                    const currentDate = d;
                    setDateNow(currentDate);
                    onChange(currentDate);                        
                                                   
                }}
                
            />

        </Container>
        </Modal>
    );
}

export default DatePicker;