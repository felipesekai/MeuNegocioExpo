import React, { useCallback, useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useField } from '@unform/core';
// import { Container } from './styles';

const InputData = ({ name, label, onChangeText, ...rest }) => {

    const inputRef = useRef(null);

    const { fieldName, registerField, defaultValue,error } = useField(name);
    const [colorError, setColorError] = useState(null);

    useEffect(() => {
        inputRef.current.value = defaultValue;

    }, [defaultValue]);
    
    useEffect(() => {
       if(inputRef.current) inputRef.current.value = defaultValue;

    }, [defaultValue]); 
    
    useEffect(() => {
        if(error){
            setColorError('red')
        }else {    
            setColorError(null)
        }

    }, [error]);

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

    return <View />;
}

export default InputData;