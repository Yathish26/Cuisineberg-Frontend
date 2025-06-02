import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
        setMessage({ text: '', type: '' }); // Clear message when typing
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage({ text: data.message || 'Registration failed!', type: 'error' });
                } else {
                    setMessage({ text: 'Registered successfully!', type: 'success' });
                    setForm({ name: '', email: '', password: '' });
                }
            } catch (error) {
                console.error('Registration error:', error);
                setMessage({ text: 'Something went wrong. Please try again later.', type: 'error' });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <div className="max-w-md w-full bg-white p-8 shadow-2xl border border-blue-100">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center tracking-tight">Create Account</h2>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full p-3 border  focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? 'border-blue-400' : 'border-gray-200'}`}
                            placeholder="Enter your name"
                        />
                        {errors.name && <span className="text-xs text-blue-500">{errors.name}</span>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full p-3 border  focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? 'border-blue-400' : 'border-gray-200'}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="text-xs text-blue-500">{errors.email}</span>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full p-3 border  focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.password ? 'border-blue-400' : 'border-gray-200'}`}
                            placeholder="Create a password"
                        />
                        {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                    </div>

                    {message.text && (
                        <div
                            className={`mb-4 text-sm font-medium text-center px-4 py-2  ${
                                message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-300' : 'text-blue-700 bg-blue-100 border border-blue-300'
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-4  font-semibold shadow-lg transition duration-300 text-lg"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/login">
                        <span className="text-blue-500 hover:underline font-semibold cursor-pointer">
                            Login
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}
