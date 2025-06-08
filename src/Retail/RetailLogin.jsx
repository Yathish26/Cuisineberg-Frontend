import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RetailLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('retailtoken');
    if (token) {
      navigate('/retail');
    }
  }, [navigate]);

   const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('retailtoken', data.token);
        navigate('/retail');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      localStorage.removeItem('retailtoken');
      setMessage('Error: ' + err.message);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white/90 p-8 shadow-2xl border border-blue-100 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-blue-600 mb-1">Retail Login</h2>
          <p className="text-gray-500 text-sm">Welcome back! Please login to your account.</p>
        </div>

        {message && (
          <div className="mb-4 text-center text-sm bg-blue-50 border border-blue-200 text-blue-600  py-2 px-4">
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
              placeholder="Email"
              className="w-full p-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#fffdf9] transition"
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
              className="w-full p-3 border border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#fffdf9] transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-semibold py-2.5 px-4  shadow transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-500">Don't have an account?</span>
          <Link to="/retail/register" className="text-blue-500 hover:underline font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
