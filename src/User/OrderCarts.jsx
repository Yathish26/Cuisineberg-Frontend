import { MapPin, ShoppingBag } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderCarts({ orders, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No Orders Yet</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You haven't placed any orders yet. When you do, they'll appear here.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Orders</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
        </p>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order._id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-gray-800 transition-all hover:shadow-md"
          >
            <div className="p-4 sm:p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === 'Delivered' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : order.orderStatus === 'Cancelled'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{order.deliveryMode}</span>
                  </div>
                  {order.deliveryMode === 'Pickup' && order.pickupTime && (
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="sr-only">Items</h4>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.cartItems.map(item => (
                    <li key={item._id} className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.photoURL}
                            alt={item.itemName}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.itemName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.foodCategory} · Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₹{item.price}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ₹{item.price * item.quantity} total
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="mt-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {order.cartItems.length} {order.cartItems.length === 1 ? 'item' : 'items'}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{order.total}
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 flex justify-end">
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Track Order
                </button>
                {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}