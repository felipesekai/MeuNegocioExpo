import React, { useRef, useEffect, useCallback } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useField } from '@unform/core';
import { ViewInput, Input as TInput, TextOverInputs } from '../../../utils/Style';
// import { Container } from './styles';

const Input = ({ name, label, onChangeText, ...rest }) => {
    const inputRef = useRef(null);

    const { fieldName, registerField, defaultValue, error } = useField(name);

    useEffect(() => {
        inputRef.current.value = defaultValue;
    }, [defaultValue]);
    useEffect(() => {
        if (inputRef.current) inputRef.current.value = defaultValue;
    }, [defaultValue]);

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

        if(onChangeText) onChangeText(text);
    }, [onChangeText]
);

    return (
            
            <ViewInput style={{width: '100%'}}>
            {label&& <TextOverInputs>{label}</TextOverInputs>}
            <TInput 
            ref={inputRef}
            onChangeText={handleChangeText}
            defaultValue={defaultValue}
            {...rest}
            />
            {error && <Text style={{color: 'red'}}>{error}</Text>}
            </ViewInput>
    );
}

export default Input;