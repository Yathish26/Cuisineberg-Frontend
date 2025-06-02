import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Search, CircleX } from 'lucide-react'; // Ensure you have lucide-react installed

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-600 p-3 sm:p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-700 mb-6 sm:mb-8 text-center tracking-tight drop-shadow-lg flex items-center justify-center">
                    Choose Your Favorite Restaurant
                </h1>

                {/* Search Box */}
                <div className="relative mb-8 sm:mb-10">
                    <input
                        type="text"
                        placeholder="Search restaurants, cuisines, or dishes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 sm:p-4 pl-12 sm:pl-14 border-0  shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 bg-white/90 placeholder:text-gray-400 text-base sm:text-lg transition"
                    />
                    <span className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <Search size={20} />
                    </span>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
                            aria-label="Clear search"
                        >
                            <CircleX size={20} />
                        </button>
                    )}
                </div>

                {/* Restaurant List */}
                <div className="mt-2 grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-2">
                    {loading ? (
                        <div className="col-span-2 flex flex-col justify-center items-center h-40">
                            {/* Circular loader around logo */}
                            <div className="relative h-16 w-16 mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-t-blue-700 border-b-blue-200 animate-spin"></div>

                                {/* Food SVG in center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <UtensilsCrossed className="w-8 h-8 text-blue-600 " />
                                </div>
                            </div>
                            <span className="text-blue-500 text-base sm:text-lg font-semibold">Finding delicious options...</span>
                        </div>
                    ) : error ? (
                        <div className="col-span-2 text-center text-blue-500 font-semibold">{error}</div>
                    ) : filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => navigate(`/order/${r.name.toLowerCase().replace(/\s+/g, '-')}-${r.publicCode || r.id}`)}
                                className="bg-white/90 border-0 cursor-pointer p-4 sm:p-6 shadow-xl hover:shadow-2xl transition group relative overflow-hidden"
                                style={{
                                    background: "linear-gradient(120deg, #ecf2ff 60%, #dbeafe 100%)"
                                }}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 sm:p-4 group-hover:bg-blue-200 transition shadow">
                                        <UtensilsCrossed className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-blue-700 transition" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg sm:text-2xl font-semibold text-gray-700 group-hover:text-blue-800 transition">{r.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{r.address || 'No address available'}</p>
                                        {r.cuisine && (
                                            <span className="inline-block mt-2 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-blue-50 text-blue-500 rounded-full font-medium">
                                                {r.cuisine}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-blue-400 font-medium">No restaurants found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
