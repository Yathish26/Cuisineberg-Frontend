import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChartLine, CalendarArrowUp } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <span className="text-blue-600 text-xl font-bold">Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
            {/* Header */}
            <header className="bg-blue-700 text-white py-4 shadow-md sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-wide flex items-center gap-3">
                        <span className="inline-block p-1">
                            {/* Manager Icon SVG - Adjusted for blue theme */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round">
                                <path d="M20 22V14.5L16.5 13H16L12.5 22H11.5L8 13H7.5L4 14.5V22"></path>
                                <path d="M12 15L11.5 19L12 20.5L12.5 19L12 15ZM12 15L11 13H13L12 15Z"></path>
                                <path d="M15.5 6.5V5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5V6.5C8.5 8.433 10.067 10 12 10C13.933 10 15.5 8.433 15.5 6.5Z"></path>
                            </svg>
                        </span>
                        Cuisineberg Admin Panel
                    </h1>
                    <div className='flex items-center gap-4'>
                        <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 text-sm shadow transition duration-300 ease-in-out border border-white/20" onClick={() => navigate('/admin/inventory')}>
                            Inventory
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 text-sm shadow transition duration-300 ease-in-out border border-white/20"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add Restaurant Card */}
                    <div className="bg-white shadow-lg p-6 border border-blue-100">
                        <div className="bg-blue-100 p-4 mb-4 flex items-center justify-center">
                            <Plus className='text-blue-700 w-8 h-8' />
                        </div>
                        <h2 className="text-xl font-bold text-blue-700 mb-2">Add Restaurant</h2>
                        <p className="text-gray-600 mb-6 text-center text-sm">Register a new restaurant and manage its details.</p>
                        <Link to="/admin/addretail" className="w-full block">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 shadow transition duration-300 ease-in-out border border-blue-800">
                                Add New Restaurant
                            </button>
                        </Link>
                    </div>

                    {/* Reports Card */}
                    <div className="bg-white shadow-lg p-6 border border-blue-100">
                        <div className="bg-blue-100 p-4 mb-4 flex items-center justify-center">
                            <ChartLine className='text-blue-700 w-8 h-8' />
                        </div>
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Reports & Analytics</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-blue-50 last:border-b-0">
                                <span className="text-gray-700">Total Restaurants:</span>
                                <span className="text-blue-700 font-bold text-lg">{totalretails}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-blue-50 last:border-b-0">
                                <span className="text-gray-700">Total Orders:</span>
                                <span className="text-blue-700 font-bold text-lg">1,230</span> {/* Placeholder */}
                            </div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white shadow-lg p-6 border border-blue-100">
                        <div onClick={() => navigate('/admin/orders')} className="bg-blue-100 cursor-pointer p-4 mb-4 flex items-center justify-center">
                            <CalendarArrowUp className='text-blue-700 w-8 h-8' />
                        </div>
                        <h2 className="text-xl font-bold text-blue-700 mb-4">Order Management</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-blue-50 last:border-b-0">
                                <span className="text-gray-700">Pending Orders:</span>
                                <span className="text-blue-700 font-bold text-lg">150</span> {/* Placeholder */}
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-blue-50 last:border-b-0">
                                <span className="text-gray-700">Completed Orders:</span>
                                <span className="text-blue-700 font-bold text-lg">1,080</span> {/* Placeholder */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* List of All Restaurants Section */}
            <section className="container mx-auto px-4 mt-10 md:mt-12">
                <div className="bg-white shadow-lg p-6 border border-blue-100">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center border-b border-blue-200 pb-4">Registered Restaurants</h2>
                    <ul className="divide-y divide-blue-100">
                        {allRestaurants.length === 0 ? (
                            <li className="py-6 text-center text-gray-500 italic">No restaurants registered yet.</li>
                        ) : (
                            allRestaurants.map((retail, index) => (
                                <li
                                    key={index}
                                    className="py-4 flex justify-between items-center hover:bg-blue-50 px-4 transition-colors"
                                >
                                    <span className="text-gray-800 font-medium text-lg">{retail.name}</span>
                                    <Link
                                        to={`/admin/retail/${retail.id}`}
                                        className="text-sm bg-blue-100 text-blue-700 px-4 py-2 font-semibold hover:bg-blue-200 transition-colors border border-blue-300"
                                    >
                                        View Details
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-700 text-white py-4 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm tracking-wide">
                        &copy; {new Date().getFullYear()} Cuisineberg. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}