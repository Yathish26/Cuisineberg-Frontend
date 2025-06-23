import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Briefcase, Home, LogOut, MapPin, ShoppingBag, Heart, CreditCard, Settings, Plus, CheckCircle } from 'lucide-react';
import Loading from '../Components/Loading';
import OrderCarts from './OrderCarts';
import Header from '../Header';
import PasswordChange from './PasswordChange';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('orders');
    const [theme, setTheme] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
    });
    const [passChange, setPassChange] = useState(false);
    const navigate = useNavigate();

    const troubleShoot = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/orders`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const dark = localStorage.getItem('appearanceisDark') === 'true';
        if (dark) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            troubleShoot();
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        troubleShoot();
                    } else {
                        setError(data.message || 'Something went wrong');
                        troubleShoot();
                    }
                } else {
                    setUser(data);
                    setFormData({
                        name: data.name || '',
                        mobileNumber: data.mobileNumber || '',
                    });
                }
            } catch (err) {
                console.error('Fetch profile error:', err);
                setError('Failed to fetch profile.');
                troubleShoot();
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        if (newTheme === 'dark') {
            localStorage.setItem('appearanceisDark', 'true');
            document.documentElement.classList.add('dark');
        } else {
            localStorage.removeItem('appearanceisDark');
            document.documentElement.classList.remove('dark');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            troubleShoot();
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 2000);
                setError('');
                setUser(formData);
                setIsEditing(false);
            } else {
                setSuccess('');
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            console.error('Update failed:', err);
            setError('An error occurred while updating.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (user) {
            setFormData({
                name: user.name || '',
                mobileNumber: user.mobileNumber || '',
            });
        }
        setError('');
        setSuccess('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (error && !isEditing) {
        return <div className="text-red-600 text-center mt-6">{error}</div>;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Header />

            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 md:p-8 shadow-md dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name}</h1>
                            <p className="text-sm md:text-base text-blue-100 dark:text-gray-300">
                                {user.mobileNumber || 'Not Provided'} &bull; {user.email}
                            </p>
                        </div>

                        {!isEditing ? (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 bg-white/90 hover:bg-white text-blue-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                <li>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center p-4 text-left transition-colors ${activeTab === 'orders'
                                            ? 'bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <ShoppingBag className="w-5 h-5 mr-3" />
                                        <span>My Orders</span>
                                        {orders.length > 0 && (
                                            <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                                {orders.length}
                                            </span>
                                        )}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('payments')}
                                        className={`w-full flex items-center p-4 text-left transition-colors ${activeTab === 'payments'
                                            ? 'bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <CreditCard className="w-5 h-5 mr-3" />
                                        <span>Payments</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`w-full flex items-center p-4 text-left transition-colors ${activeTab === 'settings'
                                            ? 'bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Settings className="w-5 h-5 mr-3" />
                                        <span>Settings</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Content Display Area */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
                            {isEditing ? (
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit Profile</h3>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300">
                                            <p>{success}</p>
                                        </div>
                                    )}

                                    <form className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 dark:text-white"
                                                maxLength={50}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="mobileNumber"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                maxLength={15}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 dark:text-white"
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                We'll only use this for order updates
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'orders' && (
                                        <OrderCarts orders={orders} loading={loadingOrders} />
                                    )}
                                    {activeTab === 'payments' && (
                                        <div className="p-6 md:p-8">
                                            <div className="text-center py-8">
                                                <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Payment Methods</h3>
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Your saved payment methods will appear here for faster checkout.
                                                </p>
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                                                        Add Payment Method
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'settings' && (
                                        <div className="p-6 md:p-8">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-6">Account Settings</h3>

                                            <div className="space-y-6">
                                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-200 mb-3">Appearance</h4>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Customize how CuisineBerg looks on your device
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {theme === 'dark' ? 'Dark' : 'Light'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={handleThemeToggle}
                                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                            >
                                                                <span
                                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                    <h4 className="text-base font-medium text-gray-900 dark:text-gray-200 mb-3">Account Security</h4>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Change Password</p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setPassChange(!passChange)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                Change
                                                            </button>
                                                        </div>

                                                        {/* Password Change Form */}
                                                        <AnimatePresence mode="wait">
                                                            {passChange && (
                                                                <motion.div
                                                                    key="password-change-form"
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                                >
                                                                    <PasswordChange />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}