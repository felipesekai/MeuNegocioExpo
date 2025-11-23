import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CardPurchaseItem = ({ item, onUpdateQuantity, onUpdateCost }) => {
    const getBadgeColor = (qty) => {
        if (qty < 5) return '#ff4444';
        if (qty < 10) return '#ffbb33';
        return '#00C851';
    };

    const subtotal = (item.quantity || 0) * (item.unitCost || 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    {item.description ? (
                        <Text style={styles.productDescription}>{item.description}</Text>
                    ) : null}
                </View>
                <View style={[styles.badge, { backgroundColor: getBadgeColor(item.stock || 0) }]}>
                    <Text style={styles.badgeText}>Est: {item.stock || 0}</Text>
                </View>
            </View>

            <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantidade</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={item.quantity ? String(item.quantity) : ''}
                        onChangeText={(text) => onUpdateQuantity(item._id, text)}
                        placeholder="0"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Custo Unit. (R$)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={item.unitCost ? String(item.unitCost) : ''}
                        onChangeText={(text) => onUpdateCost(item._id, text)}
                        placeholder="0.00"
                    />
                </View>

                <View style={styles.subtotalGroup}>
                    <Text style={styles.label}>Subtotal</Text>
                    <Text style={styles.subtotal}>R$ {subtotal.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 8,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 11,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 8,
        fontSize: 14,
        backgroundColor: '#f9f9f9',
    },
    subtotalGroup: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    subtotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
        textAlign: 'right',
    },
});

export default CardPurchaseItem;
