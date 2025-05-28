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
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#ffe5e0] to-[#f9fafb] p-3 sm:p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-6 sm:mb-8 text-center tracking-tight drop-shadow-lg flex items-center justify-center">
                    <span className="inline-block align-middle mr-2">🍔</span>
                    Select a Restaurant
                </h1>

                {/* Search Box */}
                <div className="relative mb-8 sm:mb-10">
                    <input
                        type="text"
                        placeholder="Search restaurants, cuisines, or dishes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 sm:p-4 pl-12 sm:pl-14 border-0 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200 bg-white/90 placeholder:text-gray-400 text-base sm:text-lg transition"
                    />
                    <span className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" stroke="#fb923c" strokeWidth="2" />
                            <path d="M20 20L17 17" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </span>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition"
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M15.5 15.5L8.5 8.5M8.5 15.5L15.5 8.5" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Restaurant List */}
                <div className="mt-2 grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-2">
                    {loading ? (
                        <div className="col-span-2 flex flex-col justify-center items-center h-40">
                            {/* Circular loader around logo */}
                            <div className="relative h-16 w-16 mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-t-orange-700 border-b-orange-200 animate-spin"></div>

                                {/* Food SVG in center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/spoon-and-fork-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#f97316">
                                        <path d="M18.4998 3.00195L13.9998 7.50195L17.4998 11.002L21.9998 6.50195M15.7498 9.25195L3.99976 21.002" stroke="#f97316" stroke-width="1.5" stroke-linecap="square"></path>
                                        <path d="M20 4.99902L17.5 7.49902" stroke="#f97316" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
                                        <path d="M7.98914 8.99011C6.79472 10.1845 5.15674 10.4831 3.66377 8.99011C2.17075 7.49709 1.38801 4.77783 2.58243 3.58341C3.77685 2.38899 6.49611 3.17172 7.98914 4.66475C9.48211 6.15772 9.18356 7.79569 7.98914 8.99011ZM7.98914 8.99011L20 21.001" stroke="#f97316" stroke-width="1.5" stroke-linecap="square"></path>
                                        <path d="M9.20542 2.39669C10.0923 2.13908 11.03 2.00098 12 2.00098C13.1517 2.00098 14.2579 2.19567 15.2876 2.55394M2.04937 11.001C2.01672 11.3299 2 11.6635 2 12.001C2 14.0328 2.60598 15.9231 3.64707 17.501M7.77267 21.0661C9.05671 21.6659 10.4892 22.001 12 22.001C13.5244 22.001 14.9691 21.6599 16.262 21.0499M20.3529 17.501C21.394 15.9231 22 14.0328 22 12.001C22 11.4228 21.9509 10.8561 21.8567 10.3048" stroke="#f97316" stroke-width="1.5" stroke-linecap="square"></path>
                                    </svg>
                                </div>
                            </div>
                            <span className="text-orange-500 text-base sm:text-lg font-semibold">Finding delicious options...</span>
                        </div>
                    ) : error ? (
                        <div className="col-span-2 text-center text-orange-500 font-semibold">{error}</div>
                    ) : filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => navigate(`/order/${r.name.toLowerCase().replace(/\s+/g, '-')}-${r.publicCode || r.id}`)}
                                className="bg-white/90 border-0 cursor-pointer p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition group relative overflow-hidden"
                                style={{
                                    background: "linear-gradient(120deg, #fff7ed 60%, #ffe5e0 100%)"
                                }}
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="bg-orange-100 rounded-full p-3 sm:p-4 group-hover:bg-orange-200 transition shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/restaurant-01-solid-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#f97316">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.6226 9.36017C16.0042 9.7409 16.0043 10.3582 15.6226 10.739L4.87215 21.4644C4.4905 21.8452 3.8717 21.8452 3.49002 21.4645C3.10833 21.0837 3.10831 20.4664 3.48995 20.0857L14.2404 9.36023C14.6221 8.97947 15.2409 8.97945 15.6226 9.36017Z" fill="#f97316"></path>
                                            <path d="M18.5545 2.53556C18.9362 2.9163 18.9362 3.53361 18.5545 3.91435L15.6226 6.83921C15.0339 7.42646 14.9187 7.5596 14.8655 7.66682C14.73 7.93959 14.73 8.25984 14.8655 8.53261C14.9187 8.63983 15.0339 8.77297 15.6226 9.36022C16.2113 9.94748 16.3447 10.0624 16.4522 10.1155C16.7256 10.2507 17.0467 10.2507 17.3201 10.1155C17.4276 10.0624 17.561 9.94748 18.1497 9.36022L21.0817 6.43537C21.4633 6.05462 22.0821 6.05462 22.4638 6.43537C22.8455 6.81611 22.8455 7.43342 22.4638 7.81416L19.4359 10.8349C19.0003 11.2706 18.6237 11.6473 18.188 11.8627C17.3677 12.2682 16.4046 12.2682 15.5843 11.8627C15.1486 11.6473 14.772 11.2706 14.3364 10.8349L14.1443 10.6433C13.7076 10.2088 13.33 9.83303 13.1141 9.3984C12.7076 8.58009 12.7076 7.61934 13.1141 6.80103C13.33 6.3664 13.7076 5.99066 14.1443 5.55614L17.1724 2.53556C17.5541 2.15481 18.1729 2.15481 18.5545 2.53556Z" fill="#f97316"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5091 4.48356C20.8908 4.8643 20.8908 5.4816 20.5091 5.86235L17.5772 8.7872C17.1955 9.16795 16.5767 9.16795 16.1951 8.7872C15.8134 8.40646 15.8134 7.78916 16.1951 7.40841L19.127 4.48356C19.5087 4.10281 20.1275 4.10281 20.5091 4.48356Z" fill="#f97316"></path>
                                            <path d="M5.98998 2.40222C4.72292 2.11227 3.20469 2.16735 2.186 3.18358C1.16732 4.19981 1.11209 5.71436 1.40276 6.97836C1.70265 8.2825 2.42575 9.621 3.39379 10.5867C4.38497 11.5755 5.5166 12.0517 6.67434 11.9939C7.47581 11.9539 8.21357 11.6618 8.85602 11.2163L19.1272 21.4626C19.5088 21.8433 20.1276 21.8433 20.5093 21.4626C20.8909 21.0818 20.8909 20.4645 20.5093 20.0838L10.2381 9.83746C10.6847 9.19657 10.9776 8.46059 11.0177 7.66106C11.0757 6.50612 10.5982 5.37723 9.60706 4.38844C8.63903 3.42275 7.29728 2.70139 5.98998 2.40222Z" fill="#f97316"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg sm:text-2xl font-bold text-orange-700 group-hover:text-orange-800 transition">{r.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{r.address || 'No address available'}</p>
                                        {r.cuisine && (
                                            <span className="inline-block mt-2 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-orange-50 text-orange-500 rounded-full font-medium">
                                                {r.cuisine}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-orange-400 font-medium">No restaurants found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
