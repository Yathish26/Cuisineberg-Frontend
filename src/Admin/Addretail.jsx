import { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8 tracking-tight">
          Register Retail
        </h2>
        {message && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="retailName" className="block text-gray-800 font-medium mb-1">
              Retail Name
            </label>
            <input
              type="text"
              id="retailName"
              name="retailName"
              value={formData.retailName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="streetAddress" className="block text-gray-800 font-medium mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
              required
              autoComplete="off"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="city" className="block text-gray-800 font-medium mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="state" className="block text-gray-800 font-medium mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="zipCode" className="block text-gray-800 font-medium mb-1">
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="country" className="block text-gray-800 font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label htmlFor="mobileNumber" className="block text-gray-800 font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50 transition"
              required
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-lg shadow-md hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          >
            Register Retail
          </button>
        </form>
      </div>
    </div>
  );
}
