import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RetailRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        restaurantName: '',
        restaurantAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        mobileNumber: ''
    });

    const [message, setMessage] = useState(''); // State to hold the success or error message

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // If it's a nested object (like restaurantAddress), update its specific property
        if (name in formData.restaurantAddress) {
            setFormData(prevState => ({
                ...prevState,
                restaurantAddress: {
                    ...prevState.restaurantAddress,
                    [name]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const navigate = useNavigate()

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            setMessage('Registration successful!');
            setTimeout(() => {
                navigate('/retail/login');
            }, 2000);
        } else {
            setMessage('Error: ' + result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Retail Registration</h2>
                
                {/* Display the message */}
                {message && (
                    <div className={`mb-4 text-center text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                            Restaurant Name
                        </label>
                        <input
                            type="text"
                            id="restaurantName"
                            name="restaurantName"
                            value={formData.restaurantName}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your restaurant name"
                            required
                        />
                    </div>

                    {/* Address Fields */}
                    <div className="mb-4">
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                            Street Address
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.restaurantAddress.street}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter street address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.restaurantAddress.city}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter city"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.restaurantAddress.state}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter state"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.restaurantAddress.zipCode}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter zip code"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.restaurantAddress.country}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter country"
                            required
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="mb-4">
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your mobile number"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/retail/login">
                        <div className="text-orange-500 hover:underline">
                            Login
                        </div>
                    </Link>
                </p>
            </div>
        </div>
    );
}

