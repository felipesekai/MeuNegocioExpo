import { getDatabase, ref, set, push, update, get, remove, } from "firebase/database";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithCredential,
    signOut
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
// export const database = getDatabase();

export function insertUser(userId, name, email) {
    const db = getDatabase();
    return set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
    });
}

//client
export function insertClient(userId, name, phone) {
    const db = getDatabase();
    const clientsRef = ref(db, `users/${userId}/clients`);
    const newClient = push(clientsRef);
    return set(newClient, { name: name, phone: phone });
}
export function updateClient(userId, clientId, name, phone) {
    const db = getDatabase();
    const clientsRef = ref(db, `users/${userId}/clients/${clientId}`);
    return update(clientsRef, { name: name, phone: phone });
}
export function deleteClient(userId, clientId, name, phone) {
    const db = getDatabase();
    const clientsRef = ref(db, `users/${userId}/clients/${clientId}`);
    return remove(clientsRef);
}
export function getAllClients(userId) {
    const db = getDatabase();
    const clientsRef = ref(db, `users/${userId}/clients/`);
    return get(clientsRef);
}
//

//login e cad
export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            signInWithCredential(auth, token)
            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}
export function signInEmail(email, password) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)

}
export function signUpEmail(email, password) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
}
export function signOutUser() {
    const auth = getAuth();
    return signOut(auth);
}
//

// AsyncStorage

export async function saveUserFromStorage(user) {
    return await AsyncStorage.setItem("USER", JSON.stringify(user));
}
export async function getUserFromStorage() {
    return await AsyncStorage.getItem("USER");
}
//
//produtos
export function insertProduct(userId, product) {
    const db = getDatabase();
    const productRef = ref(db, `users/${userId}/products`);
    const newProduct = push(productRef);
    return set(newProduct, product);

}
export function updateProduct(userId, product) {
    const db = getDatabase();
    const productRef = ref(db, `users/${userId}/products/${product.key}`);
    return update(productRef, product);

}
export function deleteProduct(userId, product) {
    const db = getDatabase();
    const productRef = ref(db, `users/${userId}/products/${product.key}`);
    return remove(productRef);

}
export function getAllProduct(userId) {
    const db = getDatabase();
    const productRef = ref(db, `users/${userId}/products`);
    return get(productRef);

}
//pedidos
export function insertNewOrder(userId,client, data){
    const db = getDatabase();
    const orderedRef = ref(db, `users/${userId}/ordered`);
    const newOrder = push(orderedRef);
    return set(newOrder, {clientId: client.id, clientName: client.name, products: data.products, date: data.date, total: data.total});

}
export function updateOrder(userId, data){
    const db = getDatabase();
    const orderedRef = ref(db, `users/${userId}/ordered/${data.id}`);
    return update(orderedRef, data);

}
//
export function deleteOrder(userId,data){
    const db = getDatabase();
    const orderedRef = ref(db, `users/${userId}/ordered/${data.id}`);   
    return remove(orderedRef);

}


