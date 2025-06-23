import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  HandPlatter, 
  ReceiptIndianRupee, 
  Plus, 
  Check, 
  X, 
  Share2,
  User,
  LogIn,
  UserPlus,
  Scan,
  Wallet,
  Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function DineInCheckout() {
  const { publicCode } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const ws = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({ name: '', email: '', mobileNumber: '' });
  const [orderStatus, setOrderStatus] = useState('idle'); // 'idle' | 'placing' | 'success' | 'error'
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'orders'
  const [pastOrders, setPastOrders] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    if (!token) return;

    // Simulate WebSocket connection
    const simulateWS = () => {
      const interval = setInterval(() => {
        // Simulate group members joining
        if (groupMembers.length < 3 && Math.random() > 0.7) {
          const names = ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram'];
          const newMember = {
            id: Math.random().toString(36).substring(7),
            name: names[Math.floor(Math.random() * names.length)],
            joinedAt: new Date().toISOString()
          };
          setGroupMembers(prev => [...prev, newMember]);
          toast(`${newMember.name} joined the table`, { icon: '👋' });
        }

        // Simulate cart updates from others
        if (cartItems.length > 0 && Math.random() > 0.8) {
          const randomItem = cartItems[Math.floor(Math.random() * cartItems.length)];
          const updatedItem = {
            ...randomItem,
            quantity: randomItem.quantity + 1
          };
          setCartItems(prev => 
            prev.map(item => item.itemName === randomItem.itemName ? updatedItem : item)
          );
          toast(`${groupMembers[0]?.name || 'Someone'} added more ${randomItem.itemName}`, { icon: '➕' });
        }
      }, 5000);

      return () => clearInterval(interval);
    };

    const cleanup = simulateWS();

    return () => cleanup();
  }, [token, cartItems, groupMembers]);

  useEffect(() => {
    const storedCart = localStorage.getItem(publicCode);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    // Load mock past orders
    setPastOrders([
      {
        id: 'order-1',
        items: [
          { itemName: 'Butter Chicken', price: 250, quantity: 2 },
          { itemName: 'Garlic Naan', price: 50, quantity: 4 }
        ],
        total: 700,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed'
      },
      {
        id: 'order-2',
        items: [
          { itemName: 'Paneer Tikka', price: 180, quantity: 1 },
          { itemName: 'Dal Makhani', price: 150, quantity: 1 }
        ],
        total: 330,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'completed'
      }
    ]);
  }, [publicCode]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const allOrdersTotal = pastOrders.reduce(
    (sum, order) => sum + order.total,
    total
  );

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { name, email, mobileNumber } = res.data;
          setUser({ name, email, mobileNumber });
          // Add user as first group member
          setGroupMembers([{ id: 'you', name, joinedAt: new Date().toISOString() }]);
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const handleOrder = async (isFinal = false) => {
    setOrderStatus('placing');
    
    const details = {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      publicCode,
      cartItems,
      total,
      isFinal
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cuisineberg/order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(details),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      setOrderStatus('success');
      toast.success(`Order ${isFinal ? 'finalized' : 'placed'} successfully!`);
      
      if (isFinal) {
        // Add current cart to past orders and clear
        setPastOrders(prev => [...prev, {
          id: `order-${Date.now()}`,
          items: [...cartItems],
          total,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }]);
        localStorage.removeItem(publicCode);
        setCartItems([]);
        setShowPayment(true);
      } else {
        // Add to past orders but keep cart for more items
        setPastOrders(prev => [...prev, {
          id: `order-${Date.now()}`,
          items: [...cartItems],
          total,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }]);
        localStorage.removeItem(publicCode);
        setCartItems([]);
      }
      
    } catch (err) {
      console.error('Order failed:', err);
      setOrderStatus('error');
      toast.error(err.message || 'Failed to place order');
    } finally {
      setTimeout(() => setOrderStatus('idle'), 3000);
    }
  };

  const handleEndSession = () => {
    localStorage.removeItem(publicCode);
    setCartItems([]);
    setSessionEnded(true);
    toast('Session ended. Thank you for dining with us!', {
      icon: '👋',
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleFinalCheckout = () => {
    setIsFinalizing(true);
    setTimeout(() => {
      handleOrder(true);
      setIsFinalizing(false);
    }, 1500);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 shadow-lg text-center max-w-md w-full border border-blue-100 rounded-xl"
        >
          <div className="flex justify-center mb-6">
            <User className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Join the Table</h2>
          <p className="text-gray-600 mb-8">Sign in or create an account to continue with your order</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              <LogIn className="w-5 h-5" />
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition"
            >
              <UserPlus className="w-5 h-5" />
              Register
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-green-500" />
              Payment
            </h2>
            <button 
              onClick={() => setShowPayment(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{allOrdersTotal}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax (5%)</span>
              <span className="font-medium">₹{(allOrdersTotal * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Service Charge</span>
              <span className="font-medium">₹50.00</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-green-600">
                ₹{(allOrdersTotal * 1.05 + 50).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Scan to pay via UPI</h3>
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=restaurant%40upi&pn=Restaurant%20Name&am=500&tn=Food%20Bill&cu=INR&size=200x200&margin=10"
                alt="UPI QR Code"
                className="w-48 h-48 mb-4"
                draggable="false"
              />
              <p className="text-sm text-gray-600 mb-2">OR</p>
              <p className="text-sm font-medium text-gray-800 mb-1">UPI ID: restaurant@upi</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('restaurant@upi');
                  toast.success('UPI ID copied!');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Copy UPI ID
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              toast.success('Payment successful!');
              setTimeout(() => {
                setShowPayment(false);
                setSessionEnded(true);
              }, 1500);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Mark as Paid
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <HandPlatter className="w-5 h-5" />
          Table Orders
        </h1>
        <div className="w-6"></div> {/* Spacer */}
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Main Section */}
        <main className="flex-1 p-4 md:p-6">
          <div className="hidden md:flex items-center gap-3 mb-6">
            <HandPlatter className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-semibold text-gray-800">Table Orders</h1>
          </div>

          {/* Group Members */}
          {groupMembers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 overflow-x-auto pb-2"
            >
              {groupMembers.map((member, idx) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-shrink-0 flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    member.id === 'you' ? 'bg-blue-600' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-800">
                    {member.id === 'you' ? 'You' : member.name}
                  </span>
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQR(true)}
                className="flex-shrink-0 flex items-center gap-1 bg-white border border-blue-200 px-3 py-1 rounded-full text-sm text-blue-600"
              >
                <Users className="w-4 h-4" />
                <span>Invite</span>
              </motion.button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'items' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HandPlatter className="w-4 h-4" />
              Current Order
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'orders' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              Past Orders ({pastOrders.length})
            </button>
          </div>

          {sessionEnded ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-sm text-center"
            >
              <div className="flex justify-center mb-4">
                <Check className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Ended</h2>
              <p className="text-gray-600 mb-6">Thank you for dining with us!</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Back to Home
              </motion.button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                {activeTab === 'items' ? (
                  cartItems.length === 0 ? (
                    <motion.div
                      key="empty-cart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white p-6 rounded-xl shadow-sm text-center"
                    >
                      <div className="flex justify-center mb-4">
                        <HandPlatter className="w-12 h-12 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                      <p className="text-gray-600 mb-6">Start by adding items to your order</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/order/${publicCode}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
                      >
                        <Plus className="inline mr-2" />
                        Add Items
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="items-list"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <AnimatePresence>
                        {cartItems.map((item, idx) => (
                          <motion.div
                            key={`${item.itemName}-${idx}`}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="bg-white p-4 rounded-xl shadow-sm flex items-center hover:shadow-md transition-shadow"
                          >
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
                              <img 
                                src={item.photoURL} 
                                alt={item.itemName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/80';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">{item.itemName}</h4>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                {item.addedBy && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    {item.addedBy === user.name ? 'You' : item.addedBy}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-blue-600 font-bold whitespace-nowrap ml-2">
                              ₹{item.price * item.quantity}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="past-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {pastOrders.length === 0 ? (
                      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="flex justify-center mb-4">
                          <Clock className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No past orders</h2>
                        <p className="text-gray-600">Your ordered items will appear here</p>
                      </div>
                    ) : (
                      pastOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-4 rounded-xl shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-gray-800 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </h3>
                            <span className="font-bold text-green-600">₹{order.total}</span>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                                <div className="flex items-center">
                                  <span className="text-gray-800">{item.itemName}</span>
                                  <span className="ml-2 text-sm text-gray-500">x{item.quantity}</span>
                                </div>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {activeTab === 'items' && cartItems.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex flex-wrap gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/order/${publicCode}`)}
                    className="flex items-center gap-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add More Items
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOrder(false)}
                    disabled={orderStatus === 'placing'}
                    className={`flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg ${
                      orderStatus === 'placing' ? 'bg-blue-400' : 
                      orderStatus === 'success' ? 'bg-green-500' : 
                      orderStatus === 'error' ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {orderStatus === 'placing' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </>
                    ) : orderStatus === 'success' ? (
                      <>
                        <Check className="w-5 h-5" />
                        Order Placed!
                      </>
                    ) : orderStatus === 'error' ? (
                      <>
                        <X className="w-5 h-5" />
                        Try Again
                      </>
                    ) : (
                      'Place This Order'
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinalCheckout}
                    disabled={isFinalizing}
                    className={`flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg ${
                      isFinalizing ? 'bg-purple-500' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isFinalizing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Finalizing...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Final Checkout
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </main>

        {/* Bill Summary Sidebar - Sticky on desktop */}
        <aside className="w-full md:w-96 bg-white border-t md:border-l border-gray-200 p-4 md:p-6 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <ReceiptIndianRupee className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Bill Summary</h2>
          </div>

          {activeTab === 'items' ? (
            <>
              <div className="space-y-3 mb-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-800">{item.itemName}</span>
                      <span className="ml-2 text-sm text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-800">Current Order</span>
                <span className="text-xl font-bold text-blue-600">₹{total}</span>
              </div>
            </>
          ) : (
            <div className="mb-6">
              <div className="space-y-3 mb-4">
                {pastOrders.map((order) => (
                  <div key={order.id} className="flex justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-800">
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="font-medium">₹{order.total}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">Past Orders</span>
                <span className="font-bold text-blue-600">₹{pastOrders.reduce((sum, o) => sum + o.total, 0)}</span>
              </div>
            </div>
          )}

          <div className="py-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{allOrdersTotal}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tax (5%)</span>
              <span className="font-medium">₹{(allOrdersTotal * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Charge</span>
              <span className="font-medium">₹50.00</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{(allOrdersTotal * 1.05 + 50).toFixed(2)}
            </span>
          </div>

          {cartItems.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
              >
                <Share2 className="w-5 h-5" />
                {showQR ? 'Hide QR Code' : 'Share This Session'}
              </button>

              {showQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${window.location.href}&size=150x150&margin=10`}
                    alt="Share QR"
                    className="w-40 h-40 mb-3"
                    draggable="false"
                  />
                  <button
                    onClick={copyShareLink}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Copy link instead
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* User Info */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ordering as</h3>
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-600">{user.mobileNumber}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}