import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Text, } from 'react-native';
import { useField } from '@unform/core';
import { ViewInput, Input, TitleInputs } from '../../../utils/Style';

const InputText = ({ name, label, onChangeText, ...rest }) => {
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
        if(error){
            setColorError('red')
        }else {    
            setColorError(null)
        }
    },[error])

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
            {label&& <TitleInputs>{label}</TitleInputs>}
            <Input 
            erro={colorError}
            ref={inputRef}
            onChangeText={handleChangeText}
            defaultValue={defaultValue}
            {...rest}
            />
            {error && <Text style={{color: 'red', fontSize:12}}>{error}</Text>}
            </ViewInput>
    );
}

export default InputText;