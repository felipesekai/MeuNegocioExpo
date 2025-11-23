import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const PurchaseModal = ({ visible, onClose, onConfirm, product, loading }) => {
    const [quantity, setQuantity] = useState('');
    const [unitCost, setUnitCost] = useState('');
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        if (visible) {
            setQuantity('');
            setUnitCost('');
            setTotalCost(0);
        }
    }, [visible]);

    useEffect(() => {
        const qty = parseFloat(quantity) || 0;
        const cost = parseFloat(unitCost) || 0;
        setTotalCost(qty * cost);
    }, [quantity, unitCost]);

    const handleConfirm = () => {
        const qty = parseFloat(quantity);
        const cost = parseFloat(unitCost);

        if (!qty || qty <= 0) {
            alert('Informe uma quantidade válida.');
            return;
        }
        if (isNaN(cost) || cost < 0) {
            alert('Informe um custo unitário válido.');
            return;
        }

        onConfirm({
            productId: product._id,
            quantity: qty,
            unitCost: cost,
            totalCost: qty * cost,
        });
    };

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={() => onClose(false)}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Registrar Compra</Text>
                    <Text style={styles.subtitle}>{product?.name}</Text>

                    <Text style={styles.label}>Quantidade</Text>
                    <TextInput
                        placeholder="Ex: 10"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Custo Unitário (R$)</Text>
                    <TextInput
                        placeholder="Ex: 5.50"
                        keyboardType="numeric"
                        value={unitCost}
                        onChangeText={setUnitCost}
                        style={styles.input}
                    />

                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Custo Total:</Text>
                        <Text style={styles.totalValue}>R$ {totalCost.toFixed(2)}</Text>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => onClose(false)} style={styles.cancelButton} disabled={loading}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.confirmText}>Confirmar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '85%',
        maxWidth: 400,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    cancelText: {
        color: '#666',
        fontWeight: '600',
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#007aff',
        minWidth: 100,
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default PurchaseModal;
