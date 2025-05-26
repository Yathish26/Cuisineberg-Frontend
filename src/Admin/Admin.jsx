import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Admin() {
  const [totalretails, setTotalRetails] = useState('');
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchserver = async () => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('admintoken');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      setTotalRetails(data.totalRestaurants);
      setAllRestaurants(data.restaurantNames);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchserver();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admintoken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <span className="text-orange-600 text-xl font-bold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-orange-600 text-white py-5 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="inline-block bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/manager-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                <path d="M20 22.0002V14.5002L16.5 13.0002H16L12.5 22.0002H11.5L8 13.0002H7.5L4 14.5002V22.0002" stroke="#ffffff" stroke-width="1.5" stroke-linecap="square"></path>
                <path d="M12 15L11.5 19L12 20.5L12.5 19L12 15ZM12 15L11 13H13L12 15Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="square"></path>
                <path d="M15.5 6.50012V5.50012C15.5 3.56713 13.933 2.00012 12 2.00012C10.067 2.00012 8.5 3.56713 8.5 5.50012V6.50012C8.5 8.43312 10.067 10.0001 12 10.0001C13.933 10.0001 15.5 8.43312 15.5 6.50012Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
              </svg>
            </span>
            Cuisineberg Admin
          </h1>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add Restaurant */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-orange-100 hover:shadow-xl transition">
            <div className="bg-orange-100 rounded-full p-4 mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            </div>
            <h2 className="text-xl font-bold text-orange-600 mb-2">Add Restaurant</h2>
            <p className="text-gray-600 mb-6 text-center">Register a new restaurant and manage its details.</p>
            <Link to="/admin/addretail" className="w-full">
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow transition">
                Add Restaurant
              </button>
            </Link>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 hover:shadow-xl transition">
            <div className="bg-orange-100 rounded-full p-4 mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/analysis-text-link-solid-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#f97316">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 4.5H7.5V2.5H10.5V4.5Z" fill="#f97316"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 7.5H7.5V5.5H13.5V7.5Z" fill="#f97316"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 17.5855V2.5H2.5V20.5C2.5 21.0523 2.94772 21.5 3.5 21.5H21.5V19.5H5.54464L10.6861 12.8896L13.9 15.3C14.2981 15.5986 14.8552 15.559 15.2071 15.2071L20.2071 10.2071L18.7929 8.79289L14.4062 13.1796L11.1 10.7C10.6636 10.3727 10.0455 10.4555 9.71065 10.8861L4.5 17.5855Z" fill="#f97316"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-orange-600 mb-4">Reports</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Restaurants</span>
                <span className="text-orange-600 font-bold text-lg">{totalretails}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Orders</span>
                <span className="text-orange-600 font-bold text-lg">1,230</span>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-orange-100 to-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-orange-100 hover:shadow-xl transition">
            <div className="bg-orange-100 rounded-full p-4 mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-orange-600 mb-2">Welcome, Admin!</h2>
            <p className="text-gray-600 text-center">Manage restaurants, view reports, and keep Cuisineberg running smoothly.</p>
          </div>
        </div>
      </main>

      {/* List of All Restaurants */}
      <section className="container mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Restaurants Overview</h2>
          <ul className="divide-y divide-orange-100">
            {allRestaurants.length === 0 ? (
              <li className="py-6 text-center text-gray-400">No restaurants registered yet.</li>
            ) : (
              allRestaurants.map((retail, index) => (
                <li
                  key={index}
                  className="py-4 flex justify-between items-center hover:bg-orange-50 rounded-lg px-2 transition-colors"
                >
                  <span className="text-gray-700 font-medium">{retail.name}</span>
                  <Link
                    to={`/admin/retail/${retail.id}`}
                    className="text-sm bg-orange-100 text-orange-600 px-4 py-1 rounded-full font-semibold hover:bg-orange-200 transition"
                  >
                    Details
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-5 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm tracking-wide">
            &copy; {new Date().getFullYear()} Cuisineberg. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
