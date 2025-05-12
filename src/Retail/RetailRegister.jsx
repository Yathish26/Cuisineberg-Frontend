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
        <div className="min-h-screen flex items-center justify-center bg-rose-50">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Retail Registration</h2>

                {message && (
                    <div className={`mb-4 text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {['name', 'email', 'password', 'restaurantName'].map(field => (
                        <div key={field}>
                            <label htmlFor={field} className={labelClass}>{field === 'restaurantName' ? 'Restaurant Name' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    ))}

                    {['street', 'city', 'state', 'zipCode', 'country'].map(field => (
                        <div key={field}>
                            <label htmlFor={field} className={labelClass}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type="text"
                                id={field}
                                name={field}
                                value={formData.restaurantAddress[field]}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="mobileNumber" className={labelClass}>Mobile Number</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300">
                        Register
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/retail/login" className="text-red-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
