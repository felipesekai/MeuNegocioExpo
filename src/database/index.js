import { getDatabase, ref, set, push, onValue } from "firebase/database";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
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


export function insertClient(userId, name, phone) {
    const db = getDatabase();
    const clientsRef = ref(db, `users/${userId}/clients`);
    const newClient = push(clientsRef);
   return set(newClient, { name: name, phone: phone });
}

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
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
    return createUserWithEmailAndPassword(auth, email, password)
        
}

export async function saveUserFromStorage(user){
   return await AsyncStorage.setItem("USER", JSON.stringify(user));
}
export async function getUserFromStorage(){
   return await AsyncStorage.getItem("USER");
}

