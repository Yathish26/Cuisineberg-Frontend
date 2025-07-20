import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import Loading from './Components/Loading';
import { Navigation, Search, X, Plus, CircleMinus, CookingPot, LeafyGreen, Ham, ShoppingCart, ChevronRight, Trash2, ImageIcon, Minus, ArrowRight, Trash, ImagesIcon, UtensilsCrossed, Soup } from 'lucide-react'; // Using Lucide React for modern icons
import Header from './Header';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserOrder() {
    const { slug } = useParams();
    const publicCode = useMemo(() => slug?.split('-').pop(), [slug]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const nodeRef = useRef(null);
    const mobileCartRef = useRef(null);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [itemAddedAnimation, setItemAddedAnimation] = useState(null);

    const [isMobileCartExpanded, setIsMobileCartExpanded] = useState(true);

    const [veg, setVeg] = useState(false);
    const [nonVeg, setNonVeg] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

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

        let filtered = restaurant.menu.filter(item =>
            item.itemName.toLowerCase().includes(s) ||
            (item.foodCategory?.toLowerCase().includes(s))
        );

        if (veg && !nonVeg) {
            filtered = filtered.filter(item => item.dishType === 'V');
        } else if (!veg && nonVeg) {
            filtered = filtered.filter(item => item.dishType === 'NV');
        }

        if (selectedCategory) {
            filtered = filtered.filter(item => {
                const category = item.foodCategory?.trim() || "Other";
                return category === selectedCategory;
            });
        }

        return filtered;
    }, [restaurant, search, veg, nonVeg, selectedCategory]);


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

    const updateQuantity = useCallback((itemId, quantity) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(i => i._id !== itemId);
            }
            return prevCart.map(i => (i._id === itemId ? { ...i, quantity } : i));
        });
    }, []);

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
            // REMOVE THIS LINE: setIsMobileCartExpanded(true);
        } else if (cart.length === 0) {
            localStorage.removeItem(publicCode);
            setIsMobileCartExpanded(false); // Keep this, as an empty cart should collapse
        }
    }, [cart, publicCode]);

    // Determines if any cart UI should be shown
    const showCart = cart.length > 0;

    const ImageModal = ({ imageUrl, altText, onClose }) => {
        const [isVisible, setIsVisible] = useState(false);
        const modalRef = useRef(null);

        useEffect(() => {
            if (imageUrl) {
                setIsVisible(true);

                document.body.style.overflow = 'hidden';
                document.body.style.touchAction = 'none';

                return () => {
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                };
            } else {
                setIsVisible(false);
            }
        }, [imageUrl]);

        if (!imageUrl) return null;

        return (
            <div
                ref={modalRef}
                className={`fixed inset-0 bg-black flex justify-center items-center z-50 p-4 transition-all duration-300 ease-out
                ${isVisible ? 'bg-opacity-75' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={onClose}
            >
                <div
                    className={`relative max-w-full max-h-full flex justify-center items-center transition-all duration-300 ease-out
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2 bg-gray-800 bg-opacity-50 rounded-full transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Close image"
                    >
                        <X size={24} />
                    </button>

                    <img
                        src={imageUrl}
                        draggable="false"
                        alt={altText || 'Full screen image'}
                        className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg transition-all duration-300 ease-out
                        ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
            </div>
        );
    };



    if (loading) return <Loading />;
    if (!restaurant) return <div className="text-center py-10 text-lg text-blue-600">Restaurant not found.</div>;


    return (
        <>
            <ImageModal
                imageUrl={selectedImage?.url}
                altText={selectedImage?.alt}
                onClose={() => setSelectedImage(null)}
            />
            <Header />
            <div onClick={() => setIsMobileCartExpanded(true)} className={`min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-inter sm:px-4 lg:px-4 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-6 justify-center ${showCart ? 'pb-72' : ""}`}>

                <AnimatePresence>
                    <motion.div
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl xl:max-w-4xl 2xl:max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 relative flex flex-col lg:gap-8"
                    >
                        {/* Left Section: Menu and Header */}
                        <div className="flex-1"> {/* This div will now scroll */}
                            {/* Restaurant Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="flex items-center justify-between w-full gap-3 sm:gap-4">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl xl:text-4xl font-semibold text-black dark:text-gray-200 mb-1">
                                            {restaurant.restaurantName}
                                        </h1>
                                        <p className="text-xs sm:text-sm xl:text-base text-gray-600 dark:text-gray-400 flex items-center gap-1.5 sm:gap-2">
                                            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                                            <span>{restaurant.restaurantAddress?.street}, {restaurant.restaurantAddress?.city}</span>
                                        </p>
                                    </div>
                                    {restaurant.logoUrl &&
                                        <div>
                                            <img
                                                src={restaurant.logoUrl}
                                                alt={`${restaurant.restaurantName} Logo`}
                                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-md"
                                            />
                                        </div>
                                    }
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="sticky top-4 z-20 rounded-xl bg-white dark:bg-gray-700 shadow-md flex items-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-300 dark:focus-within:ring-blue-500 transition-all duration-300">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5  text-gray-400 dark:text-gray-300 mr-2 sm:mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search for delicious dishes..."
                                    className="w-full bg-transparent focus:outline-none text-sm sm:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="ml-2 sm:ml-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-3.5 sm:w-4 h-4 text-gray-500 dark:text-gray-300" />
                                    </button>
                                )}
                            </div>
                            <div className="bg-white dark:bg-gray-800 mb-6 sm:mb-6 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-600 flex items-center gap-4">
                                {/* Veg Toggle */}
                                <button
                                    onClick={() => setVeg(!veg)}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${veg ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                        }`}
                                    aria-label="Toggle Veg Filter"
                                >
                                    <LeafyGreen size={20} />
                                </button>

                                {/* Non-Veg Toggle */}
                                <button
                                    onClick={() => setNonVeg(!nonVeg)}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${nonVeg ? 'bg-amber-900 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                        }`}
                                    aria-label="Toggle Non-Veg Filter"
                                >
                                    <Ham size={20} />
                                </button>
                            </div>

                            {/* Menu Categories */}
                            <div className="w-full  overflow-hidden relative"> {/* Added relative for positioning arrow */}
                                <div className="overflow-x-auto scrollbar-hide">
                                    <div className="flex gap-3 pr-20 whitespace-nowrap w-max">
                                        {[...new Set(
                                            (restaurant?.menu || []).map(item =>
                                                item.foodCategory && item.foodCategory.trim() !== ""
                                                    ? item.foodCategory.trim()
                                                    : "Other"
                                            )
                                        )].map(category => (
                                            <button
                                                key={category}
                                                onClick={() =>
                                                    setSelectedCategory(prev => prev === category ? null : category)
                                                }
                                                className={`px-4 py-2 rounded-full border font-medium transition duration-200 ${selectedCategory === category
                                                    ? 'bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700'
                                                    : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Scroll indicator arrow */}
                                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2 pointer-events-none
                    bg-gradient-to-l from-white dark:from-gray-800 via-white/80 dark:via-gray-800/80 to-transparent w-16"> {/* Fading gradient */}
                                    <ChevronRight className='w-6 h-6 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-full' />
                                </div>
                            </div>

                            {/* Menu */}
                            {filteredMenu.length > 0 ? (
                                (() => {
                                    const grouped = filteredMenu.reduce((acc, item) => {
                                        const category = item.foodCategory?.trim() || "Others";
                                        if (!acc[category]) acc[category] = [];
                                        acc[category].push(item);
                                        return acc;
                                    }, {});

                                    const sortedCategories = Object.keys(grouped).filter(c => c !== "Others").sort();
                                    if (grouped["Others"]) sortedCategories.push("Others");

                                    return sortedCategories.map(category => (
                                        <div key={category} className="mb-10">
                                            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-400 my-4">{category}</h2>

                                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                                                {grouped[category].map(item => (
                                                    <div
                                                        key={item._id}
                                                        className={`flex flex-col rounded-xl w-full bg-white dark:bg-gray-700 p-4 sm:p-5 border border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-xl dark:hover:shadow-gray-600/30 transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                ${itemAddedAnimation === item._id ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}`}
                                                    >
                                                        {item.photoURL ? (
                                                            <img
                                                                src={item.photoURL}
                                                                draggable="false"
                                                                alt={item.itemName}
                                                                className="w-full h-36  sm:h-40 xl:h-48 object-contain cursor-pointer bg-gray-50 dark:bg-gray-600 shadow-sm mb-3 sm:mb-4"
                                                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/FEEBC8/DD6B20?text=No+Image`; }}
                                                                onClick={() => setSelectedImage({ url: item.photoURL, alt: item.itemName })}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-36 sm:h-40 xl:h-48 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-400 dark:text-blue-300 text-5xl sm:text-6xl font-bold mb-3 sm:mb-4"
                                                                onClick={() => setSelectedImage({ url: null, alt: 'No image available' })}
                                                            >
                                                                <Soup className='w-16 h-16' />
                                                            </div>
                                                        )}

                                                        <div className="flex flex-col flex-grow">
                                                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                                                <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex-1">{item.itemName}</p>
                                                                <div className="flex-shrink-0 ml-2 sm:ml-3">
                                                                    {item.dishType === "V" && (
                                                                        <span title="Vegetarian">
                                                                            <LeafyGreen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                                                                        </span>
                                                                    )}
                                                                    {item.dishType === "NV" && (
                                                                        <span title="Non-Vegetarian">
                                                                            <Ham className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-lg text-blue-900 dark:text-blue-300 font-semibold mb-3 sm:mb-4">₹ {item.price}</p>

                                                            <button
                                                                onClick={() => addToCart(item)}
                                                                className="mt-auto flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-6"
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ));
                                })()
                            ) : (
                                <div className="w-full h-full col-span-full text-center py-10">
                                    <CookingPot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-400 dark:text-blue-500" />
                                    <p className="text-lg sm:text-lg text-blue-400 dark:text-blue-500 py-10 sm:py-12">
                                        No items match your search. Try a different query!
                                    </p>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Right Sidebar Cart - Desktop */}
                <AnimatePresence>
                    {showCart &&
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            ref={nodeRef}
                            className="hidden lg:block w-full max-w-sm sticky top-6 self-start h-fit transition-all duration-300">
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-lg p-6">
                                <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-5">Your Order</h3>

                                <ul className="space-y-5 mb-6 max-h-96 overflow-y-auto pr-3 custom-scrollbar">
                                    {cart.map((item) => (
                                        <li
                                            key={item._id}
                                            className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-grow pr-3">
                                                    <p className="text-gray-900 dark:text-gray-200 font-medium">{item.itemName}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        ₹ {item.price} each
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                                <span>Total</span>
                                                <span className="font-semibold">₹ {item.price * item.quantity}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between font-bold text-xl text-gray-800 dark:text-gray-200 mb-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                                    <span>Total</span>
                                    <span>₹ {totalAmount}</span>
                                </div>

                                <button
                                    onClick={saveCartToLocalStorage}
                                    className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3.5 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-75"
                                >
                                    <ShoppingCart className="inline-block w-6 h-6 mr-2" /> Proceed to Checkout
                                </button>
                            </div>
                        </motion.div>}
                </AnimatePresence>

                {/* Mobile Bottom Cart - Optimized Version */}
                {showCart && (
                    <motion.div
                        ref={mobileCartRef}
                        onClick={e => e.stopPropagation()}
                        className={`fixed bottom-0 left-0 right-0 
                            bg-white dark:bg-gray-800 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-blue-200 dark:border-gray-700 z-30 rounded-t-xl overflow-hidden max-w-full sm:max-w-xl mx-auto lg:hidden
      ${isMobileCartExpanded ? 'h-[6rem]' : 'h-auto max-h-[80vh] min-h-[10rem]'}`}



                        // Animation Configuration
                        initial={{ y: 100, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            transition: { type: "spring", damping: 25, stiffness: 300 }
                        }}
                        exit={{ y: 100, opacity: 0 }}

                        // Performance Optimizations
                        style={{
                            willChange: 'transform',
                            touchAction: 'none'
                        }}
                    >
                        {/* Pull Handle */}
                        <motion.div
                            className="flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none"
                            onClick={() => {
                                setIsMobileCartExpanded(!isMobileCartExpanded);
                                if (navigator.vibrate) navigator.vibrate(10);
                            }}
                            whileTap={{ scale: 0.95 }}
                            // Drag Configuration
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.2 }}
                            onDragEnd={(event, info) => {
                                const shouldExpand = info.offset.y > 100 || info.velocity.y > 0.5;
                                const shouldCollapse = info.offset.y < -100 || info.velocity.y < -0.5;

                                if (shouldExpand) setIsMobileCartExpanded(true);
                                if (shouldCollapse) setIsMobileCartExpanded(false);
                                if (navigator.vibrate) navigator.vibrate(10);
                            }}

                        >
                            <motion.div
                                className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"
                                animate={{
                                    scaleX: isMobileCartExpanded ? 1 : 1.2,
                                    backgroundColor: isMobileCartExpanded ? "#d1d5db" : "#9ca3af"
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </motion.div>

                        {/* Cart Content */}
                        <AnimatePresence mode="wait">
                            {!isMobileCartExpanded ? (
                                <motion.div
                                    key="expanded-content"
                                    className="p-5 sm:p-7 pt-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex justify-between items-center mb-7 border-b border-gray-100 dark:border-gray-800 pb-5"

                                    >
                                        <motion.h3
                                            className="text-2xl sm:text-3xl font-bold bg-blue-600 dark:bg-blue-300 bg-clip-text text-transparent"
                                            initial={{ y: -10 }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.1 }}

                                        >
                                            Order Cart
                                        </motion.h3>

                                        {cart.length > 0 && (
                                            <motion.button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCart([]);
                                                }}
                                                className="flex items-center text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition-all"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.15 }}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1.5" />
                                                Clear All
                                            </motion.button>
                                        )}
                                    </div>

                                    <motion.div
                                        className="mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        {cart.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 px-5 text-center bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                                <ShoppingBag className="w-14 h-14 mb-4 text-gray-400 dark:text-gray-600" />
                                                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Your cart feels lonely</p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500">Add some delicious items to get started</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className="max-h-[180px] overflow-y-auto pr-3 mb-5 custom-scrollbar"
                                                >
                                                    <ul className="space-y-3">
                                                        {cart.map((item, index) => (
                                                            <motion.li
                                                                key={item._id}
                                                                className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                    transition: { delay: 0.2 + index * 0.03 },
                                                                }}
                                                                exit={{ opacity: 0, x: -50 }}
                                                                layout
                                                            >
                                                                {/* Item name */}
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                                                        {item.itemName}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                        ₹{item.price} each
                                                                    </p>
                                                                </div>

                                                                {/* Quantity controls */}
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                updateQuantity(item._id, item.quantity - 1);
                                                                            }}
                                                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                                                                        >
                                                                            <Minus className="w-3 h-3" />
                                                                        </button>
                                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 px-1 min-w-[20px] text-center">
                                                                            {item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                updateQuantity(item._id, item.quantity + 1);
                                                                            }}
                                                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                                                                        >
                                                                            <Plus className="w-3 h-3" />
                                                                        </button>
                                                                    </div>

                                                                    {/* Price */}
                                                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap min-w-[60px] text-right">
                                                                        ₹{item.price * item.quantity}
                                                                    </span>
                                                                </div>
                                                            </motion.li>
                                                        ))}
                                                    </ul>

                                                </div>

                                                <motion.div
                                                    className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.25 }}
                                                >
                                                    <span className="text-base font-bold text-gray-800 dark:text-gray-200">Total Amount</span>
                                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 ml-auto">₹{totalAmount}</span>
                                                </motion.div>
                                            </>
                                        )}
                                    </motion.div>

                                    <motion.button
                                        onClick={saveCartToLocalStorage}
                                        disabled={cart.length === 0}
                                        className={`w-full py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900/50 ${cart.length > 0
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-xl active:scale-[0.98]"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            }`}
                                        whileHover={cart.length > 0 ? { scale: 1.02 } : {}}
                                        whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className='flex items-center justify-center'>
                                            <ShoppingCart className="w-4 h-4 mr-1" />
                                            {cart.length > 0 ? (
                                                <span className="flex items-center justify-center">
                                                    Checkout <ArrowRight className="w-4 h-4 ml-1" />
                                                </span>
                                            ) : (
                                                "Add Items"
                                            )}
                                        </div>

                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="collapsed-content"
                                    className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4"
                                    onClick={() => setIsMobileCartExpanded(false)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <h3 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                                        <ShoppingCart className="inline-block w-5 h-5 mr-2" /> View Cart ({cart.length} items)
                                    </h3>
                                    <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-200">
                                        ₹ {totalAmount}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
            <Footer />
        </>
    );
}
