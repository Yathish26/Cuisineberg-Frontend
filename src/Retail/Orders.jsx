export default function Orders({orders}) {
  return (
    <div className="space-y-6">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-100">
        <h2 className="text-3xl font-bold text-orange-600 mb-6">Orders</h2>

        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="mb-8 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{order.name}</h3>
              <p className="text-gray-500 mb-1">Email: {order.email}</p>
              <p className="text-gray-500 mb-1">Mode: {order.deliveryMode}</p>
              {order.deliveryMode === 'Delivery' && (
                <p className="text-gray-500 mb-1">Address: {order.deliveryAddress}</p>
              )}
              <p className="text-gray-500 mb-1">Total: ₹{order.total}</p>
              <p className="text-gray-500 mb-1">Status: <span className="capitalize">{order.orderStatus}</span></p>
              <p className="text-gray-500 mb-4">Date: {new Date(order.orderDate).toLocaleString()}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {order.cartItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                    <img src={item.photoURL} alt={item.itemName} className="w-full h-24 object-cover rounded" />
                    <h4 className="text-sm font-semibold mt-2">{item.itemName}</h4>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    <p className="text-gray-600 text-sm">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg mt-6">No Orders Yet</div>
        )}
      </div>
    </div>
  );
}