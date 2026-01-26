// Authentication service
import { auth } from './firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';

// Admin email
const ADMIN_EMAIL = 'anantawijaya212@gmail.com';

// Login
export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        console.log('Attempting login for:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        console.log('User authenticated:', userCredential.user.email);

        // Normalize emails to lowercase for comparison
        const userEmail = userCredential.user.email?.toLowerCase();
        const adminEmail = ADMIN_EMAIL.toLowerCase();

        // Check if user is admin
        if (userEmail !== adminEmail) {
            console.warn('Unauthorized email:', userEmail);
            await signOut(auth);
            return { success: false, error: 'Anda bukan admin yang terdaftar' };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Login error details:', error.code, error.message);

        let errorMessage = `Login gagal: ${error.message}`;

        if (error.code === 'auth/invalid-email') {
            errorMessage = 'Format email tidak valid';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'User tidak ditemukan. Pastikan email sudah terdaftar di Firebase Authentication.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Password salah';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Email atau password salah';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Terlalu banyak percobaan gagal. Coba lagi nanti.';
        }

        return { success: false, error: `${errorMessage} (${error.code})` };
    }
}

// Logout
export async function logoutAdmin(): Promise<void> {
    await signOut(auth);
}

// Get current user
export function getCurrentUser(): User | null {
    return auth.currentUser;
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
    return user?.email === ADMIN_EMAIL;
}

// Subscribe to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}
