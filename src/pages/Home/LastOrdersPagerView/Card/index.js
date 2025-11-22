import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Container, Client, Number, Date, ViewRow, Status } from './styles';
import { clientRepository } from '../../../../database/repository';

const Card = ({data, onPress, onLongPress}) => {
    const [clientName, setClientName] = useState('...'); // Default client name
    
    useEffect(() => {
        async function fetchClientName() {
            if (data && data.clientId) {
                try {
                    const client = await clientRepository.getById(data.clientId);
                    if (client) {
                        setClientName(client.name);
                    } else {
                        setClientName('Cliente Desconhecido');
                    }
                } catch (error) {
                    console.error("Error fetching client name:", error);
                    setClientName('Erro ao carregar cliente');
                }
            }
        }
        fetchClientName();
    }, [data.clientId]); // Re-fetch when clientId changes

    return (
        <Container onPress={onPress} onLongPress={onLongPress}>
            <Client>{"Cliente: " + clientName}</Client>
            <ViewRow>
                <Number>{data && 'Total: ' + data.totalAmount.toFixed(2)}</Number>
                <Date>{data && data.orderDate ? "Data: " + data.orderDate.toLocaleDateString() : 'Data: --'}</Date>
            </ViewRow>
            <Status>{data?.status === 'paid' ? 'Pago' : 'Pendente'}</Status>
        </Container>
    );
}

export default Card;
