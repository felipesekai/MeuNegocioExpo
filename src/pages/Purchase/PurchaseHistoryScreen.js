import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from '../../components/Header';
import { usePurchases } from '../../hooks/usePurchases';
import { productRepository } from '../../database/repository';
import { useNavigation } from '@react-navigation/native';
import FloatingButton, { Icons } from '../../components/FloatingButton';
import PurchaseScreen from './PurchaseScreen';
import LoaderOverlay from '../../components/LoaderOverlay';
import { confirmDialog } from '../../utils/dialogs';
import { format } from 'date-fns';

export default function PurchaseHistoryScreen() {
    const [productMap, setProductMap] = useState({});
    const [expandedBatch, setExpandedBatch] = useState(null);
    const [batchItems, setBatchItems] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const { batches, refresh, deleteBatch, getItemsByBatch, loading, mutating } = usePurchases();

    const loadData = async () => {
        await refresh();
        const productData = await productRepository.getAll();

        const productMap = productData.reduce((acc, product) => {
            acc[product._id] = product.name;
            return acc;
        }, {});

        setProductMap(productMap);
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });

        return unsubscribe;
    }, [navigation]);

    const handleExpandBatch = async (batchId) => {
        if (expandedBatch === batchId) {
            setExpandedBatch(null);
        } else {
            setExpandedBatch(batchId);
            if (!batchItems[batchId]) {
                const items = await getItemsByBatch(batchId);
                setBatchItems((prev) => ({ ...prev, [batchId]: items }));
            }
        }
    };

    const handleDeleteBatch = (batch) => {
        confirmDialog({
            title: 'Excluir Compra',
            message: `Deseja realmente excluir esta compra de R$ ${batch.totalAmount.toFixed(2)}?\n\nO estoque será revertido.`,
            onConfirm: async () => {
                try {
                    await deleteBatch(batch._id);
                    Alert.alert('Compra excluída!', 'O estoque foi revertido.');
                    loadData();
                } catch (error) {
                    Alert.alert('Erro', 'Não foi possível excluir a compra.');
                }
            },
        });
    };

    const handleNewPurchase = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        loadData();
    };

    const renderBatchItem = ({ item: batch }) => {
        const isExpanded = expandedBatch === batch._id;
        const items = batchItems[batch._id] || [];

        return (
            <View style={styles.batchContainer}>
                <TouchableOpacity
                    style={styles.batchHeader}
                    onPress={() => handleExpandBatch(batch._id)}
                    onLongPress={() => handleDeleteBatch(batch)}
                >
                    <View style={styles.batchInfo}>
                        <Text style={styles.batchDate}>
                            {format(new Date(batch.purchasedAt), 'dd/MM/yyyy HH:mm')}
                        </Text>
                        <Text style={styles.batchTotal}>R$ {batch.totalAmount.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.itemsContainer}>
                        {items.map((item) => (
                            <View key={item._id} style={styles.itemRow}>
                                <Text style={styles.itemProduct}>{productMap[item.productId] || 'Produto'}</Text>
                                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                                <Text style={styles.itemCost}>R$ {item.unitCost.toFixed(2)}</Text>
                                <Text style={styles.itemSubtotal}>
                                    R$ {(item.quantity * item.unitCost).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Histórico de Compras" />
            <FlatList
                data={batches}
                renderItem={renderBatchItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhuma compra registrada.</Text>
                }
            />

            <FloatingButton
                onClick={handleNewPurchase}
                icon={Icons('add', 30, 'white')}
                accessibilityLabel="Nova compra"
            />

            {modalVisible && <PurchaseScreen onClose={handleCloseModal} />}

            <LoaderOverlay visible={loading || mutating} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 10,
    },
    batchContainer: {
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    batchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    batchInfo: {
        flex: 1,
    },
    batchDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    batchTotal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745',
    },
    expandIcon: {
        fontSize: 16,
        color: '#999',
    },
    itemsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemProduct: {
        flex: 2,
        fontSize: 14,
        color: '#333',
    },
    itemQuantity: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    itemCost: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    itemSubtotal: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#999',
    },
});
