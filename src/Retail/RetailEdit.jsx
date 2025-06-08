import React, { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";
import { Armchair } from "lucide-react";

export default function RetailEdit() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    email: "",
    restaurantName: "",
    restaurantAddress: {
      street: "",
      area: "", // Added
      city: "",
      state: "",
      zipCode: "",
      googleMapsUrl: "", // Added
      latitude: null, // Added
      longitude: null, // Added
    },
    mobileNumber: "",
    alternateNumber: "", // Added
    restaurantType: "Both", // Added with default
    cuisines: [], // Added
    restaurantCategory: "", // Added
    tags: [], // Added
    gstNumber: "", // Added
    fssaiNumber: "", // Added
    businessRegNumber: "", // Added
    operatingHours: {
      openingTime: "", // Added
      closingTime: "", // Added
      workingDays: [], // Added
    },
    deliveryAvailable: true, // Added with default
    dineInAvailable: false, // Added with default
    minOrderValue: 0, // Added with default
    maxDeliveryRadiusKm: null, // Added
    avgDeliveryTimeMins: null, // Added
    websiteUrl: "", // Added
    instagramUrl: "", // Added
    facebookUrl: "", // Added
    zomatoUrl: "", // Added
    swiggyUrl: "", // Added
    acceptedPaymentModes: [], // Added
    upiId: "", // Added
    bankDetails: { // Added
      accountHolderName: "",
      accountNumber: "",
      ifscCode: ""
    }
  });
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      const token = localStorage.getItem("retailtoken");
      try {
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
            // Ensure nested objects and arrays are initialized correctly if they might be null/undefined from backend
            restaurantAddress: {
              street: data.restaurantAddress?.street || "",
              area: data.restaurantAddress?.area || "", // Added
              city: data.restaurantAddress?.city || "",
              state: data.restaurantAddress?.state || "",
              zipCode: data.restaurantAddress?.zipCode || "",
              googleMapsUrl: data.restaurantAddress?.googleMapsUrl || "", // Added
              latitude: data.restaurantAddress?.latitude || null, // Added
              longitude: data.restaurantAddress?.longitude || null, // Added
            },
            operatingHours: {
              openingTime: data.operatingHours?.openingTime || "", // Added
              closingTime: data.operatingHours?.closingTime || "", // Added
              workingDays: data.operatingHours?.workingDays || [], // Added
            },
            bankDetails: {
              accountHolderName: data.bankDetails?.accountHolderName || "",
              accountNumber: data.bankDetails?.accountNumber || "",
              ifscCode: data.bankDetails?.ifscCode || ""
            },
            cuisines: data.cuisines || [], // Added
            tags: data.tags || [], // Added
            acceptedPaymentModes: data.acceptedPaymentModes || [], // Added
          });
        } else {
          setMessage({ text: "Error fetching profile.", type: "error" });
          localStorage.removeItem("retailtoken");
          navigate("/retail/login");
        }
      } catch (error) {
        console.error("Failed to fetch restaurant info:", error);
        setMessage({ text: "Failed to connect to the server.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested objects
      const [parent, child] = name.split(".");
      if (parent === "restaurantAddress" || parent === "operatingHours" || parent === "bankDetails") {
        setRestaurantInfo((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "number" ? (value === "" ? null : Number(value)) : value,
          },
        }));
      }
    } else if (type === "checkbox") {
      // Handle boolean fields
      setRestaurantInfo((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      // Handle number fields
      setRestaurantInfo((prev) => ({ ...prev, [name]: value === "" ? null : Number(value) }));
    } else {
      // Handle simple fields
      setRestaurantInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, fieldName) => {
    const { value } = e.target;
    // Split by comma and trim whitespace, then filter out empty strings
    const newArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setRestaurantInfo(prev => ({ ...prev, [fieldName]: newArray }));
  };

  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setRestaurantInfo((prev) => {
      const currentDays = prev.operatingHours.workingDays;
      if (checked) {
        return {
          ...prev,
          operatingHours: {
            ...prev.operatingHours,
            workingDays: [...currentDays, value],
          },
        };
      } else {
        return {
          ...prev,
          operatingHours: {
            ...prev.operatingHours,
            workingDays: currentDays.filter((day) => day !== value),
          },
        };
      }
    });
  };

  const handlePaymentModesChange = (e) => {
    const { value, checked } = e.target;
    setRestaurantInfo((prev) => {
      const currentModes = prev.acceptedPaymentModes;
      if (checked) {
        return {
          ...prev,
          acceptedPaymentModes: [...currentModes, value],
        };
      } else {
        return {
          ...prev,
          acceptedPaymentModes: currentModes.filter((mode) => mode !== value),
        };
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("retailtoken");

      // Filter out null/empty strings for fields that might not be set
      const dataToSave = Object.fromEntries(
        Object.entries(restaurantInfo).filter(([_, value]) => value !== null && value !== "" && !(Array.isArray(value) && value.length === 0))
      );

      // Deep filter for nested objects if they contain only empty strings or nulls
      if (dataToSave.restaurantAddress) {
        dataToSave.restaurantAddress = Object.fromEntries(
          Object.entries(dataToSave.restaurantAddress).filter(([_, value]) => value !== null && value !== "")
        );
      }
      if (dataToSave.operatingHours) {
        dataToSave.operatingHours = Object.fromEntries(
          Object.entries(dataToSave.operatingHours).filter(([_, value]) => value !== null && value !== "" && !(Array.isArray(value) && value.length === 0))
        );
      }
      if (dataToSave.bankDetails) {
        dataToSave.bankDetails = Object.fromEntries(
          Object.entries(dataToSave.bankDetails).filter(([_, value]) => value !== null && value !== "")
        );
      }


      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Update state with the exact data returned by the backend to ensure consistency
        setRestaurantInfo(prev => ({
            ...prev,
            ...updatedData,
            restaurantAddress: { ...prev.restaurantAddress, ...updatedData.restaurantAddress },
            operatingHours: { ...prev.operatingHours, ...updatedData.operatingHours },
            bankDetails: { ...prev.bankDetails, ...updatedData.bankDetails },
            cuisines: updatedData.cuisines || [],
            tags: updatedData.tags || [],
            acceptedPaymentModes: updatedData.acceptedPaymentModes || [],
        }));
        setMessage({ text: "Changes saved successfully.", type: "success" });
        setEditable(false);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.error || "Failed to save changes."}`, type: "error" });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage({ text: "Failed to save changes due to network error.", type: "error" });
    }
  };

  if (loading) {
    return <Loading />;
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const paymentModes = ['UPI', 'Cash', 'Card', 'NetBanking', 'Other'];
  const restaurantTypes = ['Veg', 'Non-Veg', 'Both'];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl w-full max-w-2xl p-10 rounded-lg border border-blue-100">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <Armchair color="#3b82f6" />
          </div>
          <h2 className="text-3xl font-bold text-blue-700 tracking-tight">Edit Restaurant Profile</h2>
        </div>

        {/* Display Message */}
        {message.text && (
          <div
            className={`mb-6 p-3 rounded-md text-center font-medium shadow-sm ${message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Basic Information</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Owner's Name</label>
            <input
              type="text"
              name="name"
              value={restaurantInfo.name}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
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
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
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
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Enter restaurant name"
            />
          </div>
        </div>

        {/* Restaurant Address */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Address Details</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Street</label>
            <input
              type="text"
              name="restaurantAddress.street"
              value={restaurantInfo.restaurantAddress.street}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Street address"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Area (Optional)</label>
            <input
              type="text"
              name="restaurantAddress.area"
              value={restaurantInfo.restaurantAddress.area}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Locality or Area (e.g., Kinnigoli)"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="restaurantAddress.city"
                value={restaurantInfo.restaurantAddress.city}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
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
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
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
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Zip code"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Google Maps URL</label>
            <input
              type="text"
              name="restaurantAddress.googleMapsUrl"
              value={restaurantInfo.restaurantAddress.googleMapsUrl}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Google Maps URL"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                name="restaurantAddress.latitude"
                value={restaurantInfo.restaurantAddress.latitude || ""}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
                placeholder="Latitude"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                name="restaurantAddress.longitude"
                value={restaurantInfo.restaurantAddress.longitude || ""}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
                placeholder="Longitude"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Contact Information</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={restaurantInfo.mobileNumber}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Mobile number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Alternate Number (Optional)</label>
            <input
              type="text"
              name="alternateNumber"
              value={restaurantInfo.alternateNumber}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Alternate contact number"
            />
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Restaurant Details</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Type</label>
            <div className="mt-1 flex gap-4">
              {restaurantTypes.map((type) => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="restaurantType"
                    value={type}
                    checked={restaurantInfo.restaurantType === type}
                    onChange={handleInputChange}
                    disabled={!editable}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cuisines (comma-separated)</label>
            <input
              type="text"
              name="cuisines"
              value={restaurantInfo.cuisines.join(', ')}
              onChange={(e) => handleArrayChange(e, 'cuisines')}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="e.g., South Indian, Chinese, Italian"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Category</label>
            <input
              type="text"
              name="restaurantCategory"
              value={restaurantInfo.restaurantCategory}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="e.g., Cafe, Cloud Kitchen, Fine Dining"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={restaurantInfo.tags.join(', ')}
              onChange={(e) => handleArrayChange(e, 'tags')}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="e.g., Fast Delivery, Family Friendly, Pet Friendly"
            />
          </div>
        </div>

        {/* Legal & Business */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Legal & Business Information</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={restaurantInfo.gstNumber}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="GST number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">FSSAI Number</label>
            <input
              type="text"
              name="fssaiNumber"
              value={restaurantInfo.fssaiNumber}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="FSSAI license number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Registration Number</label>
            <input
              type="text"
              name="businessRegNumber"
              value={restaurantInfo.businessRegNumber}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="Business registration number"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Operating Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Opening Time</label>
              <input
                type="time" // Use type="time" for better user experience
                name="operatingHours.openingTime"
                value={restaurantInfo.operatingHours.openingTime}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Closing Time</label>
              <input
                type="time" // Use type="time" for better user experience
                name="operatingHours.closingTime"
                value={restaurantInfo.operatingHours.closingTime}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Working Days</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={day}
                    checked={restaurantInfo.operatingHours.workingDays.includes(day)}
                    onChange={handleWorkingDaysChange}
                    disabled={!editable}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery & Logistics */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Delivery & Logistics</h3>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="deliveryAvailable"
                checked={restaurantInfo.deliveryAvailable}
                onChange={handleInputChange}
                disabled={!editable}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">Delivery Available</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="dineInAvailable"
                checked={restaurantInfo.dineInAvailable}
                onChange={handleInputChange}
                disabled={!editable}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">Dine-In Available</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Order Value</label>
            <input
              type="number"
              name="minOrderValue"
              value={restaurantInfo.minOrderValue}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Delivery Radius (Km)</label>
            <input
              type="number"
              name="maxDeliveryRadiusKm"
              value={restaurantInfo.maxDeliveryRadiusKm || ""}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Average Delivery Time (Mins)</label>
            <input
              type="number"
              name="avgDeliveryTimeMins"
              value={restaurantInfo.avgDeliveryTimeMins || ""}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="e.g., 30"
            />
          </div>
        </div>

        {/* Social Media & Website */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Online Presence</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              name="websiteUrl"
              value={restaurantInfo.websiteUrl}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="https://yourrestaurant.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              name="instagramUrl"
              value={restaurantInfo.instagramUrl}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="https://instagram.com/yourrestaurant"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              name="facebookUrl"
              value={restaurantInfo.facebookUrl}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="https://facebook.com/yourrestaurant"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Zomato URL</label>
            <input
              type="url"
              name="zomatoUrl"
              value={restaurantInfo.zomatoUrl}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="https://zomato.com/yourrestaurant"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Swiggy URL</label>
            <input
              type="url"
              name="swiggyUrl"
              value={restaurantInfo.swiggyUrl}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="https://swiggy.com/yourrestaurant"
            />
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-8 space-y-5">
          <h3 className="text-xl font-bold text-blue-600 mb-4">Payment Information</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Accepted Payment Modes</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentModes.map((mode) => (
                <label key={mode} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={mode}
                    checked={restaurantInfo.acceptedPaymentModes.includes(mode)}
                    onChange={handlePaymentModesChange}
                    disabled={!editable}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{mode}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={restaurantInfo.upiId}
              onChange={handleInputChange}
              disabled={!editable}
              className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
              placeholder="yourupiid@bank"
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-700">Bank Details</h4>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                name="bankDetails.accountHolderName"
                value={restaurantInfo.bankDetails.accountHolderName}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
                placeholder="Account Holder Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                name="bankDetails.accountNumber"
                value={restaurantInfo.bankDetails.accountNumber}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
                placeholder="Account Number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                name="bankDetails.ifscCode"
                value={restaurantInfo.bankDetails.ifscCode}
                onChange={handleInputChange}
                disabled={!editable}
                className={`mt-1 block w-full rounded-md border ${editable ? "border-blue-300" : "border-gray-200"
                  } bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition`}
                placeholder="IFSC Code"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4 justify-end">
          {editable ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditable(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-md shadow transition focus:outline-none"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditable(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}