import React, { useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Container } from './styles';
import CardItens from './CardItens';
import { AuthContext } from '../../../contexts/auth';
import ActiviteIndicatorCenter from '../../../components/ActiviteIndicatorCenter';


const ProductList = ({ products, setList, list, _total, _setTotal }) => { // 'products' prop now comes from parent
    const { theme } = useContext(AuthContext);


    useEffect(() => {
        // When the parent passes new products, initialize the local list with quantity 0
        if (products && products.length > 0) {
            const productListWithQuantity = products.map(product => ({
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: 0,
                // Add other product properties if needed for display
                description: product.description,
            }));
            setList(productListWithQuantity);
        } else {
            setList([]); // Clear list if no products are passed
        }
    }, [products]); // Effect runs when products prop changes



    return (
        <Container>
            <FlatList
                data={list}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (<CardItens totalItem={_total} sumTotal={(item) => _setTotal(item)} item={item} />)}
            />
        </Container>
    );
}

export default ProductList;
