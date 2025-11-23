import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, View, StyleSheet } from 'react-native';
import CardPurchaseItem from './CardPurchaseItem';

const FlatListProducts = ({ products, list, setList }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            setList((prev) => {
                return products.map((product) => {
                    const existing = prev?.find((p) => p._id === product._id);
                    return {
                        _id: product._id,
                        name: product.name,
                        description: product.description,
                        stock: product.quantity,
                        quantity: existing?.quantity || 0,
                        unitCost: existing?.unitCost || 0,
                    };
                });
            });
        } else {
            setList([]);
        }
    }, [products, setList]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredProducts(list);
        } else {
            const filtered = list.filter((product) =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [list, searchText]);

    const handleUpdateQuantity = (productId, value) => {
        const numValue = parseFloat(value) || 0;
        setList((prev) =>
            prev.map((p) => (p._id === productId ? { ...p, quantity: numValue } : p))
        );
    };

    const handleUpdateCost = (productId, value) => {
        const numValue = parseFloat(value) || 0;
        setList((prev) =>
            prev.map((p) => (p._id === productId ? { ...p, unitCost: numValue } : p))
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar produto..."
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <CardPurchaseItem
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onUpdateCost={handleUpdateCost}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 12,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
});

export default FlatListProducts;
