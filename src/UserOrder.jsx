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
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-white text-red-900 px-4 py-6">
            <div
                className="max-w-2xl mx-auto bg-white shadow-xl rounded-3xl p-4 sm:p-6 border border-red-100 relative"
                style={{ marginBottom: cart.length === 0 ? '0px' : `${180 + cart.length * 24}px` }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-red-700 mb-1">{restaurant.restaurantName}</h1>
                        <p className="text-sm sm:text-base text-red-700 flex items-center gap-1">
                            <span className="inline-block text-lg">📍</span>
                            <span>{restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}, {restaurant.restaurantAddress?.state} - {restaurant.restaurantAddress?.zipCode}</span>
                        </p>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Search dishes..."
                    className="w-full mb-4 px-4 py-2 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <h2 className="text-xl sm:text-2xl font-semibold text-red-600 mb-3">Menu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMenu.length > 0 ? filteredMenu.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-row sm:flex-col w-full justify-between bg-red-50 p-3 rounded-2xl border border-red-100 shadow hover:shadow-md transition gap-3"
                        >
                            {item.photoURL && (
                                <img
                                    src={item.photoURL}
                                    alt={item.itemName}
                                    className="w-32 h-32 sm:w-full sm:h-36 object-cover rounded-xl bg-white"
                                />
                            )}

                            <div className="flex flex-col justify-between w-full">
                                <div>
                                    <p className="text-base sm:text-lg font-medium text-red-800">{item.itemName}</p>
                                    <p className="text-xs sm:text-sm text-red-600 mt-1">₹ {item.price}</p>
                                </div>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-xl transition text-sm shadow"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                        <path fill="#fff" d="M13 8a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V8Z" />
                                    </svg>
                                    Add
                                </button>
                            </div>
                        </div>


                    )) : (
                        <p className="text-center col-span-2 text-sm text-red-500">No items match your search.</p>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_24px_rgba(185,28,28,0.10)] border-t border-red-200 z-50 p-4 sm:p-6 rounded-t-3xl transition-all duration-300 transform translate-y-0 max-w-full sm:max-w-md mx-auto">
                        <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3">Your Order</h3>
                        <ul className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <li key={item._id} className="flex justify-between items-center text-sm sm:text-base">
                                    <span className="truncate">{item.itemName} <span className="font-semibold text-red-700">x {item.quantity}</span></span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">₹ {item.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="p-1 rounded-full hover:bg-red-100 transition"
                                            aria-label="Remove"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="#b91c1c" strokeWidth="2" />
                                                <path d="M16 12H8" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold text-base sm:text-lg text-red-800 mb-3">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 rounded-xl text-base sm:text-lg font-bold shadow transition">
                            Order Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}