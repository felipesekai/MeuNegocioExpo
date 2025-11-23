import React, { useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Container } from './styles';
import CardItens from './CardItens';
import { AuthContext } from '../../../contexts/auth';
import ActiviteIndicatorCenter from '../../../components/ActiviteIndicatorCenter';


const ProductList = ({ products, setList, list, _total, _setTotal }) => { // 'products' prop now comes from parent
    const { theme } = useContext(AuthContext);


    useEffect(() => {
        // Merge incoming catalog with existing quantities (keeps items já selecionados ou do pedido em edição)
        if (products && products.length > 0) {
            setList((prev) => {
                return products.map((product) => {
                    const existing = prev?.find((p) => p._id === product._id);
                    return {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: existing?.quantity || 0,
                        description: product.description,
                    };
                });
            });
        } else {
            setList([]);
        }
    }, [products, setList]);



    return (
        <Container>
            <FlatList
                data={list}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (<CardItens sumTotal={_setTotal} item={item} />)}
            />
        </Container>
    );
}

export default ProductList;
