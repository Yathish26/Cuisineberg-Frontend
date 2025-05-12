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
        <div className="min-h-screen bg-[#fff9f2] p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">Browse Restaurants</h1>

                {/* Search Box */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-[#fffdf9] placeholder:text-gray-500"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" role="img">
                                <path d="M15.5 15.5L8.5 8.5M8.5 15.5L15.5 8.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Restaurant List */}
                <div className="mt-6 space-y-4">
                    {loading ? (
                        <p className="text-center text-red-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => navigate(`/order/${r.name.toLowerCase().replace(/\s+/g, '-')}-${r.publicCode || r.id}`)}
                                className="bg-white border cursor-pointer border-red-200 p-4 rounded-lg shadow hover:shadow-md transition"
                            >
                                <p className="text-lg font-medium text-red-700">{r.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{r.address || 'No address available'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-red-500">No restaurants found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
