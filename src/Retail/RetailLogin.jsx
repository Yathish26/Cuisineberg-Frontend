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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-orange-50 to-yellow-50">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-2xl shadow-2xl border border-red-100 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-100 rounded-full p-3 mb-2">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-1">Retail Login</h2>
          <p className="text-gray-500 text-sm">Welcome back! Please login to your account.</p>
        </div>

        {message && (
          <div className="mb-4 text-center text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg py-2 px-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-[#fffdf9] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-[#fffdf9] transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">Don't have an account?</span>
          <Link to="/retail/register" className="text-red-500 hover:underline font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
