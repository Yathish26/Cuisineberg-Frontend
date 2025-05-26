import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            // Submit logic here
            alert('Registered successfully!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-red-100">
                <h2 className="text-3xl font-bold text-red-600 mb-8 text-center tracking-tight">Create Account</h2>
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
                            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder="Enter your name"
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
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
                            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
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
                            className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                            placeholder="Create a password"
                        />
                        {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition duration-300 text-lg"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/login">
                        <span className="text-red-500 hover:underline font-semibold cursor-pointer">
                            Login
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}
