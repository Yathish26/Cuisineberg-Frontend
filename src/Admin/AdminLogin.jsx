import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem('admintoken');
        if (token) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            email,
            password,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to login');
            }

            const result = await response.json();
            localStorage.setItem('admintoken', result.token);
            navigate('/admin');
        } catch (error) {
            setMessage('Failed to Login')
            setTimeout(() => {
                setMessage('')
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
            <div className="max-w-md w-full bg-white/90 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-orange-100">
                <div className="flex flex-col items-center mb-6">
                    <img src="https://img.icons8.com/ios-filled/50/ff7f50/lock-2.png" alt="Admin" className="mb-2 w-12 h-12" />
                    <h2 className="text-3xl font-extrabold text-orange-600 mb-1">Admin Login</h2>
                    <p className="text-gray-500 text-sm">Sign in to your admin dashboard</p>
                </div>
                {message && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-center animate-pulse">
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md transition duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
