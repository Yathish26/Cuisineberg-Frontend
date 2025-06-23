import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    LineChart,
    CalendarDays,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Home,
    Utensils,
    Package,
    Bell,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
    Menu
} from 'lucide-react';
import { SiGooglecampaignmanager360 } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import AdminOrders from './AdminOrders';
import AdminReport from './AdminReport';
import Inventory from './Inventory';


export default function Admin() {
    const [totalRetails, setTotalRetails] = useState(0);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchData = async () => {
        const token = localStorage.getItem('admintoken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                localStorage.removeItem('admintoken');
                navigate('/admin/login');
                return;
            }

            const data = await response.json();
            setTotalRetails(data.totalRestaurants);
            setAllRestaurants(data.restaurantNames);

            // Mock notifications - replace with real data
            setNotifications([
                { id: 1, message: 'New order from Restaurant A', time: '2 mins ago', read: false },
                { id: 2, message: 'Inventory low for Item B', time: '1 hour ago', read: false },
                { id: 3, message: 'System update available', time: '3 days ago', read: true }
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admintoken');
        navigate('/admin/login');
    };

    const filteredRestaurants = allRestaurants.filter(retail =>
        retail.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }


    const MobileHeader = () => {
        return (
            <header className="lg:hidden bg-white dark:bg-gray-800 shadow-sm py-3 px-4 flex items-center justify-between sticky top-0 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                    <SiGooglecampaignmanager360 className="mr-2" />
                    Admin
                </h1>
                <div className="relative">
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 relative">
                        <Bell className="w-5 h-5" />
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                    </button>
                </div>
            </header>
        )
    }

    const DesktopSidebar = () => {
        return (
            <div className="hidden lg:flex lg:flex-shrink-0 h-screen sticky top-0">
                <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600 dark:bg-blue-700">
                        <h1 className="text-lg font-bold text-white flex items-center">
                            <SiGooglecampaignmanager360 className="mr-2" />
                            Cuisineberg
                        </h1>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'dashboard'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Home className="mr-3 h-5 w-5" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('restaurants')}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'restaurants'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Utensils className="mr-3 h-5 w-5" />
                                Restaurants
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'orders'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <ShoppingCart className="mr-3 h-5 w-5" />
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'inventory'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Package className="mr-3 h-5 w-5" />
                                Inventory
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'reports'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <LineChart className="mr-3 h-5 w-5" />
                                Reports
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'settings'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </button>
                        </nav>
                    </div>
                    <div className="p-4 border-t flex flex-col gap-2 border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                        <button
                            onClick={()=>navigate('/admin/settings')}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Settings className="mr-3 h-5 w-5" />
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const MobileSidebar = () => {
        return (
            <div className="lg:hidden fixed inset-0 z-40">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 dark:bg-blue-700">
                        <h1 className="text-lg font-bold text-white">Menu</h1>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-md text-white hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 py-4 space-y-1">
                            <button
                                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'dashboard'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Home className="mr-3 h-5 w-5" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => { setActiveTab('restaurants'); setMobileMenuOpen(false); }}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'restaurants'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Utensils className="mr-3 h-5 w-5" />
                                Restaurants
                            </button>
                            <button
                                onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'orders'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <ShoppingCart className="mr-3 h-5 w-5" />
                                Orders
                            </button>
                            <button
                                onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'inventory'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Package className="mr-3 h-5 w-5" />
                                Inventory
                            </button>
                            <button
                                onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'reports'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <LineChart className="mr-3 h-5 w-5" />
                                Reports
                            </button>
                            <button
                                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${activeTab === 'settings'
                                    ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </button>
                        </nav>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Mobile Header */}
            <MobileHeader />

            {/* Desktop Sidebar */}
            <DesktopSidebar />

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <MobileSidebar />
            )}

            {/* Main Content */}
            <div className="w-full flex flex-col flex-1">
                {/* Desktop Header */}
                <header className="hidden lg:flex bg-white dark:bg-gray-800 shadow-sm py-4 px-6 items-center justify-between sticky top-0 z-10">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative">
                            <Bell className="h-5 w-5" />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                            )}
                        </button>
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                A
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                                Admin
                            </span>
                            <ChevronDown className="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 pb-8">
                    {/* Dashboard Content */}
                    {activeTab === 'dashboard' && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Total Restaurants Card */}
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-blue-500 dark:bg-blue-600 rounded-md p-3">
                                                <Utensils className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    Total Restaurants
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                        {totalRetails}
                                                    </div>
                                                </dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Orders Card */}
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-green-500 dark:bg-green-600 rounded-md p-3">
                                                <ShoppingCart className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    Total Orders
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                        1,230
                                                    </div>
                                                </dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pending Orders Card */}
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-yellow-500 dark:bg-yellow-600 rounded-md p-3">
                                                <CalendarDays className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    Pending Orders
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                        150
                                                    </div>
                                                </dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {/* Add Restaurant */}
                                    <Link
                                        to="/admin/addretail"
                                        className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition duration-200"
                                    >
                                        <div className="px-4 py-5 sm:p-6 flex items-center">
                                            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                                                <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Add Restaurant
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Register a new restaurant
                                                </p>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* View Inventory */}
                                    <Link
                                        to="/admin/inventory"
                                        className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition duration-200"
                                    >
                                        <div className="px-4 py-5 sm:p-6 flex items-center">
                                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                                                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    View Inventory
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Manage stock and supplies
                                                </p>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Generate Reports */}
                                    <Link
                                        to="/admin/reports"
                                        className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition duration-200"
                                    >
                                        <div className="px-4 py-5 sm:p-6 flex items-center">
                                            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                                                <LineChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Generate Reports
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    View analytics and insights
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                    {/* Feedback Section */}
                                    <Link
                                        to="/admin/feedback"
                                        className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition duration-200"
                                    >
                                        <div className="px-4 py-5 sm:p-6 flex items-center">
                                            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                                                <VscFeedback className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Feedback
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    View feedback from customers
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Restaurants */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Restaurants</h2>
                                    <Link to="/admin/restaurants" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                                        View all
                                    </Link>
                                </div>
                                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {allRestaurants.slice(0, 5).map((retail, index) => (
                                            <li key={index}>
                                                <Link to={`/admin/retail/${retail.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <div className="px-4 py-4 sm:px-6">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                                                                {retail.name}
                                                            </p>
                                                            <div className="ml-2 flex-shrink-0 flex">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                                    Active
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Restaurants Content */}
                    {activeTab === 'restaurants' && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">Restaurants</h2>
                                <Link
                                    to="/admin/addretail"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                    Add Restaurant
                                </Link>
                            </div>

                            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <div className="relative w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search restaurants..."
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700">
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700">
                                            <option>Sort by</option>
                                            <option>Name (A-Z)</option>
                                            <option>Name (Z-A)</option>
                                            <option>Recently Added</option>
                                        </select>
                                    </div>
                                </div>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredRestaurants.length === 0 ? (
                                        <li className="px-4 py-12 text-center">
                                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No restaurants</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Get started by adding a new restaurant.
                                            </p>
                                            <div className="mt-6">
                                                <Link
                                                    to="/admin/addretail"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                                    Add Restaurant
                                                </Link>
                                            </div>
                                        </li>
                                    ) : (
                                        filteredRestaurants.map((retail, index) => (
                                            <li key={index}>
                                                <Link to={`/admin/retail/${retail.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <div className="px-4 py-4 sm:px-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                                    {retail.name.charAt(0)}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {retail.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {retail.email || 'No email provided'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-2 flex-shrink-0 flex">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                                    Active
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                {filteredRestaurants.length > 0 && (
                                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                                    <span className="font-medium">{filteredRestaurants.length}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <a
                                                        href="#"
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                    </a>
                                                    <a
                                                        href="#"
                                                        aria-current="page"
                                                        className="z-10 bg-blue-50 dark:bg-gray-600 border-blue-500 dark:border-gray-500 text-blue-600 dark:text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                                    >
                                                        1
                                                    </a>
                                                    <a
                                                        href="#"
                                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                                    >
                                                        2
                                                    </a>
                                                    <a
                                                        href="#"
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                                    </a>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Other tabs content would go here */}
                    {activeTab === 'orders' && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            <AdminOrders />
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            <Inventory/>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            <AdminReport />
                        </div>
                    )}

                    {/* {activeTab === 'settings' && (
                        <div className="px-4 sm:px-6 lg:px-8 py-6">
                            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">Settings</h2>
                            Settings content would go here
                        </div>
                    )} */}
                </main>
            </div>
        </div>
    );
}