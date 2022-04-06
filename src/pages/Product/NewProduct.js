import {
    ModalContainer,
    Input, ViewInput, TextOverInputs, HeaderModal, ModalBackgroud, styles
} from '../../utils/Style';
import React, { useState, useEffect, } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';
const Product = ({ onClose }) => {

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ModalBackgroud
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
                enabled
            >
                <ModalContainer>

                    <HeaderModal>
                        {/* cancel */}
                        <TouchableOpacity
                            onPress={() => onClose(false)}
                            style={{ position: 'absolute', left: 0 }}>
                            <Icon name="close" size={30} color='#000' />
                        </TouchableOpacity>
                        {/* comfirm */}
                        <TouchableOpacity
                            onPress={() => onClose(false)}
                            style={{ position: 'absolute', right: 0 }}>
                            <Icon name="add-task" size={30} color='#000' />
                        </TouchableOpacity>

                    </HeaderModal>

                    <ViewInput>
                        <TextOverInputs>Nome</TextOverInputs>
                        <Input
                            placeholder="Nome"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </ViewInput>

                    <ViewInput>
                        <TextOverInputs>Quantidade</TextOverInputs>
                        <Input
                            placeholder="Quantidade"
                            value={quantity}
                            keyboardType="numeric"
                            onChangeText={(text) => setQuantity(text)}
                        />
                    </ViewInput>

                    <ViewInput>
                        <TextOverInputs>Preço</TextOverInputs>
                        <TextInputMask
                            style={styles.TInputMasked}
                            placeholderTextColor={'#000'}
                            type={'money'}
                            options={{
                                precision: 2,
                                separator: ',',
                                delimiter: '.',
                                unit: 'R$',
                                suffixUnit: ''
                            }}
                            placeholder="Preço"
                            value={price}
                            keyboardType="numeric"
                            onChangeText={(text) => setPrice(text)}
                        />
                    </ViewInput>




                </ModalContainer>
            </ModalBackgroud>
        </TouchableWithoutFeedback>
    );
}

export default Product;