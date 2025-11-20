import React, { useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Container } from './styles';
import CardItens from './CardItens';
import { observeProducts } from '../../../database/repository';
import { AuthContext } from '../../../contexts/auth';
import ActiviteIndicatorCenter from '../../../components/ActiviteIndicatorCenter';

const ProductList = ({ products, setList, list, _total, _setTotal }) => {
    const { theme } = useContext(AuthContext);

    useEffect(() => {
        if (products) {
            const productListWithQuantity = products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 0
            }));
            setList(productListWithQuantity);
        }
    }, [products]); // Effect runs when products from DB change

    // While the parent list is being populated, show loading.
    if (list.length === 0) {
        return <ActiviteIndicatorCenter size={30} color={theme.primaryColor} />;
    }

    return (
        <Container>
            <FlatList
                data={list}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<CardItens totalItem={_total} sumTotal={(item) => _setTotal(item)} item={item} />)}
            />
        </Container>
    );
}

const enhance = withObservables(['products'], () => ({
    products: observeProducts(),
}));

export default enhance(ProductList);