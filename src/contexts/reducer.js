import React, { useReducer } from "react";

const initialState = {
    modal: false,
};

const modalReducer = (state, action) => {
    switch (action.type) {
            case 'OPEN':
               return {
                   ...state,
                   modal: true,
               };
            case 'CLOSE':
                return {
                    ...state,
                    modal: false,
                };   
    }
};

export const [modalVisibility, setModalVisibility] = useReducer(modalReducer, initialState);