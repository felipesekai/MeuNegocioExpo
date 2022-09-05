import React, { useState } from 'react';
import { TouchableOpacity, Platform, Text } from 'react-native';
import RNDatePicker from '@react-native-community/datetimepicker';
import { Container, Header } from './styles';

const DatePicker = ({ date, onClose, onChange }) => {

    const [dateNow, setDateNow] = useState(new Date(date));

    return (
        <Container>
            <Header>
                {Platform.OS === 'ios' &&
                    <TouchableOpacity onPress={() => onClose()}>
                        <Text>Fechar</Text>
                    </TouchableOpacity>
                }
            </Header>
            <RNDatePicker
                value={dateNow}
                mode='date'
                display="default"
                onChange={(event, d) => {
                   if(event.type === 'set'){
                    const currentDate = d || dateNow;
                    setDateNow(currentDate);
                    onChange(currentDate);                        
                   }else{
                       onChange(null)
                   }                                  
                }}
                
            />

        </Container>
    );
}

export default DatePicker;