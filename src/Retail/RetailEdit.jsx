import React, { useState, useEffect, useRef } from "react";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";
import { Armchair, CircleCheck, Pencil, Trash2, X, Clock, MapPin, Phone, CreditCard, Globe, FileText, ChevronDown } from "lucide-react";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import RetailHeader from "./RetailHeader";
import Databank from "../Editables/Databank";
import RetailPassChange from "./RetailPassChange";

export default function RetailEdit() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    email: "",
    restaurantName: "",
    restaurantAddress: {
      street: "",
      area: "",
      city: "",
      state: "",
      zipCode: "",
      googleMapsUrl: "",
    },
    about: "",
    mobileNumber: "",
    alternateNumber: "",
    restaurantType: "Both",
    restaurantCategory: "",
    tags: [],
    ishalal: false,
    isjain: false,
    gstNumber: "",
    fssaiNumber: "",
    businessRegNumber: "",
    operatingHours: {
      openingTime: "",
      closingTime: "",
      workingDays: [],
    },
    websiteUrl: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      x: "",
      youtube: ""
    },
    acceptedPaymentModes: [],
    upiId: "",
    cuisines: [],
    amenities: [],
    specialOffers: [],
    seatingCapacity: 0,
    takeawayAvailable: false,
    deliveryAvailable: false,
    reservationsAvailable: false,
    reservationLink: "",
    wheelchairAccessible: false,
    healthProtocols: "",
    latitude: 0,
    longitude: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tagInput, setTagInput] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [specialOfferInput, setSpecialOfferInput] = useState("");
  const rstCategories = Databank.restaurantCategories;
  const cuisineOptions = []
  const amenityOptions = Databank.amenitiesList;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      const token = localStorage.getItem("retailtoken");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRestaurantInfo({
            ...data,
            about: data.about || "",
            restaurantAddress: {
              street: data.restaurantAddress?.street || "",
              area: data.restaurantAddress?.area || "",
              city: data.restaurantAddress?.city || "",
              state: data.restaurantAddress?.state || "",
              zipCode: data.restaurantAddress?.zipCode || "",
              googleMapsUrl: data.restaurantAddress?.googleMapsUrl || "",
            },
            operatingHours: {
              openingTime: data.operatingHours?.openingTime || "",
              closingTime: data.operatingHours?.closingTime || "",
              workingDays: data.operatingHours?.workingDays || [],
            },
            socialMedia:{
              instagram: data.socialMedia?.instagram || "",
              facebook: data.socialMedia?.facebook || "",
              x: data.socialMedia?.x || "",
              youtube: data.socialMedia?.youtube || ""
            },
            tags: data.tags || [],
            cuisines: data.cuisines || [],
            amenities: data.amenities || [],
            specialOffers: data.specialOffers || [],
            logoUrl: data.logoUrl,
            coverUrl: data.coverUrl,
            acceptedPaymentModes: data.acceptedPaymentModes || [],
            ishalal: data.ishalal || false,
            isjain: data.isjain || false,
            takeawayAvailable: data.takeawayAvailable || false,
            deliveryAvailable: data.deliveryAvailable || false,
            reservationsAvailable: data.reservationsAvailable || false,
            wheelchairAccessible: data.wheelchairAccessible || false,
            seatingCapacity: data.seatingCapacity || 0,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0
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
      const [parent, child] = name.split(".");
      if (parent === "restaurantAddress" || parent === "operatingHours" || parent === "socialMedia") {
        setRestaurantInfo((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "number" ? (value === "" ? null : Number(value)) : value,
          },
        }));
      }
    } else if (type === "checkbox") {
      setRestaurantInfo((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setRestaurantInfo((prev) => ({ ...prev, [name]: value === "" ? null : Number(value) }));
    } else {
      setRestaurantInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      let newItem, currentItems, maxItems;

      if (type === 'tag') {
        newItem = tagInput.trim();
        currentItems = restaurantInfo.tags;
        maxItems = 10;
        if (currentItems.length < maxItems && newItem && !currentItems.includes(newItem)) {
          setRestaurantInfo(prev => ({ ...prev, tags: [...prev.tags, newItem] }));
          setTagInput("");
        }
      } else if (type === 'cuisine') {
        newItem = cuisineInput.trim();
        currentItems = restaurantInfo.cuisines;
        if (newItem && !currentItems.includes(newItem)) {
          setRestaurantInfo(prev => ({ ...prev, cuisines: [...prev.cuisines, newItem] }));
          setCuisineInput("");
        }
      } else if (type === 'amenity') {
        newItem = amenityInput.trim();
        currentItems = restaurantInfo.amenities;
        if (newItem && !currentItems.includes(newItem)) {
          setRestaurantInfo(prev => ({ ...prev, amenities: [...prev.amenities, newItem] }));
          setAmenityInput("");
        }
      } else if (type === 'offer') {
        newItem = specialOfferInput.trim();
        currentItems = restaurantInfo.specialOffers;
        if (newItem && !currentItems.includes(newItem)) {
          setRestaurantInfo(prev => ({ ...prev, specialOffers: [...prev.specialOffers, newItem] }));
          setSpecialOfferInput("");
        }
      }
    }
  };

  const removeItem = (itemToRemove, type) => {
    if (type === 'tag') {
      setRestaurantInfo(prev => ({ ...prev, tags: prev.tags.filter(item => item !== itemToRemove) }));
    } else if (type === 'cuisine') {
      setRestaurantInfo(prev => ({ ...prev, cuisines: prev.cuisines.filter(item => item !== itemToRemove) }));
    } else if (type === 'amenity') {
      setRestaurantInfo(prev => ({ ...prev, amenities: prev.amenities.filter(item => item !== itemToRemove) }));
    } else if (type === 'offer') {
      setRestaurantInfo(prev => ({ ...prev, specialOffers: prev.specialOffers.filter(item => item !== itemToRemove) }));
    }
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

      const dataToSave = Object.fromEntries(
        Object.entries(restaurantInfo).filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0)
        )
      );

      // Keep blank strings so that backend can blank them out
      if (dataToSave.restaurantAddress) {
        dataToSave.restaurantAddress = Object.fromEntries(
          Object.entries(dataToSave.restaurantAddress).filter(
            ([_, value]) => value !== null && value !== undefined
          )
        );
      }
      if (dataToSave.operatingHours) {
        dataToSave.operatingHours = Object.fromEntries(
          Object.entries(dataToSave.operatingHours).filter(
            ([_, value]) =>
              value !== null &&
              value !== undefined &&
              !(Array.isArray(value) && value.length === 0)
          )
        );
      }
      if (dataToSave.bankDetails) {
        dataToSave.bankDetails = Object.fromEntries(
          Object.entries(dataToSave.bankDetails).filter(
            ([_, value]) => value !== null && value !== undefined
          )
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
        setRestaurantInfo(prev => ({
          ...prev,
          ...updatedData,
          about: updatedData.about || "",
          restaurantAddress: { ...prev.restaurantAddress, ...updatedData.restaurantAddress },
          operatingHours: { ...prev.operatingHours, ...updatedData.operatingHours },
          bankDetails: { ...prev.bankDetails, ...updatedData.bankDetails },
          tags: updatedData.tags || [],
          cuisines: updatedData.cuisines || [],
          amenities: updatedData.amenities || [],
          specialOffers: updatedData.specialOffers || [],
          acceptedPaymentModes: updatedData.acceptedPaymentModes || [],
        }));
        setMessage({ text: "Changes saved successfully.", type: "success" });
        setTimeout(() => navigate("/retail"), 1000);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.error || "Failed to save changes."}`, type: "error" });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage({ text: "Failed to save changes due to network error.", type: "error" });
    }
  };

  const dummyImage = 'https://placehold.co/150x150?text=No+Image';

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 && response.data.imageUrl) {
        setRestaurantInfo((prev) => ({
          ...prev,
          [type]: response.data.imageUrl,
        }));
      }
    } catch (err) {
      console.error('Image upload failed:', err.message);
      alert('Failed to upload image.');
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) uploadImage(file, type);
  };

  const removeImage = (type) => {
    setRestaurantInfo((prev) => ({ ...prev, [type]: '' }));
  };

  if (loading) {
    return <Loading />;
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const paymentModes = ['UPI', 'Cash', 'Card', 'NetBanking', 'Other'];
  const restaurantTypes = ['Veg', 'Non-Veg', 'Both'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <RetailHeader restaurantName={restaurantInfo.restaurantName} street={restaurantInfo.restaurantAddress.street} city={restaurantInfo.restaurantAddress.city} state={restaurantInfo.restaurantAddress.state} zipCode={restaurantInfo.restaurantAddress.zipCode} mobileNumber={restaurantInfo.mobileNumber} />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Armchair className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Profile</h1>
              <p className="text-gray-600">Update your restaurant details and settings</p>
            </div>
          </div>

          <button
            onClick={handleSaveChanges}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center"
          >
            <CircleCheck className="mr-2" size={18} />
            Save Changes
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Restaurant Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {restaurantInfo.coverImageUrl ? (
                  <img
                    src={restaurantInfo.coverImageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
                    <span className="text-gray-400">Cover Image</span>
                  </div>
                )}
                <button
                  onClick={() => coverInputRef.current.click()}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  onChange={(e) => handleImageChange(e, 'coverUrl')}
                  className="hidden"
                />

                <div className="absolute -bottom-12 left-6">
                  <div className="relative group h-24 w-24 rounded-full border-4 border-white bg-white shadow-md">
                    <img
                      src={restaurantInfo.logoUrl || dummyImage}
                      alt="Logo"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <button
                      onClick={() => logoInputRef.current.click()}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                    >
                      <Pencil className="text-white" size={16} />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={logoInputRef}
                      onChange={(e) => handleImageChange(e, 'logoUrl')}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 px-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      <input
                        type="text"
                        name="restaurantName"
                        value={restaurantInfo.restaurantName}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none w-full max-w-md"
                        placeholder="Restaurant Name"
                      />
                    </h2>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <MapPin className="mr-1" size={14} />
                      <input
                        type="text"
                        name="restaurantAddress.city"
                        value={restaurantInfo.restaurantAddress.city}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none w-32"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {restaurantInfo.restaurantType && (
                      <span className={`px-2 py-1 text-xs rounded-full ${restaurantInfo.restaurantType === 'Veg' ? 'bg-green-100 text-green-800' :
                        restaurantInfo.restaurantType === 'Non-Veg' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                        {restaurantInfo.restaurantType}
                      </span>
                    )}
                    {restaurantInfo.restaurantCategory && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {restaurantInfo.restaurantCategory}
                      </span>
                    )}
                    {restaurantInfo.ishalal && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Halal
                      </span>
                    )}
                    {restaurantInfo.isjain && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Jain
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    maxLength={500}
                    name="about"
                    value={restaurantInfo.about}
                    onChange={handleInputChange}
                    placeholder="Tell customers about your restaurant..."
                  />
                </div>
              </div>
            </div>

            {/* Contact & Basic Info Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <Phone className="mr-2 text-blue-600" size={18} />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="name"
                    value={restaurantInfo.name}
                    maxLength={15}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={restaurantInfo.email}
                    maxLength={30}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    maxLength={15}
                    value={restaurantInfo.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                  <input
                    type="tel"
                    name="alternateNumber"
                    value={restaurantInfo.alternateNumber}
                    maxLength={15}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <MapPin className="mr-2 text-blue-600" size={18} />
                Address Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      name="restaurantAddress.street"
                      maxLength={50}
                      value={restaurantInfo.restaurantAddress.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                    <input
                      type="text"
                      name="restaurantAddress.area"
                      value={restaurantInfo.restaurantAddress.area}
                      maxLength={50}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="restaurantAddress.city"
                      value={restaurantInfo.restaurantAddress.city}
                      maxLength={30}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="restaurantAddress.state"
                      value={restaurantInfo.restaurantAddress.state}
                      maxLength={30}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="restaurantAddress.zipCode"
                      value={restaurantInfo.restaurantAddress.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="latitude"
                      value={restaurantInfo.latitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="longitude"
                      value={restaurantInfo.longitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                  <input
                    type="url"
                    maxLength={100}
                    name="restaurantAddress.googleMapsUrl"
                    value={restaurantInfo.restaurantAddress.googleMapsUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <FileText className="mr-2 text-blue-600" size={18} />
                Business Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Type</label>
                  <div className="mt-1 space-y-2">
                    {restaurantTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="restaurantType"
                          value={type}
                          checked={restaurantInfo.restaurantType === type}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="restaurantCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="restaurantCategory"
                    name="restaurantCategory"
                    value={restaurantInfo.restaurantCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select a category</option>
                    {rstCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap items-center border border-gray-300 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                    {restaurantInfo.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center m-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeItem(tag, 'tag')}
                          className="ml-1 text-blue-600 hover:text-red-600 focus:outline-none"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'tag')}
                      className="flex-grow py-2 px-2 text-sm focus:outline-none min-w-[100px]"
                      placeholder="Type and press comma"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisines</label>
                  <div className="flex flex-wrap items-center border border-gray-300 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                    {restaurantInfo.cuisines.map((cuisine, index) => (
                      <div
                        key={index}
                        className="flex items-center m-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {cuisine}
                        <button
                          type="button"
                          onClick={() => removeItem(cuisine, 'cuisine')}
                          className="ml-1 text-green-600 hover:text-red-600 focus:outline-none"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={cuisineInput}
                      onChange={(e) => setCuisineInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'cuisine')}
                      className="flex-grow py-2 px-2 text-sm focus:outline-none min-w-[100px]"
                      placeholder="Type and press comma"
                      list="cuisineOptions"
                    />
                    <datalist id="cuisineOptions">
                      {cuisineOptions.map((option, index) => (
                        <option key={index} value={option} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                  <div className="flex flex-wrap items-center border border-gray-300 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                    {restaurantInfo.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center m-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeItem(amenity, 'amenity')}
                          className="ml-1 text-purple-600 hover:text-red-600 focus:outline-none"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'amenity')}
                      className="flex-grow py-2 px-2 text-sm focus:outline-none min-w-[100px]"
                      placeholder="Type and press comma"
                      list="amenityOptions"
                    />
                    <datalist id="amenityOptions">
                      {amenityOptions.map((option, index) => (
                        <option key={index} value={option} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
                  <div className="flex flex-wrap items-center border border-gray-300 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                    {restaurantInfo.specialOffers.map((offer, index) => (
                      <div
                        key={index}
                        className="flex items-center m-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                      >
                        {offer}
                        <button
                          type="button"
                          onClick={() => removeItem(offer, 'offer')}
                          className="ml-1 text-yellow-600 hover:text-red-600 focus:outline-none"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={specialOfferInput}
                      onChange={(e) => setSpecialOfferInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'offer')}
                      className="flex-grow py-2 px-2 text-sm focus:outline-none min-w-[100px]"
                      placeholder="Type and press comma"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="ishalal"
                    checked={restaurantInfo.ishalal}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">Halal Certified</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isjain"
                    checked={restaurantInfo.isjain}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">Jain Food Available</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="takeawayAvailable"
                    checked={restaurantInfo.takeawayAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">Takeaway Available</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="deliveryAvailable"
                    checked={restaurantInfo.deliveryAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">Delivery Available</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="reservationsAvailable"
                    checked={restaurantInfo.reservationsAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">Reservations Available</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="wheelchairAccessible"
                    checked={restaurantInfo.wheelchairAccessible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">Wheelchair Accessible</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={restaurantInfo.seatingCapacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {restaurantInfo.reservationsAvailable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Link</label>
                    <input
                      type="url"
                      name="reservationLink"
                      value={restaurantInfo.reservationLink}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health Protocols</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    name="healthProtocols"
                    value={restaurantInfo.healthProtocols}
                    onChange={handleInputChange}
                    placeholder="Describe your health and safety measures..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    maxLength={20}
                    value={restaurantInfo.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI Number</label>
                  <input
                    type="text"
                    name="fssaiNumber"
                    maxLength={20}
                    value={restaurantInfo.fssaiNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration</label>
                  <input
                    type="text"
                    name="businessRegNumber"
                    maxLength={30}
                    value={restaurantInfo.businessRegNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Settings */}
          <div className="space-y-8">
            {/* Hours Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <Clock className="mr-2 text-blue-600" size={18} />
                Operating Hours
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening</label>
                    <input
                      type="time"
                      name="operatingHours.openingTime"
                      value={restaurantInfo.operatingHours.openingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing</label>
                    <input
                      type="time"
                      name="operatingHours.closingTime"
                      value={restaurantInfo.operatingHours.closingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          value={day}
                          checked={restaurantInfo.operatingHours.workingDays.includes(day)}
                          onChange={handleWorkingDaysChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Online Presence Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <Globe className="mr-2 text-blue-600" size={18} />
                Online Presence
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    maxLength={100}
                    value={restaurantInfo.websiteUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    name="socialMedia.instagram"
                    maxLength={100}
                    value={restaurantInfo.socialMedia.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    name="socialMedia.facebook"
                    maxLength={100}
                    value={restaurantInfo.socialMedia.facebook}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">X (formerly Twitter)</label>
                  <input
                    type="url"
                    name="socialMedia.x"
                    maxLength={100}
                    value={restaurantInfo.socialMedia.x}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Youtube</label>
                  <input
                    type="url"
                    name="socialMedia.youtube"
                    maxLength={100}
                    value={restaurantInfo.socialMedia.youtube}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <CreditCard className="mr-2 text-blue-600" size={18} />
                Payment Options
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods</label>
                  <div className="space-y-2">
                    {paymentModes.map((mode) => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          value={mode}
                          checked={restaurantInfo.acceptedPaymentModes.includes(mode)}
                          onChange={handlePaymentModesChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {restaurantInfo.acceptedPaymentModes.includes('UPI') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (for receiving UPI payments)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={restaurantInfo.upiId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <RetailPassChange />
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in`}>
            {message.type === 'success' ? (
              <CircleCheck className="mr-2" size={20} />
            ) : (
              <X className="mr-2" size={20} />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}