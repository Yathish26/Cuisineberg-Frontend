import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { useRef } from 'react';
import { CheckCircle, ClipboardList, Clock, ShoppingBag, Truck, XCircle, ChevronDown, RefreshCw } from "lucide-react";

export default function Orders({ trigger }) {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const token = localStorage.getItem("retailtoken");
  const socketRef = useRef(null);

  useEffect(() => {
    if (trigger && trigger._id) {
      setRestaurant(trigger);
    }
  }, [trigger]);


  const playSound = (url) => {
    const audio = new Audio(url);
    audio.play();
  }


  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('retailtoken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (restaurant && restaurant._id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/health`)
        .then((res) => {
          if (!res.ok) throw new Error('Server not ready');

          if (socketRef.current) {
            socketRef.current.disconnect();
          }

          const socket = io(import.meta.env.VITE_API_URL, {
            auth: {
              token: localStorage.getItem('retailtoken'),
            },
          });

          socketRef.current = socket;

          socket.on('connect', () => {
            socket.emit('joinRoom', { restaurantId: restaurant._id.toString() });
          });

          socket.on('connect_error', (err) => {
            console.warn('Socket connection failed:', err.message);
          });

          socket.on('newOrder', (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            playSound('/alert.mp3');
          });
        })
        .catch((err) => {
          console.warn('Skipping socket connection:', err.message);
        });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [restaurant]);

  const handleAction = async (orderId, actionType) => {

    if (actionType === "cancelled") {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/orders/${orderId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to cancel order");

        // Update UI to remove the cancelled order or update its status
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, orderStatus: "cancelled" } : order
          )
        );
        setTimeout(() => fetchOrders(), 2000);
      } catch (err) {
        console.error("Cancel failed:", err);
        alert("Error cancelling order");
      }
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    preparing: "bg-blue-100 text-blue-700",
    "out for delivery": "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Orders Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              <ClipboardList className="inline mr-2 text-blue-600" size={24} />
              Order Management
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <button className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm hover:bg-gray-50 transition-colors">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="divide-y divide-gray-200">
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => {
              const currentStatus = order.orderStatus.toLowerCase();
              const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800',
                preparing: 'bg-blue-100 text-blue-800',
                'out for delivery': 'bg-indigo-100 text-indigo-800',
                delivered: 'bg-green-100 text-green-800',
                cancelled: 'bg-red-100 text-red-800'
              };

              return (
                <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[currentStatus] || 'bg-gray-100 text-gray-800'}`}>
                          {order.orderStatus}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.orderDate).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                      <p className="text-sm text-gray-500 capitalize">{order.deliveryMode}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Customer</h4>
                      <p className="font-medium text-gray-800">{order.name}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>
                    {order.deliveryMode === "Delivery" && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h4>
                        <p className="text-sm text-gray-800">{order.deliveryAddress}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Items Ordered</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.cartItems.map((item) => (
                        <div key={item._id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex-shrink-0 mr-4">
                            <img
                              src={item.photoURL || 'https://placehold.co/100x100?text=No+Image'}
                              alt={item.itemName}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-800">{item.itemName}</h5>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3">
                    {currentStatus === "pending" && (
                      <button
                        onClick={() => handleAction(order._id, "preparing")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Clock className="mr-2" size={16} />
                        Mark as Preparing
                      </button>
                    )}
                    {currentStatus === "preparing" && (
                      <button
                        onClick={() => handleAction(order._id, "outForDelivery")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <Truck className="mr-2" size={16} />
                        Out for Delivery
                      </button>
                    )}
                    {["preparing", "out for delivery"].includes(currentStatus) && (
                      <button
                        onClick={() => handleAction(order._id, "delivered")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircle className="mr-2" size={16} />
                        Mark as Delivered
                      </button>
                    )}
                    {!["cancelled", "delivered"].includes(currentStatus) && (
                      <button
                        onClick={() => handleAction(order._id, "cancelled")}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <XCircle className="mr-2" size={16} />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-gray-500">New orders will appear here when received.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
