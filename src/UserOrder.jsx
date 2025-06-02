import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Loading from './Components/Loading';
import { Navigation, Search, X, Plus, CircleMinus, CookingPot, LeafyGreen, Ham, ShoppingCart } from 'lucide-react'; // Using Lucide React for modern icons

export default function UserOrder() {
    const { slug } = useParams();
    const publicCode = useMemo(() => slug?.split('-').pop(), [slug]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const nodeRef = useRef(null); // Ref for desktop cart animation
    const mobileCartRef = useRef(null); // Ref for mobile cart animation
    const navigate = useNavigate();

    const [itemAddedAnimation, setItemAddedAnimation] = useState(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentTranslateY, setCurrentTranslateY] = useState(0); // Tracks current drag translation

    // New state to control if the mobile cart is expanded or collapsed to a bar
    const [isMobileCartExpanded, setIsMobileCartExpanded] = useState(true);

    const [veg, setVeg] = useState(false);
    const [nonVeg, setNonVeg] = useState(false);

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
        let filtered = restaurant.menu.filter(item => item.itemName.toLowerCase().includes(s));
        if (veg && !nonVeg) {
            filtered = filtered.filter(item => item.dishType === 'V');
        } else if (!veg && nonVeg) {
            filtered = filtered.filter(item => item.dishType === 'NV');
        }

        return filtered;
    }, [restaurant, search, veg, nonVeg]);


    const totalAmount = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    );

    useEffect(() => {
        const storedCart = localStorage.getItem(publicCode);
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
            }
        }
    }, [publicCode]);

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
        setItemAddedAnimation(item._id);
        const timer = setTimeout(() => setItemAddedAnimation(null), 500);
        setIsMobileCartExpanded(true); // Expand cart when an item is added
        return () => clearTimeout(timer);
    }, []);

    const removeFromCart = useCallback((itemId) => {
        setCart(prevCart =>
            prevCart
                .map(i => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
                .filter(i => i.quantity > 0)
        );
    }, []);

    const saveCartToLocalStorage = () => {
        if (Array.isArray(cart) && cart.length > 0) {
            localStorage.setItem(publicCode, JSON.stringify(cart));
        }
        navigate(`/checkout/${publicCode}`);
    };

    useEffect(() => {
        if (Array.isArray(cart) && cart.length > 0) {
            localStorage.setItem(publicCode, JSON.stringify(cart));
            setIsMobileCartExpanded(true); // Ensure cart is expanded if items exist
        } else if (cart.length === 0) {
            localStorage.removeItem(publicCode);
            setIsMobileCartExpanded(false); // Collapse cart if empty
        }
    }, [cart, publicCode]);

    // Mobile cart pull-down gesture handlers
    const handleTouchStart = useCallback((e) => {
        if (e.target.closest('.mobile-cart-handle')) {
            setIsDragging(true);
            setStartY(e.touches[0].clientY);
            if (mobileCartRef.current) {
                mobileCartRef.current.style.transition = 'none'; // Disable CSS transition during drag
            }
        }
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;
        const diffY = e.touches[0].clientY - startY;
        const newTranslateY = Math.max(0, diffY); // Only allow pulling down
        setCurrentTranslateY(newTranslateY);
        if (mobileCartRef.current) {
            mobileCartRef.current.style.transform = `translateY(${newTranslateY}px)`;
        }
    }, [isDragging, startY]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;

        if (mobileCartRef.current) {
            mobileCartRef.current.style.transition = 'transform 0.3s ease-out'; // Re-enable transition
        }

        // Determine if cart should collapse or snap back to expanded
        if (currentTranslateY > 100) { // Threshold for collapsing (e.g., 100px)
            setIsMobileCartExpanded(false);
        } else {
            setIsMobileCartExpanded(true); // Snap back to expanded
        }
        setCurrentTranslateY(0); // Reset translation for next drag
        setIsDragging(false);
    }, [isDragging, currentTranslateY]);

    // Determines if any cart UI should be shown
    const showCart = cart.length > 0;


    if (loading) return <Loading />;
    if (!restaurant) return <div className="text-center py-10 text-lg text-blue-600">Restaurant not found.</div>;


    return (
        <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 font-inter sm:px-4 lg:px-8 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6 justify-center ${showCart ? 'pb-72' : ""}`}>
            <div
                className="w-full max-w-2xl xl:max-w-4xl 2xl:max-w-6xl mx-auto bg-white shadow-xl p-4 sm:p-6 border border-gray-100 relative flex flex-col lg:flex-row lg:gap-8"
            >
                {/* Left Section: Menu and Header */}
                <div className="flex-1"> {/* This div will now scroll */}
                    {/* Restaurant Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-gray-700 mb-1">
                                    {restaurant.restaurantName}
                                </h1>
                                <p className="text-xs sm:text-sm xl:text-base text-gray-600 flex items-center gap-1.5 sm:gap-2">
                                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                    <span>{restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="sticky top-4 z-20 bg-white  shadow-md flex items-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-300 transition-all duration-300">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3" />
                        <input
                            type="text"
                            placeholder="Search for delicious dishes..."
                            className="w-full bg-transparent focus:outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="ml-2 sm:ml-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 sm:w-4 h-4 text-gray-500" />
                            </button>
                        )}
                    </div>
                    <div className="bg-white mb-6 sm:mb-8 p-4 sm:p-5 border-b border-gray-200 flex items-center gap-4">
                        {/* Veg Toggle */}
                        <button
                            onClick={() => setVeg(!veg)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${veg ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                            aria-label="Toggle Veg Filter"
                        >
                            <LeafyGreen size={20} />
                        </button>

                        {/* Non-Veg Toggle */}
                        <button
                            onClick={() => setNonVeg(!nonVeg)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${nonVeg ? 'bg-amber-900 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                            aria-label="Toggle Non-Veg Filter"
                        >
                            <Ham size={20} />
                        </button>
                    </div>

                    {/* Menu */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredMenu.length > 0 ? filteredMenu.map(item => (
                            <div
                                key={item._id}
                                className={`flex flex-col w-full bg-white p-4 sm:p-5  border border-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                                    ${itemAddedAnimation === item._id ? 'ring-2 ring-blue-400' : ''}`
                                }
                            >
                                {item.photoURL ? (
                                    <img
                                        src={item.photoURL}
                                        alt={item.itemName}
                                        className="w-full h-36 sm:h-40 xl:h-48 object-cover  bg-gray-50 shadow-sm mb-3 sm:mb-4"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/FEEBC8/DD6B20?text=No+Image`; }}
                                    />
                                ) : (
                                    <div className="w-full h-36 sm:h-40 xl:h-48 flex items-center justify-center rounded-lg bg-blue-100 text-blue-400 text-5xl sm:text-6xl font-bold mb-3 sm:mb-4">
                                        🍽️
                                    </div>
                                )}

                                <div className="flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                        <p className="text-base sm:text-lg font-semibold text-gray-800 flex-1">{item.itemName}</p>
                                        <div className="flex-shrink-0 ml-2 sm:ml-3">
                                            {item.dishType === "V" && (
                                                <span title="Vegetarian">
                                                    <LeafyGreen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                                </span>
                                            )}
                                            {item.dishType === "NV" && (
                                                <span title="Non-Vegetarian">
                                                    <Ham className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-lg text-blue-900 font-semibold mb-3 sm:mb-4">₹ {item.price}</p>

                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-6 "
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="w-full h-full col-span-full text-center py-10">
                                <CookingPot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-400" />
                                <p className="text-lg sm:text-lg text-blue-400 py-10 sm:py-12">No items match your search. Try a different query!</p>
                            </div>
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
                appear
            >
                <div
                    ref={nodeRef}
                    className="hidden lg:block w-full max-w-sm sticky top-6 self-start h-fit transition-all duration-300"
                >
                    <div className='bg-white border border-gray-100 shadow-xl p-6'>
                        <h3 className="text-2xl font-semibold text-blue-600 mb-5">Your Order</h3>
                        <ul className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-3 custom-scrollbar">
                            {cart.map(item => (
                                <li key={item._id} className="flex justify-between items-center text-base border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <span className="truncate text-gray-800 flex-1 pr-3">{item.itemName} <span className="font-semibold text-blue-600">x {item.quantity}</span></span>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="font-medium text-gray-700">₹ {item.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 text-gray-500 hover:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                                            aria-label="Remove item"
                                        >
                                            <CircleMinus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-bold text-xl text-gray-800 mb-6 border-t border-gray-200 pt-5">
                            <span>Total</span>
                            <span>₹ {totalAmount}</span>
                        </div>
                        <button
                            onClick={saveCartToLocalStorage}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                            <ShoppingCart className="inline-block w-6 h-6 mr-2" /> Proceed to Checkout
                        </button>
                    </div>
                </div>
            </CSSTransition>

            {/* Mobile Bottom Cart */}
            {showCart && (
                <div
                    ref={mobileCartRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ transform: `translateY(${currentTranslateY}px)` }} // Apply dynamic transform
                    className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(255,165,0,0.1)] border-t border-blue-200 z-50 rounded-xl transition-transform duration-300 ease-out max-w-full sm:max-w-xl mx-auto lg:hidden
                        ${isMobileCartExpanded ? 'h-auto max-h-[80vh] min-h-[10rem]' : 'h-[6rem]'}`
                    }
                >
                    {/* Pull handle */}
                    <div className="mobile-cart-handle flex justify-center py-2 cursor-grab active:cursor-grabbing"
                        onClick={() => setIsMobileCartExpanded(true)} // Changed to expand cart on click
                    >
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Collapsed view / Expanded view content */}
                    {!isMobileCartExpanded ? (
                        <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4" onClick={() => setIsMobileCartExpanded(true)}> {/* Changed to expand cart on click */}
                            <h3 className="text-lg sm:text-xl font-bold text-blue-600">
                                <ShoppingCart className="inline-block w-5 h-5 mr-2" /> View Cart ({cart.length} items)
                            </h3>
                            <span className="font-bold text-base sm:text-lg text-gray-800">₹ {totalAmount}</span>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-6 pt-0"> {/* Adjusted padding for expanded content */}
                            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4">Your Order</h3>
                            <ul className="space-y-2 mb-4 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <li key={item._id} className="flex justify-between items-center text-sm sm:text-base">
                                        <span className="truncate text-gray-800 flex-1 pr-2">{item.itemName} <span className="font-semibold text-blue-600">x {item.quantity}</span></span>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="font-medium text-gray-700">₹ {item.price * item.quantity}</span>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-1.5 rounded-full hover:bg-blue-100 transition-colors duration-200 text-gray-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                aria-label="Remove item"
                                            >
                                                <CircleMinus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between font-semibold text-base sm:text-lg text-gray-800 mb-4 border-t border-gray-200 pt-4">
                                <span>Total</span>
                                <span>₹ {totalAmount}</span>
                            </div>
                            <button
                                onClick={saveCartToLocalStorage}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white py-3  text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                <ShoppingCart className="inline-block w-5 h-5 mr-2" /> Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
