import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
    getUserFromStorage,
    insertUser,
    saveUserFromStorage,
    signInEmail,
    signUpEmail,
    signOutUser
} from '../services/firebaseService';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useTheme } from 'styled-components';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in with Firebase
                const storagedUser = await getUserFromStorage();
                if (storagedUser) {
                    setUser(JSON.parse(storagedUser));
                } else {
                    // Fetch user data from Firebase if not in storage
                    getUserFromFirebase(firebaseUser);
                }
            } else {
                // User is signed out
                await saveUserFromStorage(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    async function signUp(name, email, password) {
        setLoading(true);
        try {
            const userCredential = await signUpEmail(email, password);
            const firebaseUser = userCredential.user;
            let data = {
                id: firebaseUser.uid,
                name: name,
                email: email
            };
            await insertUser(firebaseUser.uid, name, email);
            setUser(data);
            await setUserinStorage(data);
            Alert.alert("Cadastro realizado", "", [{ text: 'OK', style: 'default' }]);
        } catch (error) {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
                Alert.alert("Ops", "Email já existe! Não foi possivel cadastrar.", [{ text: 'OK', style: 'cancel' }]);
            } else {
                console.log(error);
                Alert.alert("Ops", "Ocorreu um erro no cadastro.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email, password) {
        setLoading(true);
        try {
            const userCredential = await signInEmail(email, password);
            await getUserFromFirebase(userCredential.user);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        setLoading(true);
        try {
            await signOutUser();
            await saveUserFromStorage(null);
            setUser(null);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function setUserinStorage(data) {
        try {
            await saveUserFromStorage(JSON.stringify(data));
        } catch (error) {
            alert(error.message);
        }
    }

    function getUserFromFirebase(firebaseUser) {
        const db = getDatabase();
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        onValue(userRef, (snapshot) => {
            let data = {
                id: firebaseUser.uid,
                name: snapshot.val().username,
                email: firebaseUser.email
            };
            setUser(data);
            setUserinStorage(data);
        }, { onlyOnce: true });
    }

    return (
        <AuthContext.Provider value={{ theme, user, loading, signIn, signUp, signOut, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;