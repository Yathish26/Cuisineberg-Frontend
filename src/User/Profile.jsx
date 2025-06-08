import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Briefcase, Home, LogOut, MapPin, ShoppingBag, Heart, CreditCard, Settings, Plus, CheckCircle } from 'lucide-react'; // Added CheckCircle
import Loading from '../Components/Loading';
import OrderCarts from './OrderCarts';
import Header from '../Header';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('addresses');
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null); // New state to track which address is being edited
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        addresses: []
    });
    const navigate = useNavigate();

    const troubleShoot = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Sample data for Indian States and Cities
    const statesAndCities = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
        "Arunachal Pradesh": ["Itanagar"],
        "Assam": ["Guwahati", "Dibrugarh", "Silchar"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspaiur"],
        "Goa": ["Panaji", "Margao"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        "Haryana": ["Faridabad", "Gurugram", "Panipat"],
        "Himachal Pradesh": ["Shimla", "Dharamshala"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
        "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
        "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
        "Manipur": ["Imphal"],
        "Meghalaya": ["Shillong"],
        "Mizoram": ["Aizawl"],
        "Nagaland": ["Kohima", "Dimapur"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
        "Sikkim": ["Gangtok"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
        "Tripura": ["Agartala"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
        "Andaman and Nicobar Islands": ["Port Blair"],
        "Chandigarh": ["Chandigarh"],
        "Dadra and Nagar Haveli and Daman and Diu": ["Daman"],
        "Delhi": ["New Delhi"],
        "Jammu and Kashmir": ["Srinagar", "Jammu"],
        "Ladakh": ["Leh", "Kargil"],
        "Lakshadweep": ["Kavaratti"],
        "Puducherry": ["Puducherry"]
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); // Fixed localStorage access
        if (!token) {
            troubleShoot();
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        troubleShoot();
                    } else {
                        setError(data.message || 'Something went wrong');
                        troubleShoot();
                    }
                } else {
                    setUser(data);
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        mobileNumber: data.mobileNumber || '',
                        addresses: data.addresses?.length
                            ? data.addresses.map(addr => ({
                                doorNo: addr.doorNo || '',
                                landmark: addr.landmark || '',
                                type: addr.type || '',
                                city: addr.city || '',
                                state: addr.state || '',
                                zipCode: addr.zipCode || '',
                                place: addr.place || ''
                            }))
                            : [{
                                doorNo: '',
                                landmark: '',
                                type: '',
                                city: '',
                                state: '',
                                zipCode: '',
                                place: ''
                            }]
                    });
                }
            } catch (err) {
                console.error('Fetch profile error:', err);
                setError('Failed to fetch profile.');
                troubleShoot();
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e, index, field) => {
        const updatedAddresses = [...formData.addresses];
        updatedAddresses[index][field] = e.target.value;

        if (field === 'state') {
            updatedAddresses[index].city = '';
        }
        setFormData({ ...formData, addresses: updatedAddresses });
    };

    const addAddressField = () => {
        setFormData({
            ...formData,
            addresses: [...formData.addresses, {
                doorNo: '',
                landmark: '',
                type: '',
                city: '',
                state: '',
                zipCode: '',
                place: ''
            }]
        });
        setEditingAddressIndex(formData.addresses.length); // Automatically expand the newly added address
    };

    const removeAddressField = (indexToRemove) => {
        setFormData({
            ...formData,
            addresses: formData.addresses.filter((_, index) => index !== indexToRemove)
        });
        if (editingAddressIndex === indexToRemove) {
            setEditingAddressIndex(null); // Collapse if the deleted address was being edited
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Profile updated successfully!');
                setError('');
                setUser(formData);
                setIsEditing(false);
                setEditingAddressIndex(null); // Exit individual address edit mode
            } else {
                setSuccess('');
                setError(data.message || 'Update failed');
            }
        } catch (err) {
            console.error('Update failed:', err);
            setError('An error occurred while updating.');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingAddressIndex(null); // Exit individual address edit mode
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobileNumber: user.mobileNumber || '',
                addresses: user.addresses?.length
                    ? user.addresses.map(addr => ({
                        doorNo: addr.doorNo || '',
                        landmark: addr.landmark || '',
                        type: addr.type || '',
                        city: addr.city || '',
                        state: addr.state || '',
                        zipCode: addr.zipCode || '',
                        place: addr.place || ''
                    }))
                    : [{
                        doorNo: '',
                        landmark: '',
                        type: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        place: ''
                    }]
            });
        }
        setError('');
        setSuccess('');
    };

    const getAddressIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'work':
                return <Briefcase className="w-5 h-5 text-gray-600" />;
            case 'home':
                return <Home className="w-5 h-5 text-gray-600" />;
            case 'hotel':
                return <MapPin className="w-5 h-5 text-gray-600" />;
            default:
                return <MapPin className="w-5 h-5 text-gray-600" />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatAddress = (address) => {
        const parts = [
            address.doorNo,
            address.landmark,
            address.street,
            address.area,
            address.city,
            address.state,
            address.pincode,
            address.country
        ].filter(Boolean);

        if (parts.length === 0 && (address.doorNo || address.landmark || address.type)) {
            return `${address.doorNo || ''} ${address.landmark || ''} (${address.type || ''})`.trim();
        }
        return parts.join(', ') || 'Full address not available';
    };

    if (error && !isEditing) {
        return <div className="text-red-600 text-center mt-6">{error}</div>;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* <Header /> */}
            {/* Header Section */}
            <div className="bg-blue-900 text-white p-6 md:p-8 shadow-md">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name}</h1>
                        <p className="text-sm md:text-base text-blue-200">
                            {user.mobileNumber || 'Not Provided'} &bull; {user.email}
                        </p>
                    </div>
                    {!isEditing ? (
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center px-4 py-2 bg-white text-blue-900 shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out text-sm font-semibold"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                EDIT PROFILE
                            </button>
                            <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white shadow-lg hover:bg-red-600 transition duration-300 ease-in-out text-sm font-semibold">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-800 shadow-lg hover:bg-gray-400 transition duration-300 ease-in-out text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white shadow-lg hover:bg-red-600 transition duration-300 ease-in-out text-sm font-semibold"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row mt-6 md:mt-8 gap-6 px-4 pb-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm p-4 md:p-6">
                    <ul className="space-y-2">
                        <li className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${activeTab === 'orders' ? 'bg-gray-100 text-blue-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setActiveTab('orders')}>
                            <ShoppingBag className="w-5 h-5 mr-3" />
                            Orders
                        </li>
                        {/* Removed Swiggy One */}
                        <li className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${activeTab === 'favourites' ? 'bg-gray-100 text-blue-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setActiveTab('favourites')}>
                            <Heart className="w-5 h-5 mr-3" />
                            Favourites
                        </li>
                        <li className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${activeTab === 'payments' ? 'bg-gray-100 text-blue-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setActiveTab('payments')}>
                            <CreditCard className="w-5 h-5 mr-3" />
                            Payments
                        </li>
                        <li className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${activeTab === 'addresses' ? 'bg-gray-100 text-blue-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setActiveTab('addresses')}>
                            <MapPin className="w-5 h-5 mr-3" />
                            Addresses
                        </li>
                        <li className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 ${activeTab === 'settings' ? 'bg-gray-100 text-blue-900 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setActiveTab('settings')}>
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                        </li>
                    </ul>
                </div>

                {/* Content Display Area */}
                <div className="w-full md:w-3/4 bg-white rounded-xl shadow-sm p-4 md:p-6">
                    {isEditing ? (
                        // Edit mode content
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Your Profile</h3>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm text-center" role="alert">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 text-sm text-center" role="alert">
                                    {success}
                                </div>
                            )}

                            {/* Personal Info Edit Fields */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 transition duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 transition duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 transition duration-200"
                                />
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-3">Addresses</label>
                            {formData.addresses.map((addr, index) => (
                                <div key={index} className="bg-gray-100 p-5 rounded-lg mb-4 border border-gray-200 space-y-3 relative shadow-sm">
                                    {editingAddressIndex === index ? (
                                        // Expanded edit view for this specific address
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setEditingAddressIndex(null)} // Collapse this address
                                                className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-full bg-white shadow-sm"
                                                aria-label="Done editing address"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Door / Flat No."
                                                value={addr.doorNo}
                                                onChange={(e) => handleAddressChange(e, index, 'doorNo')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Landmark"
                                                value={addr.landmark}
                                                onChange={(e) => handleAddressChange(e, index, 'landmark')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Type (Home / Work / Other)"
                                                value={addr.type}
                                                onChange={(e) => handleAddressChange(e, index, 'type')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                            />

                                            {/* State Dropdown */}
                                            <select
                                                value={addr.state}
                                                onChange={(e) => handleAddressChange(e, index, 'state')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm bg-white"
                                            >
                                                <option value="">Select State</option>
                                                {Object.keys(statesAndCities).map((stateName) => (
                                                    <option key={stateName} value={stateName}>{stateName}</option>
                                                ))}
                                            </select>

                                            {/* City Dropdown */}
                                            <select
                                                value={addr.city}
                                                onChange={(e) => handleAddressChange(e, index, 'city')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm bg-white"
                                                disabled={!addr.state}
                                            >
                                                <option value="">Select City</option>
                                                {addr.state && statesAndCities[addr.state]?.map((cityName) => (
                                                    <option key={cityName} value={cityName}>{cityName}</option>
                                                ))}
                                            </select>

                                            <input
                                                type="text"
                                                placeholder="Zip Code"
                                                value={addr.zipCode}
                                                onChange={(e) => handleAddressChange(e, index, 'zipCode')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Place / Locality"
                                                value={addr.place}
                                                onChange={(e) => handleAddressChange(e, index, 'place')}
                                                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800 text-sm"
                                            />
                                        </>
                                    ) : (
                                        // Compact view with Edit/Delete buttons for this address
                                        <>
                                            <div className="flex items-center mb-3">
                                                {getAddressIcon(addr.type)}
                                                <strong className="ml-2 text-lg text-gray-800 capitalize">{addr.type || 'Unknown'}</strong>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                                {formatAddress(addr)}
                                            </p>
                                            <div className="flex justify-start space-x-3 mt-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingAddressIndex(index)} // Set this address for editing
                                                    className="text-red-500 hover:text-red-600 text-sm font-medium transition duration-300 ease-in-out"
                                                >
                                                    EDIT
                                                </button>
                                                {formData.addresses.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAddressField(index)}
                                                        className="text-red-500 hover:text-red-600 text-sm font-medium transition duration-300 ease-in-out"
                                                    >
                                                        DELETE
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addAddressField}
                                className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100"
                            >
                                <Plus className="w-4 h-4 mr-1.5" /> Add another address
                            </button>
                        </div>
                    ) : (
                        // View mode content based on activeTab
                        <>
                            {activeTab === 'orders' && (
                                <OrderCarts />
                            )}
                            {activeTab === 'favourites' && (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Favourites</h3>
                                    <p className="text-gray-500">Your favourite items and restaurants will be listed here.</p>
                                </div>
                            )}
                            {activeTab === 'payments' && (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Payments</h3>
                                    <p className="text-gray-500">Your saved payment methods will be displayed here.</p>
                                </div>
                            )}
                            {activeTab === 'addresses' && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-6">Your Addresses</h3>
                                    {user.addresses && user.addresses.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {user.addresses.map((address, idx) => (
                                                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center mb-3">
                                                            {getAddressIcon(address.type)}
                                                            <strong className="ml-2 text-lg text-gray-800 capitalize">{address.type || 'Unknown'}</strong>
                                                        </div>
                                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                                            {formatAddress(address)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-md text-gray-500 p-4 bg-gray-50 rounded-lg">No addresses found.</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 'settings' && (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Settings</h3>
                                    <p className="text-gray-500">Manage your account settings here.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
