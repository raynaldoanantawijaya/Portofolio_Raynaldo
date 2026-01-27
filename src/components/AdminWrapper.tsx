import React, { useState, useEffect } from 'react';
import { onAuthChange, isAdmin, logoutAdmin } from '../lib/authService';
import { type User } from 'firebase/auth';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';

export default function AdminWrapper() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthChange((currentUser) => {
            setUser(currentUser);
            setIsAuthenticated(currentUser !== null && isAdmin(currentUser));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logoutAdmin();
        setIsAuthenticated(false);
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111]">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                    <p className="text-slate-400">Memuat...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - show login
    if (!isAuthenticated) {
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    // Authenticated - show dashboard with logout button
    return (
        <div>
            <AdminDashboard />
        </div>
    );
}
