import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Home, MapPin, Plus } from 'lucide-react'; // Removed Edit, Trash2 as icons are no longer used on buttons

export default function Addresses({ user }) {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressFormData, setAddressFormData] = useState({
        doorNo: '',
        landmark: '',
        street: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        type: 'home',
    });

    // States for Geo Data (Countries, States, Cities)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [statesFull, setStatesFull] = useState([]); // To store full state objects for city filtering
    const [cities, setCities] = useState([]);
    const [loadingGeoData, setLoadingGeoData] = useState(false);

    // States for custom delete confirmation popup
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [addressToDeleteConfirm, setAddressToDeleteConfirm] = useState(null);
    const [confirmDialogPosition, setConfirmDialogPosition] = useState({ top: 0, left: 0 });
    const deleteButtonRef = useRef(null); // Ref to position the popup relative to the clicked button

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

    const token = localStorage.getItem("token");

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
            const basicParts = [
                address.doorNo,
                address.landmark,
                address.street,
                address.area,
                address.city,
                address.state,
                address.pincode,
                address.country
            ].filter(Boolean);
            if (basicParts.length === 0 && address.type) {
                return `${address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address`;
            }
            return basicParts.join(', ').trim();
        }
        return parts.join(', ') || 'Full address not available';
    };

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setAddressFormData({
            doorNo: '',
            landmark: '',
            street: '',
            area: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            type: 'home',
        });
        setStates([]); // Clear states and cities when adding new address
        setCities([]);
        setShowAddressForm(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setAddressFormData({
            doorNo: address.doorNo || '',
            landmark: address.landmark || '',
            street: address.street || '',
            area: address.area || '',
            city: address.city || '',
            state: address.state || '',
            pincode: address.pincode || '',
            country: address.country || '',
            type: address.type || 'home',
        });
        setShowAddressForm(true);
    };

    const handleAddressFormChange = (e) => {
        const { name, value } = e.target;
        setAddressFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'country') {
            setAddressFormData(prev => ({ ...prev, state: '', city: '' })); // Reset state and city on country change
            setStates([]);
            setCities([]);
        } else if (name === 'state') {
            setAddressFormData(prev => ({ ...prev, city: '' })); // Reset city on state change
            setCities([]);
        }
    };

    const handleCancelAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();

        let updatedAddresses;
        if (editingAddress) {
            updatedAddresses = user.addresses.map(addr =>
                addr === editingAddress ? { ...addressFormData } : addr
            );
        } else {
            updatedAddresses = [...(user.addresses || []), { ...addressFormData }];
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ addresses: updatedAddresses }),
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                setShowAddressForm(false);
                setEditingAddress(null);
            } else {
                const errorData = await response.json();
            }
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    // --- Delete Confirmation Logic ---
    const handleConfirmDelete = (address, event) => {
        setAddressToDeleteConfirm(address);
        setShowConfirmDelete(true);

        // Position the popup near the delete button
        if (event.target) {
            const rect = event.target.getBoundingClientRect();
            setConfirmDialogPosition({
                top: rect.bottom + window.scrollY + 10, // 10px below the button
                left: rect.left + window.scrollX - (150 / 2) + (rect.width / 2) // Center popover with button
            });
        }
    };

    const handleActualDelete = async () => {
        if (!addressToDeleteConfirm) return;

        
        if (!token) {
            setShowConfirmDelete(false);
            setAddressToDeleteConfirm(null);
            return;
        }

        const updatedAddresses = user.addresses.filter(addr => addr !== addressToDeleteConfirm);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ addresses: updatedAddresses }),
            });

            if (response.ok) {
                const updatedUserData = await response.json();
            } else {
                const errorData = await response.json();
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        } finally {
            setShowConfirmDelete(false);
            setAddressToDeleteConfirm(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setAddressToDeleteConfirm(null);
    };

    // Close confirmation dialog on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (deleteButtonRef.current && !deleteButtonRef.current.contains(event.target) && showConfirmDelete) {
                // If the click is outside the button that triggered it, and also outside the dialog itself (handled by its own structure)
                // This might need refinement based on the exact positioning and structure of the dialog.
                // A simpler way is to have an overlay that intercepts clicks and closes the dialog.
                // For this simple popup, we'll ensure it closes only if the button is not clicked.
            }
        };

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                handleCancelDelete();
            }
        };

        if (showConfirmDelete) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', closeOnEscape);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', closeOnEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [showConfirmDelete]);

    // --- Geo Data Fetching Effects ---

    // Fetch countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            setLoadingGeoData(true);
            try {
                const response = await fetch('https://raw.githubusercontent.com/mustafasolak/country_state_city/refs/heads/main/countries.json');
                const json = await response.json();

                const countriesTable = json.find(entry => entry.type === 'table' && entry.name === 'tbl_countries');
                if (countriesTable && Array.isArray(countriesTable.data)) {
                    const sortedCountries = countriesTable.data.sort((a, b) => a.name.localeCompare(b.name));
                    setCountries(sortedCountries);

                    // If editing, set the country to trigger state fetch
                    if (editingAddress?.country) {
                        setAddressFormData(prev => ({ ...prev, country: editingAddress.country }));
                    } else if (!addressFormData.country && sortedCountries.length > 0) {
                        // Optionally set a default country if not editing and none selected
                        // setAddressFormData(prev => ({ ...prev, country: sortedCountries[0].name }));
                    }

                } else {
                    throw new Error('Countries data not found');
                }
            } catch (error) {
                console.error("Failed to fetch countries:", error);
            } finally {
                setLoadingGeoData(false);
            }
        };

        fetchCountries();
    }, []); // Run once on component mount

    // Fetch states when country changes or on edit
    useEffect(() => {
        const fetchStates = async () => {
            const selectedCountryName = addressFormData.country;
            if (!selectedCountryName) {
                setStates([]);
                setStatesFull([]);
                setCities([]);
                return;
            }

            setLoadingGeoData(true);
            setStates([]);
            setCities([]);

            try {
                const response = await fetch('https://raw.githubusercontent.com/mustafasolak/country_state_city/refs/heads/main/states.json');
                const json = await response.json();

                const statesTable = json.find(entry => entry.type === 'table' && entry.name === 'tbl_states');
                if (!statesTable) throw new Error('States data not found');

                const countryObj = countries.find(c => c.name === selectedCountryName);
                if (!countryObj) throw new Error('Selected country not found');

                const filteredStates = statesTable.data.filter(state => state.country_id === countryObj.id); // Note: country_id not countryId
                setStates(filteredStates.map(s => s.name).sort());
                setStatesFull(filteredStates); // Keep full objects for city lookup

                if (editingAddress?.state && editingAddress.country === selectedCountryName) {
                    setAddressFormData(prev => ({ ...prev, state: editingAddress.state }));
                }

            } catch (error) {
                console.error('Failed to fetch states:', error);
            } finally {
                setLoadingGeoData(false);
            }
        };

        // Only fetch if countries are loaded and a country is selected
        if (countries.length > 0 || addressFormData.country) { // Ensure countries are loaded or a country is set for edit
            fetchStates();
        }
    }, [addressFormData.country, countries, editingAddress]); // Added editingAddress to dependencies for pre-fill logic

    // Fetch cities when state changes or on edit
    useEffect(() => {
        const fetchCities = async () => {
            const selectedStateName = addressFormData.state;
            if (!selectedStateName) {
                setCities([]);
                return;
            }

            setLoadingGeoData(true);
            setCities([]);

            try {
                const response = await fetch('https://raw.githubusercontent.com/mustafasolak/country_state_city/refs/heads/main/cities.json');
                const json = await response.json();

                const citiesTable = json.find(entry => entry.type === 'table' && entry.name === 'tbl_cities');
                if (!citiesTable) throw new Error('Cities data not found');

                const selectedStateObj = statesFull.find(state => state.name === selectedStateName);
                if (!selectedStateObj) throw new Error('Selected state not found');

                const filteredCities = citiesTable.data.filter(city => city.state_id === selectedStateObj.id); // Note: state_id not stateId
                setCities(filteredCities.map(c => c.name).sort());

                if (editingAddress?.city && editingAddress.state === selectedStateName) {
                    setAddressFormData(prev => ({ ...prev, city: editingAddress.city }));
                }

            } catch (error) {
                console.error('Failed to fetch cities:', error);
            } finally {
                setLoadingGeoData(false);
            }
        };

        // Only fetch if states are loaded and a state is selected
        if (statesFull.length > 0 || addressFormData.state) { // Ensure states are loaded or a state is set for edit
            fetchCities();
        }
    }, [addressFormData.state, statesFull, editingAddress]); // Added editingAddress to dependencies for pre-fill logic


    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Addresses</h3>

            {showAddressForm ? (
                // Address Add/Edit Form
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                    <form onSubmit={handleSaveAddress}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Address Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={addressFormData.type}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="doorNo" className="block text-sm font-medium text-gray-700">Door/Flat No.</label>
                                <input
                                    type="text"
                                    id="doorNo"
                                    name="doorNo"
                                    value={addressFormData.doorNo}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                                <input
                                    type="text"
                                    id="landmark"
                                    name="landmark"
                                    value={addressFormData.landmark}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street / Locality</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={addressFormData.street}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
                                <input
                                    type="text"
                                    id="area"
                                    name="area"
                                    value={addressFormData.area}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Country Dropdown */}
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={addressFormData.country}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    disabled={loadingGeoData}
                                >
                                    <option value="">Select Country</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.name}>{country.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* State Dropdown */}
                            <div>
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                <select
                                    id="state"
                                    name="state"
                                    value={addressFormData.state}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    disabled={loadingGeoData || states.length === 0}
                                >
                                    <option value="">Select State</option>
                                    {states.map(stateName => (
                                        <option key={stateName} value={stateName}>{stateName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Dropdown */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <select
                                    id="city"
                                    name="city"
                                    value={addressFormData.city}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    disabled={loadingGeoData || cities.length === 0}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(cityName => (
                                        <option key={cityName} value={cityName}>{cityName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={addressFormData.pincode}
                                    onChange={handleAddressFormChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCancelAddressForm}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Save Address
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Display existing addresses and the "Add New Address" box
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((address, idx) => (
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
                                <div className="flex space-x-2 mt-4">
                                    <button
                                        onClick={() => handleEditAddress(address)}
                                        className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        ref={deleteButtonRef} // Attach ref for positioning
                                        onClick={(e) => handleConfirmDelete(address, e)}
                                        className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            <p className="mb-4">You haven't added any addresses yet.</p>
                        </div>
                    )}

                    <div
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-5 rounded-xl shadow-sm border-2 border-blue-300 border-dashed
                                   flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 min-h-[180px]"
                        onClick={handleAddNewAddress}
                    >
                        <Plus className="w-12 h-12 mb-2" />
                        <span className="text-lg font-semibold">Add New Address</span>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Popup */}
            {showConfirmDelete && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center"
                    onClick={handleCancelDelete} // Close on overlay click
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-xl text-center"
                        onClick={e => e.stopPropagation()} // Prevent click from bubbling to overlay
                        style={{
                          position: 'absolute',
                          top: confirmDialogPosition.top,
                          left: confirmDialogPosition.left,
                          transform: 'translate(-50%, 0)', // Center horizontally relative to its own left
                          zIndex: 60, // Ensure it's above the overlay
                        }}
                    >
                        <p className="text-lg font-semibold mb-4">Are you sure you want to delete this address?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleActualDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
