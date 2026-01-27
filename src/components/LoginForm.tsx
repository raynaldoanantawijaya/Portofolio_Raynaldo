import React, { useState } from 'react';
import { loginAdmin } from '../lib/authService';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await loginAdmin(email, password);

        if (result.success) {
            onLoginSuccess();
        } else {
            setError(result.error || 'Login gagal');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a2e] p-4">
            <div className="w-full max-w-md p-6 sm:p-8 bg-[#1e1e1e] rounded-2xl border border-slate-800 shadow-2xl">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-lock text-white text-2xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                    <p className="text-slate-500 mt-2">Masuk untuk mengelola portfolio</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            className="w-full px-4 py-3 bg-[#262626] border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-[#262626] border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Memproses...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i>
                                Login
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6 pt-6 border-t border-slate-800">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm px-4 py-2 rounded-lg hover:bg-slate-800"
                    >
                        <i className="fas fa-arrow-left"></i>
                        Kembali ke Website Utama
                    </a>
                </div>
            </div>
        </div>
    );
}
