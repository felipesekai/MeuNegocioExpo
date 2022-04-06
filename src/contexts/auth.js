import React, { createContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { getUserFromStorage, insertUser, saveUserFromStorage, signInEmail, signUpEmail } from '../database';
import { getDatabase, onValue, ref } from 'firebase/database';

// import { Container } from './styles';
export const AuthContext = createContext({})
const contexts = ({ children }) => {

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
                alert("cadastro realizado!");
            }).catch((error) => {

            })

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            if (errorCode == "auth/email-already-in-use") {
                alert("Email já existe!")

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
            }).finally(() => {
                setLoading(false);

            })


    }

    async function setUserinStorage(data) {
        await saveUserFromStorage(data).then((user) => {

        }).catch((error) => {

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

    return <AuthContext.Provider value={{ user, loading, signIn, signUp }}>
        {children}
    </AuthContext.Provider>;
}

export default contexts;