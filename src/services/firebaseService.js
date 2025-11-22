import { getDatabase, ref, set, get, remove, query, orderByChild, startAt } from "firebase/database";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========== User ==========
export function insertUser(userId, name, email) {
    const db = getDatabase();
    return set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
    });
}

// ========== Client ==========
export function upsertClient(userId, client) {
    const db = getDatabase();
    const clientRef = ref(db, `users/${userId}/clients/${client.id}`);
    return set(clientRef, { name: client.name, phone: client.phone, updated_at: client.updated_at, _status: client._status });
}
export function deleteClient(userId, clientId) {
    const db = getDatabase();
    const clientRef = ref(db, `users/${userId}/clients/${clientId}`);
    return remove(clientRef);
}
export async function getFBUpdatedClients(userId, timestamp) {
    const db = getDatabase();
    const clientsRef = ref(db, `users/${userId}/clients/`);
    const q = query(clientsRef, orderByChild('updated_at'), startAt(timestamp));
    const snapshot = await get(q);
    return snapshot.val();
}


// ========== Product ==========
export function upsertProduct(userId, product) {
    const db = getDatabase();
    const productRef = ref(db, `users/${userId}/products/${product.id}`);
    return set(productRef, { name: product.name, price: product.price, updated_at: product.updated_at, _status: product._status });
}
export function deleteProduct(userId, productId) {
    const db = getDatabase();
    const productRef = ref(db, `users/${userId}/products/${productId}`);
    return remove(productRef);
}
export async function getFBUpdatedProducts(userId, timestamp) {
    const db = getDatabase();
    const productsRef = ref(db, `users/${userId}/products/`);
    const q = query(productsRef, orderByChild('updated_at'), startAt(timestamp));
    const snapshot = await get(q);
    return snapshot.val();
}

// ========== Order ==========
export function upsertOrder(userId, order) {
    const db = getDatabase();
    const orderedRef = ref(db, `users/${userId}/ordered/${order.id}`);
    return set(orderedRef, {
        clientId: order.client_id,
        status: order.status,
        totalAmount: order.totalAmount || 0,
        orderDate: order.orderDate || null,
        products: order.products || [],
        updated_at: order.updated_at,
        _status: order._status,
    });
}
export function deleteOrder(userId, orderId) {
    const db = getDatabase();
    const orderedRef = ref(db, `users/${userId}/ordered/${orderId}`);
    return remove(orderedRef);
}
export async function getFBUpdatedOrders(userId, timestamp) {
    const db = getDatabase();
    const ordersRef = ref(db, `users/${userId}/ordered/`);
    const q = query(ordersRef, orderByChild('updated_at'), startAt(timestamp));
    const snapshot = await get(q);
    return snapshot.val();
}

// ========== Auth ==========
export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider);
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

// ========== AsyncStorage ==========
export async function saveUserFromStorage(user) {
    if (user) {
        return await AsyncStorage.setItem("USER", JSON.stringify(user));
    } else {
        return await AsyncStorage.removeItem("USER");
    }
}
export async function getUserFromStorage() {
    return await AsyncStorage.getItem("USER");
}
