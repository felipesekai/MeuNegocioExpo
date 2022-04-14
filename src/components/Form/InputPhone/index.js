import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Text, } from 'react-native';
import { useField } from '@unform/core';
import { ViewInput, Input, TitleInputs, styles } from '../../../utils/Style';
import { TextInputMask } from 'react-native-masked-text';


const InputPhone = ({ name, label, onChangeText, ...rest }) => {
    const inputRef = useRef(null);

    const { fieldName, registerField, defaultValue, error } = useField(name);
    const [colorError, setColorError] = useState(null);

    useEffect(() => {
        inputRef.current.value = defaultValue;
    }, [defaultValue]);
    useEffect(() => {
        if (inputRef.current) inputRef.current.value = defaultValue;
    }, [defaultValue]);

    useEffect(() => {
        if (error) {
            setColorError('red')
        } else {
            setColorError(null)
        }
    }, [error])

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue() {
                if (inputRef.current) return inputRef.current.value;

                return '';
            },
            setValue(ref, value) {
                if (inputRef.current) {
                    inputRef.current.setNativeProps({ text: value });
                    inputRef.current.value = value;
                }
            },
            clearValue() {
                if (inputRef.current) {
                    inputRef.current.setNativeProps({ text: '' });
                    inputRef.current.value = '';
                }
            },
        });
    }, [fieldName, registerField]);

    const handleChangeText = useCallback(
        text => {
            if (inputRef.current) inputRef.current.value = text;

            if (onChangeText) onChangeText(text);
        }, [onChangeText]
    );


    return (

        <ViewInput style={{ width: '100%' }}>
            {label && <TitleInputs>{label}</TitleInputs>}            
            <TextInputMask
                style={{
                    padding: 10,
                    width: '100%',
                    height: 50,
                    borderWidth: 2,
                    borderRadius: 7,                    
                    borderColor: colorError? colorError: '#f4a460'
                }}
                placeholder="(99) 9999-9999"
                type={'cel-phone'}
                keyboardType='phone-pad'
                options={{
                  maskType: 'BRL',
                  dddMask: '(99)',
                  withDDD: true,
                }}         
                value={defaultValue}
                onChangeText={handleChangeText}
                ref={inputRef}
                {...rest}                
            />
           
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </ViewInput>
    );
}

export default InputPhone;