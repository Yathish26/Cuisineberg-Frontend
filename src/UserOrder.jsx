import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserOrder() {
    const { slug } = useParams();
    const publicCode = slug?.split('-').pop();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/business/public`, {
                    headers: {
                        'x-pub-key': publicCode,
                    },
                });
                setRestaurant(res.data);
            } catch (err) {
                console.error('Failed to fetch restaurant:', err);
            } finally {
                setLoading(false);
            }
        };

        if (publicCode) {
            fetchRestaurant();
        }
    }, [publicCode]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existing = prevCart.find((i) => i._id === item._id);
            if (existing) {
                return prevCart.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            return prevCart
                .map((i) => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
                .filter((i) => i.quantity > 0);
        });
    };

    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) return <div className="text-center py-10 text-lg text-red-500 animate-pulse">Loading restaurant info...</div>;
    if (!restaurant) return <div className="text-center py-10 text-lg text-red-600">Restaurant not found.</div>;

    const filteredMenu = restaurant.menu.filter(item =>
        item.itemName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-100 to-white text-gray-900 px-2 py-3">
            <div
                className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl p-3 sm:p-6 border border-orange-100 relative"
                style={{ marginBottom: cart.length === 0 ? '0px' : `${180 + cart.length * 24}px` }}
            >
                {/* Restaurant Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center shadow-lg text-2xl font-bold text-white">
                            {restaurant.restaurantName?.[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{restaurant.restaurantName}</h1>
                            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                <svg className="inline-block w-5 h-5 text-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"></path>
                                    <circle cx="12" cy="9" r="2.5"></circle>
                                </svg>
                                <span>{restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="sticky top-2 z-10 bg-white rounded-xl mb-4 shadow-sm flex items-center px-2 py-1 border border-orange-200">
                    <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" />
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for delicious dishes..."
                        className="w-full px-2 py-2 bg-transparent focus:outline-none text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Menu */}
                <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-3">Menu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMenu.length > 0 ? filteredMenu.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-row sm:flex-col w-full justify-between bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-2xl border border-orange-100 shadow hover:shadow-lg transition gap-3"
                        >
                            {item.photoURL ? (
                                <img
                                    src={item.photoURL}
                                    alt={item.itemName}
                                    className="w-24 h-24 sm:w-full sm:h-36 object-cover rounded-xl bg-white shadow"
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-full sm:h-36 flex items-center justify-center rounded-xl bg-orange-100 text-orange-400 text-3xl font-bold">
                                    🍽️
                                </div>
                            )}

                            <div className="flex flex-col justify-between w-full">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base sm:text-lg font-semibold text-gray-800">{item.itemName}</p>
                                        {/* Veg/Non-Veg Symbol */}
                                        {item.dishType === "V" && (
                                            <span title="Vegetarian" className="inline-block">
                                                <svg width="18" height="18" viewBox="0 0 18 18">
                                                    <rect x="2" y="2" width="14" height="14" rx="3" fill="#2ecc40" stroke="#2ecc40" strokeWidth="1.5"/>
                                                    <circle cx="9" cy="9" r="4" fill="#fff" />
                                                </svg>
                                            </span>
                                        )}
                                        {item.dishType === "NV" && (
                                            <span title="Non-Vegetarian" className="inline-block">
                                                <svg width="18" height="18" viewBox="0 0 18 18">
                                                    <rect x="2" y="2" width="14" height="14" rx="3" fill="#e74c3c" stroke="#e74c3c" strokeWidth="1.5"/>
                                                    <circle cx="9" cy="9" r="4" fill="#fff" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-orange-600 mt-1 font-medium">₹ {item.price}</p>
                                </div>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold py-1.5 px-3 rounded-xl transition text-sm shadow"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path fill="#fff" d="M13 8a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V8Z" />
                                    </svg>
                                    Add
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center col-span-2 text-sm text-orange-400">No items match your search.</p>
                    )}
                </div>

                {/* Cart / Order Bar */}
                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_24px_rgba(251,146,60,0.10)] border-t border-orange-200 z-50 p-4 sm:p-6 rounded-t-3xl transition-all duration-300 transform translate-y-0 max-w-full sm:max-w-md mx-auto">
                        <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-3">Your Order</h3>
                        <ul className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <li key={item._id} className="flex justify-between items-center text-sm sm:text-base">
                                    <span className="truncate">{item.itemName} <span className="font-semibold text-orange-600">x {item.quantity}</span></span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">₹ {item.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="p-1 rounded-full hover:bg-orange-100 transition"
                                            aria-label="Remove"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" />
                                                <path d="M16 12H8" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold text-base sm:text-lg text-gray-800 mb-3">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white py-2 rounded-xl text-base sm:text-lg font-bold shadow transition">
                            Order Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}