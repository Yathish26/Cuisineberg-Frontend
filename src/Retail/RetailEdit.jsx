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
    <div className="min-h-screen bg-orange-50 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6">Edit Restaurant Profile</h2>
        
        {/* Display Message */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {message.text}
          </div>
        )}

        {/* Restaurant Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner's Name</label>
            <input
              type="text"
              name="name"
              value={restaurantInfo.name}
              onChange={handleInputChange}
              disabled={!editable}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={restaurantInfo.email}
              onChange={handleInputChange}
              disabled={!editable}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={restaurantInfo.restaurantName}
              onChange={handleInputChange}
              disabled={!editable}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* restaurantAddress */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-bold text-orange-600">Address</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Street</label>
            <input
              type="text"
              name="restaurantAddress.street"
              value={restaurantInfo.restaurantAddress.street}
              onChange={handleInputChange}
              disabled={!editable}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="restaurantAddress.city"
                value={restaurantInfo.restaurantAddress.city}
                onChange={handleInputChange}
                disabled={!editable}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="restaurantAddress.state"
                value={restaurantInfo.restaurantAddress.state}
                onChange={handleInputChange}
                disabled={!editable}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              name="restaurantAddress.zipCode"
              value={restaurantInfo.restaurantAddress.zipCode}
              onChange={handleInputChange}
              disabled={!editable}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={restaurantInfo.mobileNumber}
            onChange={handleInputChange}
            disabled={!editable}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 space-x-4">
          {editable ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditable(false)}
                className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditable(true)}
              className="bg-orange-600 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
