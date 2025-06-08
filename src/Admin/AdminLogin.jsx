import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck , Key } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
            <div className="max-w-md w-full bg-white p-8 shadow-lg border border-blue-200">

                <div className="flex flex-col items-center mb-6">
                    <Key className="w-12 h-12 text-blue-600" />
                    <h2 className="text-3xl font-extrabold text-blue-700 mb-1">Admin Login</h2>
                    <p className="text-gray-500 text-sm">Sign in to your admin dashboard</p>
                </div>

                {message && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 text-center animate-pulse">
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
                            className="w-full p-3 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 transition"
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
                            className="w-full p-3 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 font-semibold shadow-md transition duration-300 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck />
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
