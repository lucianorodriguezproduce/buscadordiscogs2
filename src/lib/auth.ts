import {
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        await signInWithRedirect(auth, googleProvider);
    } catch (error) {
        console.error("Error signing in with Google Redirect:", error);
        throw error;
    }
};

export const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
            await syncUserToFirestore(result.user);
            return result.user;
        }
        return null;
    } catch (error) {
        console.error("Error handling redirect result:", error);
        throw error;
    }
};

/**
 * Unified Authentication: 
 * Attempts to register the user. If they already exist, attempts to sign them in.
 */
export const authenticateUser = async (email: string, pass: string) => {
    try {
        // Attempt registration first
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        await syncUserToFirestore(user);
        return user;
    } catch (error: any) {
        // If email already in use, attempt sign in
        if (error.code === 'auth/email-already-in-use') {
            try {
                const result = await signInWithEmailAndPassword(auth, email, pass);
                const user = result.user;
                await syncUserToFirestore(user);
                return user;
            } catch (signInError) {
                console.error("Sign in fallback failed:", signInError);
                throw signInError;
            }
        }
        console.error("Authentication failed:", error);
        throw error;
    }
};

export const syncUserToFirestore = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        display_name: user.displayName || user.email.split('@')[0],
        last_login: serverTimestamp(),
    }, { merge: true });
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
};
