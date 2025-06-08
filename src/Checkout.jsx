import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authDetails, setAuthDetails] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const { publicCode } = useParams();
  const [orderbutton, setOrderButton] = useState("Order Now");

  const navigate = useNavigate();

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

  useEffect(() => {
    const userdata = axios.get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userdata.then((response) => {
      if (response.data) {
        setUser({
          name: response.data.name || '',
          email: response.data.email || '',
          mobileNumber: response.data.mobileNumber || '',
        });
      }
    }).catch((error) => {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    });
  }, [token]);

  const handleOrder = async () => {
    const details = {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      publicCode,
      cartItems,
      total,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(details),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setOrderButton("Order Placed");
      setTimeout(() => {
        setOrderButton("Order Now");
      }, 2000);
    } catch (error) {
      console.error('Order failed:', error);
      setOrderButton("Order Failed");
      setTimeout(() => {
        setOrderButton("Order Now");
      }, 2000);
    }
  };


  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const url = isLoginMode
      ? `${import.meta.env.VITE_API_URL}/api/cuisineberg/user/login`
      : `${import.meta.env.VITE_API_URL}/api/cuisineberg/user/register`;

    const payload = isLoginMode
      ? { email: authDetails.email, password: authDetails.password }
      : authDetails;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || 'Something went wrong');
      } else {
        if (isLoginMode) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setShowAuthForm(false);
        } else {
          setAuthSuccess('Registration successful. You can now login.');
          setIsLoginMode(true);
        }
      }
    } catch (err) {
      setAuthError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-blue-600 text-center">Checkout</h2>

        {!token && !showAuthForm && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please login or register to continue.</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-green-500 text-white font-semibold"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {token && cartItems.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {token && cartItems.length > 0 && (
          <>
            <div className="space-y-4 max-h-64 overflow-y-auto border-b pb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <img src={item.photoURL} alt={item.itemName} className="w-16 h-16 object-cover rounded mr-4" />
                  <span className="text-gray-800 font-medium flex-1">
                    {item.itemName} {item.quantity > 1 && `×${item.quantity}`}
                  </span>
                  <span className="text-blue-600 font-semibold">
                    ₹{item.price * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-blue-600">₹{total}</span>
            </div>

            <button
              onClick={handleOrder}
              disabled={orderbutton === "Order Failed"}
              className={`w-full font-bold py-2 px-4 shadow-md transition duration-300 ${
                orderbutton === "Order Placed"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : orderbutton === "Order Failed"
                  ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {orderbutton}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
