import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getUserFromStorage, insertUser, saveUserFromStorage, signInEmail, signUpEmail } from '../database';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useTheme } from 'styled-components';
// import { Container } from './styles';
export const AuthContext = createContext({})
const contexts = ({ children }) => {
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     getUserFromStorage().then((user) => {
    //         setUser(user);
    //     }).catch((error) => { })
    // }, []);

    async function signUp(name, email, password) {
        setLoading(true);
        signUpEmail(email, password).then(async (userCredential) => {
            const user = userCredential.user;
            let data = {
                id: user.uid,
                name: name,
                email: email
            }

            await insertUser(user.uid, name, email).then((user) => {
                setUser(data);
                setUserinStorage(data);
                Alert.alert("Cadastro realizado","",
                [{
                    text: 'OK',
                    style:'default'
                }])

            }).catch((error) => {
                
            })

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            if (errorCode == "auth/email-already-in-use") {
                Alert.alert("Ops","não foi possivel cadastrar usuario tente novamente!" +
                "\nEmail já existe!",
                [{
                    text: 'OK',
                    style:'cancel'
                }]
                )               
                return
            }

        }).finally(() => {
            setLoading(false);
        })
    }

    async function signIn(email, password) {

        setLoading(true);



        await signInEmail(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                getUserFromFirebase(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            alert(error.message)

            }).finally(() => {
                setLoading(false);

            })


    }

    async function setUserinStorage(data) {
        await saveUserFromStorage(data).then((user) => {

        }).catch((error) => {
            alert(error.message)

        })
    }

    function getUserFromFirebase(user) {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
            let data = {
                id: user.uid,
                name: snapshot.val().username,
                email: user.email
            }
            setUser(data);

            setUserinStorage(data);
        })
    }

    return <AuthContext.Provider value={{ theme, user, loading, signIn, signUp, setLoading }}>
        {children}
    </AuthContext.Provider>;
}

export default contexts;