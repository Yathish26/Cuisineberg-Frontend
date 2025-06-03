import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authDetails, setAuthDetails] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const { publicCode } = useParams();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [orderbutton, setOrderButton] = useState("Order Now");

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
    });
  }, [token]);

  const isReadyToOrder =
    deliveryMode && (deliveryMode === 'Pickup' ? pickupTime : deliveryAddress);

  const handleOrder = async () => {
    const details = {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      publicCode,
      deliveryMode,
      ...(deliveryMode === 'Pickup' ? { pickupTime } : {}),
      ...(deliveryMode === 'Delivery' ? { deliveryAddress } : {}),
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

  // Load Google Maps Script
  useEffect(() => {
    if (deliveryMode !== 'Delivery') return;

    const existingScript = document.getElementById('google-maps');
    if (existingScript) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_OYiHvy9Oikmrc8PQZXHP4bvTAmgKD34&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.body.appendChild(script);
  }, [deliveryMode]);

  const initMap = () => {
    if (!mapRef.current) return;

    const defaultLatLng = { lat: 12.9716, lng: 77.5946 }; // Bangalore default

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultLatLng,
      zoom: 15,
    });

    map.addListener('click', async (e) => {
      const { latLng } = e;
      const lat = latLng.lat();
      const lng = latLng.lng();

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });

      try {
        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        if (response.results && response.results.length > 0) {
          setDeliveryAddress(response.results[0].formatted_address);
        } else {
          setDeliveryAddress(`Lat: ${lat}, Lng: ${lng}`);
        }
      } catch {
        setDeliveryAddress(`Lat: ${lat}, Lng: ${lng}`);
      }
    });
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
                onClick={() => {
                  setShowAuthForm(true);
                  setIsLoginMode(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAuthForm(true);
                  setIsLoginMode(false);
                }}
                className="px-4 py-2 bg-green-500 text-white font-semibold"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {showAuthForm && !token && (
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginMode && (
              <input
                type="text"
                placeholder="Name"
                value={authDetails.name}
                onChange={(e) => setAuthDetails({ ...authDetails, name: e.target.value })}
                required
                className="w-full p-2 border border-gray-300"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={authDetails.email}
              onChange={(e) => setAuthDetails({ ...authDetails, email: e.target.value })}
              required
              className="w-full p-2 border border-gray-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={authDetails.password}
              onChange={(e) => setAuthDetails({ ...authDetails, password: e.target.value })}
              required
              className="w-full p-2 border border-gray-300"
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            {authSuccess && <p className="text-green-600 text-sm">{authSuccess}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 font-semibold">
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <p
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-blue-500 text-center cursor-pointer"
            >
              {isLoginMode ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
            </p>
          </form>
        )}

        {token && cartItems.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}

        {token && cartItems.length > 0 && (
          <>
            <div className="space-y-4 max-h-64 overflow-y-auto border-b pb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">
                    {item.itemName} {item.quantity > 1 && `×${item.quantity}`}
                  </span>
                  <span className="text-blue-600 font-semibold">
                    ₹{item.price * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h1 className="text-sm font-medium text-gray-700">Mode of Delivery</h1>
              <div className="flex space-x-4">
                {['Pickup', 'Delivery'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDeliveryMode(mode)}
                    className={`w-1/2 p-2 text-center font-semibold ${deliveryMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-600'
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {deliveryMode === 'Pickup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-2 border border-gray-300"
                />
              </div>
            )}

            {deliveryMode === 'Delivery' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select on Map</label>
                  <div
                    ref={mapRef}
                    className="w-full h-64 border border-gray-300 rounded"
                  ></div>
                </div>
                {deliveryAddress && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected Address: <span className="font-medium">{deliveryAddress}</span>
                  </p>
                )}
              </>
            )}

            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-blue-600">₹{total}</span>
            </div>

            <button
              onClick={handleOrder}
              disabled={!isReadyToOrder}
              className={`w-full font-bold py-2 px-4 shadow-md transition duration-300 ${isReadyToOrder
                ? orderbutton === "Order Placed"
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : orderbutton === "Order Failed"
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
