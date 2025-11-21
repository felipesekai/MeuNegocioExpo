import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Container, Client, Number, Date, ViewRow } from './styles';
import { getClientById } from '../../../../database';

const Card = ({data}) => {
    const [clientName, setClientName] = useState('...'); // Default client name
    
    useEffect(() => {
        async function fetchClientName() {
            if (data && data.clientId) {
                try {
                    const client = await getClientById(data.clientId);
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
        <Container>
            <Client>{"Cliente: " + clientName}</Client>
            <ViewRow>
                <Number>{data && 'Total: ' + data.totalAmount.toFixed(2)}</Number>
                <Date>{data && data.orderDate ? "Data: " + data.orderDate.toLocaleDateString() : 'Data: --'}</Date>
            </ViewRow>
        </Container>
    );
}

export default Card;
