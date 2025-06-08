export default function Orders({ orders }) {
  const handleAction = (orderId, actionType) => {
    console.log(`Action: ${actionType}, Order ID: ${orderId}`);
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
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Orders</h2>

        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order, index) => {
            const currentStatus = order.orderStatus.toLowerCase();

            return (
              <div key={index} className="mb-8 border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{order.name}</h3>
                <p className="text-gray-500 mb-1">Email: {order.email}</p>
                <p className="text-gray-500 mb-1">Mode: {order.deliveryMode}</p>
                {order.deliveryMode === "Delivery" && (
                  <p className="text-gray-500 mb-1">Address: {order.deliveryAddress}</p>
                )}
                <p className="text-gray-500 mb-1">Total: ₹{order.total}</p>
                <p className="text-gray-500 mb-1">
                  Status:{" "}
                  <span
                    className={`capitalize inline-block px-2 py-1 rounded text-sm font-medium ${statusColor[currentStatus] || "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </p>
                <p className="text-gray-500 mb-4">
                  Date: {new Date(order.orderDate).toLocaleString()}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {order.cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-4 border shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={item.photoURL}
                        alt={item.itemName}
                        className="w-full h-24 object-cover rounded"
                      />
                      <h4 className="text-sm font-semibold mt-2">{item.itemName}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      <p className="text-gray-600 text-sm">₹{item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {currentStatus === "pending" && (
                    <button
                      onClick={() => handleAction(order._id, "preparing")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                    >
                      Mark as Preparing
                    </button>
                  )}
                  {currentStatus === "preparing" && (
                    <button
                      onClick={() => handleAction(order._id, "outForDelivery")}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {["preparing", "out for delivery"].includes(currentStatus) && (
                    <button
                      onClick={() => handleAction(order._id, "delivered")}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {!["cancelled", "delivered"].includes(currentStatus) && (
                    <button
                      onClick={() => handleAction(order._id, "cancelled")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 text-lg mt-6">No Orders Yet</div>
        )}
      </div>
    </div>
  );
}
