import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
            } else {
                setMessage('Login successful! Redirecting...');
                // Save token to localStorage or context if needed
                localStorage.setItem('token', data.token);
                setTimeout(() => navigate('/profile'), 1000);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/profile');
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <div className="max-w-md w-full bg-white p-8 shadow-2xl border border-blue-100">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center tracking-tight">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    {message && <div className="text-green-600 text-sm text-center">{message}</div>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white py-3 px-4 font-semibold shadow-md transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Don't have an account?</span>
                    <Link
                        to="/register"
                        className="text-blue-500 font-semibold hover:underline transition"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
