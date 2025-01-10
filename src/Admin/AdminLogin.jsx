import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

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
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Admin Login</h2>
                {message && <p className="text-red-500 my-2 text-center">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
