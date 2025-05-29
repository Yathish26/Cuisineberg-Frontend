import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Loading from './Components/Loading';

export default function UserOrder() {
    const { slug } = useParams();
    const publicCode = useMemo(() => slug?.split('-').pop(), [slug]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const nodeRef = useRef(null);
    const [orderMode, setOrderMode] = useState(false);
    const [pickupTime, setPickupTime] = useState('');
    const [paymentType, setPaymentType] = useState('');

    useEffect(() => {
        let ignore = false;
        const fetchRestaurant = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/business/public`, {
                    headers: { 'x-pub-key': publicCode },
                });
                if (!ignore) setRestaurant(res.data);
            } catch (err) {
                if (!ignore) setRestaurant(null);
                console.error('Failed to fetch restaurant:', err);
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        if (publicCode) fetchRestaurant();
        return () => { ignore = true; };
    }, [publicCode]);

    const filteredMenu = useMemo(() => {
        if (!restaurant) return [];
        const s = search.toLowerCase();
        return restaurant.menu.filter(item => item.itemName.toLowerCase().includes(s));
    }, [restaurant, search]);

    const totalAmount = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    );

    const addToCart = useCallback((item) => {
        setCart(prevCart => {
            const idx = prevCart.findIndex(i => i._id === item._id);
            if (idx > -1) {
                const updated = [...prevCart];
                updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
                return updated;
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((itemId) => {
        setCart(prevCart =>
            prevCart
                .map(i => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
                .filter(i => i.quantity > 0)
        );
    }, []);

    useEffect(() => {
        if (cart.length === 0) {
            setOrderMode(false);
        }
    }, [cart.length]);

    if (loading) return <Loading />;
    if (!restaurant) return <div className="text-center py-10 text-lg text-red-600">Restaurant not found.</div>;

    const showCart = cart.length > 0;

    const Pickup = () => {
        const handleTimeChange = (e) => {
            setPickupTime(e.target.value);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Pickup Time:', pickupTime);
            console.log('Payment Type:', paymentType);
        };
        return (
            <div className="bg-white h-fit mt-4 w-full max-w-md mx-auto p-4 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">🚗 Pickup</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700">Pickup Time</label>
                        <input
                            type="time"
                            id="pickupTime"
                            name="pickupTime"
                            value={pickupTime}
                            onChange={handleTimeChange}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                    </div>

                    {pickupTime && (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Select Payment Type</p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 px-4 rounded-full font-semibold shadow-sm text-white transition ${paymentType === 'payNow' ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'
                                            }`}
                                        onClick={() => setPaymentType('payNow')}
                                    >
                                        Pay Now
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-2 px-4 rounded-full font-semibold shadow-sm text-white transition ${paymentType === 'payAtPickup' ? 'bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'
                                            }`}
                                        onClick={() => setPaymentType('payAtPickup')}
                                    >
                                        Pay at Pickup
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-yellow-100 to-white text-gray-900 px-2 lg:px-6 py-3 flex gap-4 justify-center lg:pb-0 ${showCart ? 'pb-96' : ''}`}
        >
            <div className="w-full max-w-2xl xl:max-w-4xl 2xl:max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-3 sm:p-6 border border-orange-100 relative lg:flex lg:gap-6 "
            >
                {/* Left Section: Menu and Header */}
                <div className="flex-1">
                    {/* Restaurant Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-orange-600 mb-1">
                                    {restaurant.restaurantName}
                                </h1>
                                <p className="text-xs sm:text-sm xl:text-base text-gray-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#f97316">
                                        <path d="M5 16C3.7492 16.6327 3 17.4385 3 18.3158C3 20.3505 7.02944 22 12 22C16.9706 22 21 20.3505 21 18.3158C21 17.4385 20.2508 16.6327 19 16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 10V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="6" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="sticky top-4 z-10 bg-white rounded-xl mb-4 shadow-sm flex items-center px-2 py-1 border border-orange-200">
                        <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" />
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for delicious dishes..."
                            className="w-full px-2 py-2 bg-transparent focus:outline-none text-sm xl:text-base"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <svg onClick={() => setSearch('')} className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/cancel-01-solid-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#f5a623">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 10.2623L18.0123 4.25L19.75 5.98775L13.7377 12L19.75 18.0123L18.0123 19.75L12 13.7377L5.98775 19.75L4.25 18.0123L10.2623 12L4.25 5.98775L5.98775 4.25L12 10.2623Z" fill="#f5a623"></path>
                        </svg>
                    </div>

                    {/* Menu */}
                    <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-orange-500 mb-3">Menu</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {filteredMenu.length > 0 ? filteredMenu.map(item => (
                            <div
                                key={item._id}
                                className="flex flex-row sm:flex-col w-full justify-between bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-2xl border border-orange-100 shadow hover:shadow-lg transition gap-3"
                            >
                                {item.photoURL ? (
                                    <img
                                        src={item.photoURL}
                                        alt={item.itemName}
                                        className="w-24 h-24 sm:w-full sm:h-36 xl:h-48 object-cover rounded-xl bg-white shadow"
                                    />
                                ) : (
                                    <div className="w-24 h-24 sm:w-full sm:h-36 xl:h-48 flex items-center justify-center rounded-xl bg-orange-100 text-orange-400 text-3xl font-bold">
                                        🍽️
                                    </div>
                                )}

                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-base sm:text-lg xl:text-xl font-semibold text-gray-800">{item.itemName}</p>
                                            {item.dishType === "V" && (
                                                <span title="Vegetarian">
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#0F8A65" />
                                                        <circle cx="8" cy="8" r="4" fill="#0F8A65" />
                                                    </svg>
                                                </span>
                                            )}
                                            {item.dishType === "NV" && (
                                                <span title="Non-Vegetarian">
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#E43B4F" />
                                                        <path d="M3 12L8 4L13 12H3Z" fill="#E43B4F" />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm xl:text-base text-orange-600 mt-1 font-medium">₹ {item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold py-1.5 px-3 rounded-xl transition text-sm xl:text-base shadow"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                            <path fill="#fff" d="M13 8a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V8Z" />
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center col-span-2 xl:col-span-3 2xl:col-span-4 text-sm xl:text-base text-orange-400">No items match your search.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar Cart - Desktop */}
            <CSSTransition
                in={showCart}
                timeout={300}
                classNames="cart-sidebar"
                unmountOnExit
                nodeRef={nodeRef}
            >
                <div
                    ref={nodeRef}
                    className="hidden lg:block w-full max-w-sm sticky top-4 self-start  h-fit"
                >
                    <div className='bg-white border border-orange-200 shadow-2xl rounded-3xl p-4'>
                        <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-orange-600 mb-3">Your Order</h3>
                        <ul className="space-y-2 mb-3 max-h-64 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <li key={item._id} className="flex justify-between items-center text-sm sm:text-base xl:text-lg">
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
                        <div className="flex justify-between font-semibold text-base sm:text-lg xl:text-xl text-gray-800 mb-3">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button onClick={() => setOrderMode(!orderMode)} className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white py-2 rounded-xl text-base sm:text-lg xl:text-xl font-bold shadow transition">
                            Order Now
                        </button>
                        {orderMode && (
                            <div className="bg-[#f5e9e0] mt-3 border border-orange-200 p-3 sm:p-4 rounded-xl transition-all duration-300 transform translate-y-0 max-w-full sm:max-w-md xl:max-w-lg mx-auto">
                                <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">Choose your order method</h3>
                                <ul className="flex justify-center gap-4">
                                    {/* <li>
                                        <button
                                            className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                            onClick={() => setOrderMode('dineIn')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/hotel-bell-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                                <path d="M2 20.5H22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M4 14.5C4 10.0817 7.58172 6.5 12 6.5C16.4183 6.5 20 10.0817 20 14.5C20.8656 14.5 21.6043 15.1258 21.7466 15.9796L22 17H2L2.2534 15.9796C2.3957 15.1258 3.13442 14.5 4 14.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M12 6.5V3.5M12 3.5H9.5M12 3.5H14.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M19 5.5L18.5 6.5M21.5 8L20.5009 8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M5 5.5L5.5 6.5M3.49913 8.5L2.5 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            <p>Dine In</p>
                                        </button>
                                    </li> */}
                                    <li>
                                        <button
                                            className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                            onClick={() => setOrderMode('pickup')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/shopping-bag-03-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                                <path d="M7.5 9.5L7.71501 5.98983C7.87559 3.74176 9.7462 2 12 2C14.2538 2 16.1244 3.74176 16.285 5.98983L16.5 9.5" stroke="#ffffff" stroke-width="1.5"></path>
                                                <path d="M20.0318 7H4.00672L2.00105 21.8775C1.99233 21.9421 2.03916 22 2.10015 22H21.8998C21.9607 22 22.0075 21.9423 21.999 21.8778L20.0318 7Z" stroke="#ffffff" stroke-width="1.5"></path>
                                            </svg>
                                            <p>Pickup</p>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                            onClick={() => setOrderMode('delivery')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/delivery-truck-01-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                                <path d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                                <path d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                                <path d="M14.5 17.5H9.5M19.5 17.5H22V13C22 9.41015 19 6.5 15 6.5M2 4H14C14.5523 4 15 4.44772 15 5V16M4.5 17.4885L3.00461 17.4954C2.45053 17.4979 2 17.0495 2 16.4954V13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path d="M2 7H8M2 10H6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            <p>Delivery</p>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <Pickup />
                </div>

            </CSSTransition>

            {/* Mobile Bottom Cart */}
            {showCart && (
                <>
                    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_24px_rgba(251,146,60,0.10)] border-t border-orange-200 z-50 p-4 sm:p-6 rounded-t-3xl transition-all duration-300 transform translate-y-0 max-w-full sm:max-w-md xl:max-w-2xl 2xl:max-w-3xl mx-auto lg:hidden">
                        <h3 className="text-lg sm:text-xl xl:text-2xl font-bold text-orange-600 mb-3">Your Order</h3>
                        <ul className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <li key={item._id} className="flex justify-between items-center text-sm sm:text-base xl:text-lg">
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
                        <div className="flex justify-between font-semibold text-base sm:text-lg xl:text-xl text-gray-800 mb-3">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button
                            onClick={() => setOrderMode(prev => !prev)}
                            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white py-2 rounded-xl text-base sm:text-lg xl:text-xl font-bold shadow transition"
                        >
                            Order Now
                        </button>
                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${orderMode ? 'max-h-80 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                } bg-[#f5e9e0] z-50 p-3 sm:p-4 rounded-t-2xl max-w-full sm:max-w-md xl:max-w-lg mx-auto lg:hidden`}
                        >
                            {orderMode && (
                                <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">
                                    How would you like to receive your order?
                                </h3>
                            )}
                            <ul className="flex justify-center gap-4">
                                <li>
                                    <button
                                        className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                        onClick={() => setOrderMode('dineIn')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/hotel-bell-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                            <path d="M2 20.5H22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M4 14.5C4 10.0817 7.58172 6.5 12 6.5C16.4183 6.5 20 10.0817 20 14.5C20.8656 14.5 21.6043 15.1258 21.7466 15.9796L22 17H2L2.2534 15.9796C2.3957 15.1258 3.13442 14.5 4 14.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M12 6.5V3.5M12 3.5H9.5M12 3.5H14.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M19 5.5L18.5 6.5M21.5 8L20.5009 8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M5 5.5L5.5 6.5M3.49913 8.5L2.5 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <p>Dine In</p>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                        onClick={() => setOrderMode('pickup')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/shopping-bag-03-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                            <path d="M7.5 9.5L7.71501 5.98983C7.87559 3.74176 9.7462 2 12 2C14.2538 2 16.1244 3.74176 16.285 5.98983L16.5 9.5" stroke="#ffffff" stroke-width="1.5"></path>
                                            <path d="M20.0318 7H4.00672L2.00105 21.8775C1.99233 21.9421 2.03916 22 2.10015 22H21.8998C21.9607 22 22.0075 21.9423 21.999 21.8778L20.0318 7Z" stroke="#ffffff" stroke-width="1.5"></path>
                                        </svg>
                                        <p>Pickup</p>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                        onClick={() => setOrderMode('delivery')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/delivery-truck-01-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                            <path d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                            <path d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                            <path d="M14.5 17.5H9.5M19.5 17.5H22V13C22 9.41015 19 6.5 15 6.5M2 4H14C14.5523 4 15 4.44772 15 5V16M4.5 17.4885L3.00461 17.4954C2.45053 17.4979 2 17.0495 2 16.4954V13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M2 7H8M2 10H6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <p>Delivery</p>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}