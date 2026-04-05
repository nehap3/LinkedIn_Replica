import { create } from 'zustand';
import { auth, db } from '../firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    error: null,

    initializeAuth: () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch extra user data from firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        set({ user: { ...user, ...userDoc.data() }, loading: false });
                    } else {
                        set({ user, loading: false });
                    }
                } catch (err) {
                    console.error("Failed to fetch user data:", err);
                    set({ user, loading: false });
                }
            } else {
                set({ user: null, loading: false });
            }
        });
    },

    register: async (email, password, displayName) => {
        set({ error: null, loading: true });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Auth Profile
            await updateProfile(user, { displayName });

            // Create Firestore User Document
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                photoURL: '',
                headline: 'Student',
                skills: [],
                education: [],
                experience: [],
                interests: [],
                connections: []
            };
            await setDoc(doc(db, 'users', user.uid), userData);

            set({ user: { ...user, ...userData }, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    login: async (email, password) => {
        set({ error: null, loading: true });
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Wait for auth listener to set the user
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            console.error(error);
        }
    }
}));
