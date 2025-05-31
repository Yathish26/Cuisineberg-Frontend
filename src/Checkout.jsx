import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const { publicCode } = useParams();

  useEffect(() => {
    const storedCart = localStorage.getItem(publicCode);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [publicCode]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const isReadyToPay =
    mobileNumber &&
    deliveryMode &&
    (deliveryMode === 'Pickup' ? pickupTime : deliveryAddress) &&
    paymentMethod;

  const handlePay = () => {
    const details = {
      mobileNumber,
      deliveryMode,
      ...(deliveryMode === 'Pickup' && { pickupTime }),
      ...(deliveryMode === 'Delivery' && { deliveryAddress }),
      paymentMethod,
      total,
    };
    alert(`Paid ₹${total} via ${paymentMethod}\nDetails:\n${JSON.stringify(details, null, 2)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-orange-600 text-center">Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {/* Cart Summary */}
            <div className="space-y-4 max-h-64 overflow-y-auto border-b pb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">
                    {item.itemName} {item.quantity > 1 && `×${item.quantity}`}
                  </span>
                  <span className="text-orange-600 font-semibold">
                    ₹{item.price * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Delivery Mode Selection */}
            <div className="space-y-2">
              <h1 className="text-sm font-medium text-gray-700">Mode of Delivery</h1>
              <div className="flex space-x-4">
                {['Pickup', 'Delivery'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDeliveryMode(mode)}
                    className={`w-1/2 p-2 rounded-lg text-center font-semibold ${
                      deliveryMode === mode
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Fields */}
            {deliveryMode === 'Pickup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {deliveryMode === 'Delivery' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
              </select>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-orange-600">₹{total}</span>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={handlePay}
              disabled={!isReadyToPay}
              className={`w-full font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ${
                isReadyToPay
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Pay Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
