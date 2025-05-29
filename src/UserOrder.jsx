import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Loading from './Components/Loading';
import Svg from './Components/Svgvault';

export default function UserOrder() {
    const { slug } = useParams();
    const publicCode = useMemo(() => slug?.split('-').pop(), [slug]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const nodeRef = useRef(null);
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
                                    <Svg icon="location" />
                                    <span>{restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="sticky top-4 z-10 bg-white rounded-xl mb-4 shadow-sm flex items-center px-2 py-1 border border-orange-200">
                        <Svg icon="search"/>
                        <input
                            type="text"
                            placeholder="Search for delicious dishes..."
                            className="w-full px-2 py-2 bg-transparent focus:outline-none text-sm xl:text-base"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Svg icon="cross" tcss={'cursor-pointer'} click={() => setSearch('')} />
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
                                                    <Svg icon="vegetarian" />
                                                </span>
                                            )}
                                            {item.dishType === "NV" && (
                                                <span title="Non-Vegetarian">
                                                    <Svg icon="nonvegetarian" />
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm xl:text-base text-orange-600 mt-1 font-medium">₹ {item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold py-1.5 px-3 rounded-xl transition text-sm xl:text-base shadow"
                                    >
                                        <Svg icon="plus" />
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
                                            <Svg icon="remove" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-semibold text-base sm:text-lg xl:text-xl text-gray-800 mb-3">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white py-2 rounded-xl text-base sm:text-lg xl:text-xl font-bold shadow transition">
                            Order Now
                        </button>
                        
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
                                            <Svg icon="remove" />
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
                            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white py-2 rounded-xl text-base sm:text-lg xl:text-xl font-bold shadow transition"
                        >
                            Order Now
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}