import React, { useEffect, useState } from 'react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/orders`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center py-12">Loading your orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Orders</h3>
                <p className="text-gray-500">Orders placed comes here</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Orders</h2>

            <div className="space-y-6">
                {orders.map(order => (
                    <div
                        key={order._id}
                        className="border rounded-xl shadow p-4 bg-white"
                    >
                        <div className="flex flex-col md:flex-row md:justify-between mb-4">
                            <div>
                                <p className="text-lg font-medium text-gray-800">Order ID: <span className="text-blue-600">{order._id}</span></p>
                                <p className="text-sm text-gray-500">Status: <span className="font-semibold">{order.orderStatus}</span></p>
                                <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleString()}</p>
                            </div>
                            <div className="text-sm text-gray-600 mt-2 md:mt-0">
                                <p><strong>Name:</strong> {order.name}</p>
                                <p><strong>Mobile:</strong> {order.mobileNumber}</p>
                                <p><strong>Mode:</strong> {order.deliveryMode}</p>
                                {order.deliveryMode === 'Pickup' && order.pickupTime && (
                                    <p><strong>Pickup Time:</strong> {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {order.cartItems.map(item => (
                                <div key={item._id} className="flex gap-4 items-center border rounded-md p-2 bg-gray-50">
                                    <img
                                        src={item.photoURL}
                                        alt={item.itemName}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-800">{item.itemName}</p>
                                        <p className="text-sm text-gray-600">{item.foodCategory} · Qty: {item.quantity}</p>
                                        <p className="text-sm font-semibold text-gray-800">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-right mt-4 text-lg font-bold text-green-600">
                            Total: ₹{order.total}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
