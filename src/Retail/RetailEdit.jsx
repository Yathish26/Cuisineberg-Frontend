import React, { useState, useEffect } from "react";

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
  const [message, setMessage] = useState({ text: "", type: "" }); // For success or error messages

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
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl p-10 border border-orange-100">
        <div className="flex items-center mb-8">
          <div className="bg-orange-100 rounded-full p-3 mr-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm0 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 0v8" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-orange-700 tracking-tight">Edit Restaurant Profile</h2>
        </div>

        {/* Display Message */}
        {message.text && (
          <div
            className={`mb-6 p-3 rounded-lg text-center font-medium shadow-sm ${
              message.type === "success"
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
              className={`mt-1 block w-full rounded-lg border ${
                editable ? "border-orange-300" : "border-gray-200"
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
              className={`mt-1 block w-full rounded-lg border ${
                editable ? "border-orange-300" : "border-gray-200"
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
              className={`mt-1 block w-full rounded-lg border ${
                editable ? "border-orange-300" : "border-gray-200"
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
              className={`mt-1 block w-full rounded-lg border ${
                editable ? "border-orange-300" : "border-gray-200"
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
                className={`mt-1 block w-full rounded-lg border ${
                  editable ? "border-orange-300" : "border-gray-200"
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
                className={`mt-1 block w-full rounded-lg border ${
                  editable ? "border-orange-300" : "border-gray-200"
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
              className={`mt-1 block w-full rounded-lg border ${
                editable ? "border-orange-300" : "border-gray-200"
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
            className={`mt-1 block w-full rounded-lg border ${
              editable ? "border-orange-300" : "border-gray-200"
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
