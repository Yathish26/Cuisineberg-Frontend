import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserOrder() {
    const { slug } = useParams();
    const publicCode = slug?.split('-').pop();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/cuisineberg/business/public', {
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

    if (loading) {
        return <div className="text-center py-10 text-lg text-red-500">Loading restaurant info...</div>;
    }

    if (!restaurant) {
        return <div className="text-center py-10 text-lg text-red-600">Restaurant not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[#fffbea] text-red-900 px-4 py-8">
            <div
                className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-red-200"
                style={{ marginBottom: cart.length === 0 ? '0px' : `${208 + cart.length * 30}px` }}
            >
                <h1 className="text-3xl font-bold text-red-700 mb-4">{restaurant.restaurantName}</h1>
                <p className="text-md mb-6 text-red-800">
                    📍 {restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}, {restaurant.restaurantAddress?.state} - {restaurant.restaurantAddress?.zipCode}
                </p>

                <h2 className="text-2xl font-semibold text-red-600 mb-4">Menu</h2>
                <div className="space-y-4">
                    {restaurant.menu.map((item) => (
                        <div key={item._id} className="flex justify-between items-center bg-red-50 px-4 py-2 rounded-lg border border-red-200 shadow-sm">
                            <div>
                                <p className="text-lg font-medium text-red-800">{item.itemName}</p>
                                <p className="text-sm text-red-600">₹ {item.price}</p>
                            </div>
                            <svg
                                onClick={() => addToCart(item)}
                                className='cursor-pointer'
                                xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06 1.25 1.25 6.06 1.25 12S6.06 22.75 12 22.75 22.75 17.94 22.75 12 17.94 1.25 12 1.25ZM13 8a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V8Z" fill="#b91c1c" />
                            </svg>
                        </div>
                    ))}
                </div>

                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-red-300 z-50 p-4 rounded-t-2xl transition-all duration-300 transform translate-y-0">
                        <h3 className="text-xl font-bold text-red-700 mb-4">Your Order</h3>
                        <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <li key={item._id} className="flex justify-between items-center">
                                    <span>{item.itemName} x {item.quantity}</span>
                                    <div className="flex items-center gap-3">
                                        <span>₹ {item.price * item.quantity}</span>
                                        <svg
                                            onClick={() => removeFromCart(item._id)}
                                            className='cursor-pointer'
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path d="M16 12H8" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="10" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold text-lg text-red-800 mb-4">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-xl text-lg transition">
                            Order Now
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
