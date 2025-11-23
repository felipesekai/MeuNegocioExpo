import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useProducts } from '../../hooks/useProducts';
import { purchaseRepository } from '../../database/repository';
import { format } from 'date-fns';
import { exportPurchasesToCSV } from '../../services/ExportService';

const PurchaseList = ({ visible, onClose, product }) => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && product) {
            loadPurchases();
        }
    }, [visible, product]);

    const loadPurchases = async () => {
        setLoading(true);
        try {
            const data = await purchaseRepository.getAllByProduct(product._id);
            setPurchases(data);
        } catch (error) {
            console.error('Error loading purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        await exportPurchasesToCSV(product?._id);
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cellDate}>{format(new Date(item.purchasedAt), 'dd/MM/yy HH:mm')}</Text>
            <Text style={styles.cellQty}>{item.quantity}</Text>
            <Text style={styles.cellCost}>R$ {item.unitCost.toFixed(2)}</Text>
            <Text style={styles.cellTotal}>R$ {item.totalCost.toFixed(2)}</Text>
        </View>
    );

    return (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={() => onClose(false)}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Histórico de Compras</Text>
                            <Text style={styles.subtitle}>{product?.name}</Text>
                        </View>
                        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
                            <Text style={styles.exportText}>Exportar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={styles.headerDate}>Data</Text>
                        <Text style={styles.headerQty}>Qtd</Text>
                        <Text style={styles.headerCost}>Unit.</Text>
                        <Text style={styles.headerTotal}>Total</Text>
                    </View>

                    {loading ? (
                        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007aff" />
                    ) : (
                        <FlatList
                            data={purchases}
                            keyExtractor={(item) => item._id}
                            renderItem={renderItem}
                            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma compra registrada.</Text>}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}

                    <TouchableOpacity onPress={() => onClose(false)} style={styles.closeButton}>
                        <Text style={styles.closeText}>Fechar</Text>
                    </TouchableOpacity>
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
        width: '90%',
        height: '80%',
        borderRadius: 12,
        padding: 16,
    },
    header: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    exportButton: {
        backgroundColor: '#007aff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    exportText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerDate: { flex: 2, fontWeight: 'bold', fontSize: 12 },
    headerQty: { flex: 1, fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
    headerCost: { flex: 1.5, fontWeight: 'bold', fontSize: 12, textAlign: 'right' },
    headerTotal: { flex: 1.5, fontWeight: 'bold', fontSize: 12, textAlign: 'right' },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cellDate: { flex: 2, fontSize: 12, color: '#333' },
    cellQty: { flex: 1, fontSize: 12, textAlign: 'center', color: '#333' },
    cellCost: { flex: 1.5, fontSize: 12, textAlign: 'right', color: '#333' },
    cellTotal: { flex: 1.5, fontSize: 12, textAlign: 'right', fontWeight: 'bold', color: '#333' },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeText: {
        fontWeight: 'bold',
        color: '#333',
    },
});

export default PurchaseList;
