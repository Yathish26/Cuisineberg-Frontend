import React, { useState } from 'react';

export default function AddRetail() {
  const [formData, setFormData] = useState({
    retailName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    mobileNumber: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('admintoken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/addretail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register retail.');
      }

      const data = await response.json();
      setMessage(data.message || 'Retail registered successfully.');
      setFormData({
        retailName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        mobileNumber: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">Register Retail</h2>
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="retailName" className="block text-gray-700 font-medium mb-2">Retail Name</label>
          <input
            type="text"
            id="retailName"
            name="retailName"
            value={formData.retailName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="streetAddress" className="block text-gray-700 font-medium mb-2">Street Address</label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="zipCode" className="block text-gray-700 font-medium mb-2">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="mobileNumber" className="block text-gray-700 font-medium mb-2">Mobile Number</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Register Retail
        </button>
      </form>
    </div>
  );
}
