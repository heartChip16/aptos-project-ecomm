import { jsx as _jsx } from "react/jsx-runtime";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, } from "firebase/auth";
import { useEffect, useState, useContext, createContext } from "react";
// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyARtRsgdTkZ9ghlAMk6_IpKnl5Um27Dicw",
    authDomain: "dn3-streams-e-commerce-192ab.firebaseapp.com",
    projectId: "dn3-streams-e-commerce-192ab",
    storageBucket: "dn3-streams-e-commerce-192ab.appspot.com",
    messagingSenderId: "699008022368",
    appId: "1:699008022368:web:af9e94239a5883d4e21005",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
    const auth = useProvideAuth();
    return _jsx(AuthContext.Provider, { value: auth, children: children });
};
// ---------- Hook ----------
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
// ---------- Auth Logic ----------
function useProvideAuth() {
    const [user, setUser] = useState(null);
    const signUp = async (email, password, displayName) => {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        setUser(user);
        return user;
    };
    const signIn = async (email, password) => {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
        return user;
    };
    const signOutUser = async () => {
        await signOut(auth);
        setUser(null);
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ?? null);
        });
        return unsubscribe;
    }, []);
    return {
        user,
        signUp,
        signIn,
        signOutUser,
    };
}
export default AuthProvider;
