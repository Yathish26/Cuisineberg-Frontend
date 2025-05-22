import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RetailRegister() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', restaurantName: '', mobileNumber: '',
        restaurantAddress: { street: '', city: '', state: '', zipCode: '', country: '' }
    });

    const inputClass = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white";
    const labelClass = "block text-sm font-medium text-gray-700";

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.restaurantAddress) {
            setFormData(prev => ({ ...prev, restaurantAddress: { ...prev.restaurantAddress, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (res.ok) {
            setMessage('Registration successful!');
            setTimeout(() => navigate('/retail/login'), 2000);
        } else setMessage('Error: ' + result.error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-rose-50 to-white">
            <div className="max-w-md w-full bg-white/90 p-8 rounded-2xl shadow-2xl border border-rose-100">
                <h2 className="text-3xl font-extrabold text-rose-600 mb-2 text-center tracking-tight">Create Retail Account</h2>
                <p className="text-center text-gray-500 mb-6">Join Cuisineberg and grow your business</p>

                {message && (
                    <div className={`mb-4 text-center text-sm px-4 py-2 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {['name', 'email', 'password', 'restaurantName'].map(field => (
                        <div key={field}>
                            <label htmlFor={field} className={labelClass}>
                                {field === 'restaurantName' ? 'Restaurant Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                                id={field}
                                name={field}
                                autoComplete={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-rose-50/50 border-rose-200 focus:ring-rose-400`}
                                required
                                placeholder={
                                    field === 'name' ? 'Your Name' :
                                    field === 'email' ? 'you@email.com' :
                                    field === 'password' ? 'Password' :
                                    'Restaurant Name'
                                }
                            />
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-4">
                        {['street', 'city', 'state', 'zipCode', 'country'].map((field, idx) => (
                            <div key={field} className={idx < 2 ? "col-span-2" : ""}>
                                <label htmlFor={field} className={labelClass}>
                                    {field === 'zipCode' ? 'ZIP Code' : field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    autoComplete={field}
                                    value={formData.restaurantAddress[field]}
                                    onChange={handleChange}
                                    className={`${inputClass} mt-1 bg-rose-50/50 border-rose-200 focus:ring-rose-400`}
                                    required
                                    placeholder={
                                        field === 'street' ? 'Street Address' :
                                        field === 'city' ? 'City' :
                                        field === 'state' ? 'State' :
                                        field === 'zipCode' ? 'ZIP Code' :
                                        'Country'
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label htmlFor="mobileNumber" className={labelClass}>Mobile Number</label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            autoComplete="tel"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className={`${inputClass} mt-1 bg-rose-50/50 border-rose-200 focus:ring-rose-400`}
                            required
                            placeholder="e.g. +1 234 567 8901"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 px-4 rounded-xl font-semibold shadow-md transition duration-300 mt-2"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/retail/login" className="text-rose-600 font-medium hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
