import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Background } from '../../../utils/Style';
import { useTheme } from 'styled-components';

const ItemRow = ({ item, theme }) => {
  return (
    <View style={[styles.row, { borderColor: theme.borderColor || '#ccc' }]}>
      <Text style={[styles.cell, { flex: 2, color: theme.textColor }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 1, color: theme.textColor }]}>Qtd: {item.quantity}</Text>
      <Text style={[styles.cell, { flex: 1, color: theme.textColor }]}>R$ {item.unitPrice.toFixed(2)}</Text>
    </View>
  );
};

const OrderDetailsModal = ({ visible, order, onClose, onEdit }) => {
  const theme = useTheme();

  if (!visible || !order) return null;

  const items = order.items?.map((item) => {
    const product = order.productsSnapshot?.find((p) => p._id === item.productId);
    return {
      ...item,
      name: product?.name || 'Produto',
    };
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <Background>
        <View style={{ padding: 16 }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>Detalhes do Pedido</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Fechar">
              <Text style={{ color: theme.primaryColor, fontWeight: '700' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, { color: theme.textMuted || theme.textColor }]}>
            Cliente: <Text style={{ color: theme.textColor }}>{order.client?.name || '---'}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.textMuted || theme.textColor }]}>
            Data: <Text style={{ color: theme.textColor }}>{order.orderDate?.toLocaleDateString?.() || '---'}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.textMuted || theme.textColor }]}>
            Status: <Text style={{ color: order.status === 'paid' ? theme.success : theme.danger }}>{order.status}</Text>
          </Text>
          <Text style={[styles.label, { color: theme.textMuted || theme.textColor }]}>
            Total: <Text style={{ color: theme.textColor }}>R$ {order.totalAmount?.toFixed(2) || '0,00'}</Text>
          </Text>

          <FlatList
            data={items}
            keyExtractor={(item) => `${item.productId}`}
            renderItem={({ item }) => <ItemRow item={item} theme={theme} />}
            ListEmptyComponent={<Text style={{ color: theme.textMuted, marginTop: 12 }}>Sem itens.</Text>}
            style={{ marginTop: 16 }}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primaryColor }]}
              onPress={onEdit}
              accessibilityLabel="Editar pedido"
            >
              <Text style={[styles.buttonText, { color: theme.textOnPrimary || '#fff' }]}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Background>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '800' },
  label: { marginTop: 4 },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cell: {
    fontSize: 14,
  },
  actions: { marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' },
  button: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  buttonText: { fontWeight: '700' },
});

export default OrderDetailsModal;
