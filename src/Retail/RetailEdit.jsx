import React, { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";

export default function RetailEdit() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    email: "",
    restaurantName: "",
    restaurantAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    mobileNumber: "",
  });
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      const token = localStorage.getItem("retailtoken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurantInfo({
          ...data,
          restaurantAddress: {
            street: data.restaurantAddress?.street || "",
            city: data.restaurantAddress?.city || "",
            state: data.restaurantAddress?.state || "",
            zipCode: data.restaurantAddress?.zipCode || "",
          },
        });
      } else {
        setMessage({ text: "Error fetching profile.", type: "error" });
        localStorage.removeItem("retailtoken");
        navigate("/retail/login");
      }
      setLoading(false);
    };
    fetchRestaurantInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("restaurantAddress.")) {
      const field = name.split(".")[1];
      setRestaurantInfo((prev) => ({
        ...prev,
        restaurantAddress: { ...prev.restaurantAddress, [field]: value },
      }));
    } else {
      setRestaurantInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("retailtoken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: restaurantInfo.name,
          email: restaurantInfo.email,
          restaurantName: restaurantInfo.restaurantName,
          restaurantAddress: restaurantInfo.restaurantAddress,
          mobileNumber: restaurantInfo.mobileNumber,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setMessage({ text: "Changes saved successfully.", type: "success" });
        setEditable(false);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.error}`, type: "error" });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage({ text: "Failed to save changes.", type: "error" });
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl p-10 border border-orange-100">
        <div className="flex items-center mb-8">
          <div className="bg-orange-100 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/office-chair-stroke-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#f97316">
              <path d="M16 22C14.934 20.7553 13.5337 20 12 20C10.4663 20 9.06603 20.7553 8 22" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M12 13C10.7319 13 9.39109 13.2193 8.34002 13.5128C7.54859 13.7338 6.91195 14.7415 7.00999 15.5596C7.04632 15.8627 7.30731 16 7.58173 16H16.4183C16.6927 16 16.9537 15.8627 16.99 15.5596C17.0881 14.7415 16.4514 13.7338 15.66 13.5128C14.6089 13.2193 13.2681 13 12 13Z" stroke="#f97316" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M21 10C19.8954 10 19 10.8954 19 12V13C19 14.1046 18.1046 15 17 15" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M3 10C4.10457 10 5 10.8954 5 12V13C5 14.1046 5.89543 15 7 15" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12 16V22" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12.8197 10H11.1803C9.77811 10 9.07704 10 8.56988 9.57641C8.06272 9.15282 7.89268 8.42526 7.55261 6.97014C7.01792 4.68228 6.75058 3.53835 7.31199 2.76918C7.87341 2 8.97569 2 11.1803 2H12.8197C15.0243 2 16.1266 2 16.688 2.76918C17.2494 3.53835 16.9821 4.68228 16.4474 6.97014C16.1073 8.42526 15.9373 9.15282 15.4301 9.57641C14.923 10 14.2219 10 12.8197 10Z" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12 10V13" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-orange-700 tracking-tight">Edit Restaurant Profile</h2>
        </div>

        {/* Display Message */}
        {message.text && (
          <div
            className={`mb-6 p-3 rounded-lg text-center font-medium shadow-sm ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Restaurant Info */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Owner's Name</label>
            <input
              type="text"
              name="name"
              value={restaurantInfo.name}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
              placeholder="Enter owner's name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={restaurantInfo.email}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={restaurantInfo.restaurantName}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
              placeholder="Enter restaurant name"
            />
          </div>
        </div>

        {/* restaurantAddress */}
        <div className="mt-8 space-y-5">
          <h3 className="text-lg font-bold text-orange-600 mb-2">Address</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Street</label>
            <input
              type="text"
              name="restaurantAddress.street"
              value={restaurantInfo.restaurantAddress.street}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="restaurantAddress.city"
                value={restaurantInfo.restaurantAddress.city}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="restaurantAddress.state"
                value={restaurantInfo.restaurantAddress.state}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
                placeholder="State"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code</label>
            <input
              type="text"
              name="restaurantAddress.zipCode"
              value={restaurantInfo.restaurantAddress.zipCode}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
              placeholder="Zip code"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mt-8">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={restaurantInfo.mobileNumber}
            onChange={handleInputChange}
            disabled={!editable}
            className={`mt-1 block w-full rounded-lg border ${editable ? "border-orange-300" : "border-gray-200"
              } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition`}
            placeholder="Mobile number"
          />
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4 justify-end">
          {editable ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditable(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition focus:outline-none"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditable(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
