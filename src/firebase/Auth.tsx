import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from "firebase/auth";
import { useEffect, useState, useContext, createContext, ReactNode } from "react";

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

// ---------- Context Setup ----------
interface AuthContextType {
    user: User | null;
    signUp: (email: string, password: string, displayName: string) => Promise<User>;
    signIn: (email: string, password: string) => Promise<User>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ---------- Auth Provider ----------
interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// ---------- Hook ----------
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

// ---------- Auth Logic ----------
function useProvideAuth(): AuthContextType {
    const [user, setUser] = useState<User | null>(null);

    const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        setUser(user);
        return user;
    };

    const signIn = async (email: string, password: string): Promise<User> => {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
        return user;
    };

    const signOutUser = async (): Promise<void> => {
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
