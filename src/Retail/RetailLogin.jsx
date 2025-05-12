import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RetailLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    res.ok ? (localStorage.setItem('retailtoken', data.token), navigate('/retail/dashboard')) 
           : setMessage('Error: ' + data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff9f2]">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Retail Login</h2>

        {message && <div className="mb-4 text-center text-sm text-red-500">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['email', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-[#fffdf9]"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/retail/register" className="text-red-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
