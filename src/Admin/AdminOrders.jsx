import React, { useEffect, useState } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiXCircle,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({});

  // Filter and sort options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const deliveryOptions = [
    { value: 'all', label: 'All Modes' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'pickup', label: 'Pickup' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'total-high', label: 'Highest Total' },
    { value: 'total-low', label: 'Lowest Total' }
  ];

  // Fetch orders with error handling
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
      toast.success('Orders loaded successfully');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...orders];

    // Search filter
    if (searchTerm) {
      result = result.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order._id?.toLowerCase().includes(searchLower) ||
          order.name?.toLowerCase().includes(searchLower) ||
          order.mobileNumber?.toString().includes(searchTerm) ||
          order.email?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.orderStatus?.toLowerCase() === statusFilter
      );
    }

    // Delivery mode filter
    if (deliveryFilter !== 'all') {
      result = result.filter(order => 
        order.deliveryMode?.toLowerCase() === deliveryFilter
      );
    }

    // Date filter (simplified implementation)
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);
        switch (dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
            return orderDate >= oneWeekAgo;
          case 'month':
            const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return orderDate >= oneMonthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'oldest':
          return new Date(a.orderDate) - new Date(b.orderDate);
        case 'total-high':
          return (b.total || 0) - (a.total || 0);
        case 'total-low':
          return (a.total || 0) - (b.total || 0);
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, deliveryFilter, dateFilter, sortBy]);

  // Update order status with loading state and error handling
  const updateOrderStatus = async (orderId, newStatus) => {
    setIsUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admintoken')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Status and delivery icons
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiRefreshCw className="text-blue-500 animate-spin" />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  const getDeliveryIcon = (mode) => {
    return mode?.toLowerCase() === 'delivery'
      ? <FiTruck className="text-blue-500" />
      : <FiClock className="text-purple-500" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <PulseLoader color="#3B82F6" size={15} />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Error Loading Orders
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error}
          </p>
          <button
            onClick={fetchOrders}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiRefreshCw className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Orders Management
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchOrders}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, name, phone, or email"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="sr-only">Status</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="status-filter"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Mode Filter */}
          <div>
            <label htmlFor="delivery-filter" className="sr-only">Delivery Mode</label>
            <select
              id="delivery-filter"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
            >
              {deliveryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label htmlFor="date-filter" className="sr-only">Date Range</label>
            <select
              id="date-filter"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort-by" className="sr-only">Sort By</label>
            <select
              id="sort-by"
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium">{filteredOrders.length}</span> of{' '}
          <span className="font-medium">{orders.length}</span> orders
        </p>
        {filteredOrders.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg shadow overflow-hidden bg-white dark:bg-gray-800 transition-all hover:shadow-md"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <span className="mr-2">{getStatusIcon(order.orderStatus)}</span>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </h3>
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {getDeliveryIcon(order.deliveryMode)}
                      <span className="ml-1 capitalize">{order.deliveryMode || 'unknown'}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.orderDate).toLocaleString()}
                    </span>
                    <select
                      value={order.orderStatus || 'pending'}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`block w-full pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 ${
                        isUpdatingStatus[order._id] ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isUpdatingStatus[order._id]}
                    >
                      {statusOptions
                        .filter(opt => opt.value !== 'all')
                        .map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div className="col-span-1">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      CUSTOMER
                    </h4>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.name || 'No name provided'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.mobileNumber || 'No phone provided'}
                    </p>
                    {order.email && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {order.email}
                      </p>
                    )}
                  </div>

                  {/* Delivery Info */}
                  <div className="col-span-1">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {order.deliveryMode === 'Delivery' ? 'DELIVERY' : 'PICKUP'}
                    </h4>
                    {order.deliveryMode === 'Delivery' ? (
                      <>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {order.deliveryAddress?.street || 'No address provided'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.deliveryAddress?.city || ''}, {order.deliveryAddress?.state || ''}{' '}
                          {order.deliveryAddress?.zipCode ? `- ${order.deliveryAddress.zipCode}` : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Pickup
                        </p>
                        {order.pickupTime && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="col-span-1">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      PAYMENT
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {order.paymentMethod || 'unknown'} - {order.paymentStatus || 'unknown'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                       Order Total: ₹{(Number(order.total) || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  ITEMS ({order.cartItems?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.cartItems?.map(item => (
                    <div key={item._id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.photoURL || 'https://via.placeholder.com/80?text=No+Image'}
                          alt={item.itemName}
                          className="h-16 w-16 rounded-md object-cover border border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.itemName || 'Unnamed Item'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {item.foodCategory || 'uncategorized'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity || 1} × ₹{item.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Order placed on {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    Total: ₹{(Number(order.total) || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;