import React, { useState } from 'react';

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const items = [
    { name: "Paneer Butter Masala", price: 180 },
    { name: "Garlic Naan (2 pcs)", price: 60 },
    { name: "Lassi", price: 40 },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-orange-600 text-center">Checkout</h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-800 font-medium">{item.name}</span>
              <span className="text-orange-600 font-semibold">₹{item.price}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
          <span>Total</span>
          <span className="text-orange-600">₹{total}</span>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option>UPI</option>
            <option>Cash</option>
            <option>Card</option>
          </select>
        </div>

        <button
          onClick={() => alert(`Paid ₹${total} via ${paymentMethod}`)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
