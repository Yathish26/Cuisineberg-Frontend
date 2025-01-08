import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate()  


  useEffect(() => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      navigate('/admin/login');
    }
  })
  
  const handleLogout = () => {
    localStorage.removeItem('admintoken');
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold">Cuisineberg Admin Dashboard</h1>
          <p onClick={handleLogout} className='cursor-pointer'>Logout</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Restaurant */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4">Add Restaurant</h2>
            <p className="text-gray-700 mb-4">Register a new restaurant and manage its details.</p>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition">
              Add Restaurant
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4">Reports</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Restaurants Registered</span>
                <span className="text-orange-600 font-bold">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Menu Inventories</span>
                <span className="text-orange-600 font-bold">320</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Orders Processed</span>
                <span className="text-orange-600 font-bold">1,230</span>
              </div>
            </div>
          </div>

          {/* Other Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4">Other Options</h2>
            <p className="text-gray-700 mb-4">Manage users, feedback, and system settings.</p>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition">
              Manage Options
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Cuisineberg. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
