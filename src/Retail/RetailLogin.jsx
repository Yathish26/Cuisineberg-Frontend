import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RetailLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('retailtoken', result.token);
            navigate('/retail/dashboard');
        } else {
            setMessage('Error: ' + result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Retail Login</h2>

                {message && (
                    <div className="mb-4 text-center text-sm text-red-500">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-600 text-center">
                    Don't have an account?{' '}
                    <Link to="/retail/register" className="text-orange-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
