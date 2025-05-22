import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Order() {
    const [search, setSearch] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/restaurants`);
                const data = await res.json();

                if (res.ok) {
                    setRestaurants(data.restaurants || []);
                } else {
                    setError(data.message || 'Failed to fetch restaurants');
                }
            } catch (err) {
                setError('Error connecting to server.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff9f2] to-[#ffe5e0] p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-red-700 mb-6 text-center tracking-tight drop-shadow">
                    🍽️ Discover Restaurants
                </h1>

                {/* Search Box */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search for your favorite restaurant..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-4 pl-12 border-2 border-red-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-red-400 bg-white placeholder:text-gray-400 text-lg transition"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" stroke="#ef4444" strokeWidth="2"/>
                            <path d="M20 20L17 17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </span>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M15.5 15.5L8.5 8.5M8.5 15.5L15.5 8.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Restaurant List */}
                <div className="mt-2 grid gap-6 sm:grid-cols-2">
                    {loading ? (
                        <div className="col-span-2 flex justify-center items-center h-32">
                            <svg className="animate-spin h-8 w-8 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="#ef4444" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            <span className="text-red-500 text-lg">Loading...</span>
                        </div>
                    ) : error ? (
                        <div className="col-span-2 text-center text-red-500 font-semibold">{error}</div>
                    ) : filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => navigate(`/order/${r.name.toLowerCase().replace(/\s+/g, '-')}-${r.publicCode || r.id}`)}
                                className="bg-white border-2 border-red-100 cursor-pointer p-5 rounded-2xl shadow-md hover:shadow-xl hover:border-red-300 transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 rounded-full p-3 group-hover:bg-red-200 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                                            <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="7" r="4" stroke="#ef4444" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-red-700 group-hover:text-red-800 transition">{r.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">{r.address || 'No address available'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-red-400 font-medium">No restaurants found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
