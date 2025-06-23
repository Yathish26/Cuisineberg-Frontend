import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export default function RetailRegister() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        restaurantName: '',
        mobileNumber: '',
        restaurantAddress: {
            street: '',
            area: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [statesFull, setStatesFull] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingGeoData, setLoadingGeoData] = useState(false);

    const inputClass = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
    const labelClass = "block text-sm font-medium text-gray-700";

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
                } else {
                    throw new Error('Countries data not found');
                }
            } catch (error) {
                console.error("Failed to fetch countries:", error);
                setMessage('Failed to load countries.');
            } finally {
                setLoadingGeoData(false);
            }
        };

        fetchCountries();
    }, []);


    // Fetch states when country changes
    useEffect(() => {
        const fetchStates = async () => {
            const selectedCountryName = formData.restaurantAddress.country;
            if (!selectedCountryName) return;

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

                const filteredStates = statesTable.data.filter(state => state.countryId === countryObj.id);
                setStates(filteredStates.map(s => s.name).sort());
                setStatesFull(filteredStates);
            } catch (error) {
                console.error('Failed to fetch states:', error);
                setMessage('Failed to load states.');
            } finally {
                setLoadingGeoData(false);
            }
        };

        fetchStates();
    }, [formData.restaurantAddress.country, countries]);

    // Fetch cities when state changes
    useEffect(() => {
        const fetchCities = async () => {
            const selectedStateName = formData.restaurantAddress.state;
            if (!selectedStateName) return;

            setLoadingGeoData(true);
            setCities([]);

            try {
                const response = await fetch('https://raw.githubusercontent.com/mustafasolak/country_state_city/refs/heads/main/cities.json');
                const json = await response.json();

                const citiesTable = json.find(entry => entry.type === 'table' && entry.name === 'tbl_cities');
                if (!citiesTable) throw new Error('Cities data not found');

                const selectedStateObj = statesFull.find(state => state.name === selectedStateName);
                if (!selectedStateObj) throw new Error('Selected state not found');

                const filteredCities = citiesTable.data.filter(city => city.stateId === selectedStateObj.id);
                setCities(filteredCities.map(c => c.name).sort());
            } catch (error) {
                console.error('Failed to fetch cities:', error);
                setMessage('Failed to load cities.');
            } finally {
                setLoadingGeoData(false);
            }
        };

        fetchCities();
    }, [formData.restaurantAddress.state, statesFull]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "country" || name === "state" || name === "city" || name === "street" || name === "zipCode" || name === "area") {
            setFormData(prev => ({ ...prev, restaurantAddress: { ...prev.restaurantAddress, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        // Basic validation before sending
        if (!formData.name || !formData.email || !formData.password || !formData.restaurantName || !formData.mobileNumber ||
            !formData.restaurantAddress.street || !formData.restaurantAddress.country ||
            !formData.restaurantAddress.state || !formData.restaurantAddress.city || !formData.restaurantAddress.zipCode) {
            setMessage('Please fill in all required fields.');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (res.ok) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/retail/login'), 2000);
            } else {
                setMessage('Error: ' + (result.error || 'Something went wrong.'));
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setMessage('Registration failed due to a network error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">
            <Header/>
            <div className="max-w-md w-full bg-white/90 p-8 my-8 shadow-2xl rounded-lg border border-blue-100">
                <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center tracking-tight">Create Retail Account</h2>
                <p className="text-center text-gray-500 mb-6">Join Cuisineberg and grow your business</p>

                {message && (
                    <div className={`mb-4 text-center text-sm px-4 py-2 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div>
                        <label htmlFor="name" className={labelClass}>Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                            required
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                            required
                            placeholder="you@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                            required
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <label htmlFor="restaurantName" className={labelClass}>Restaurant Name</label>
                        <input
                            type="text"
                            id="restaurantName"
                            name="restaurantName"
                            autoComplete="organization"
                            value={formData.restaurantName}
                            onChange={handleChange}
                            className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                            required
                            placeholder="Your Restaurant's Name"
                        />
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-4 pt-4 border-t border-blue-100">
                        <h3 className="text-xl font-bold text-blue-600 mb-2">Restaurant Address</h3>
                        <div>
                            <label htmlFor="street" className={labelClass}>Street Address</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                autoComplete="street-address"
                                value={formData.restaurantAddress.street}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                                required
                                placeholder="Street Address"
                            />
                        </div>
                        <div>
                            <label htmlFor="area" className={labelClass}>Area (Optional)</label>
                            <input
                                type="text"
                                id="area"
                                name="area"
                                value={formData.restaurantAddress.area}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                                placeholder="e.g., Kinnigoli"
                            />
                        </div>

                        {/* Country Dropdown */}
                        <div>
                            <label htmlFor="country" className={labelClass}>Country</label>
                            <select
                                id="country"
                                name="country"
                                value={formData.restaurantAddress.country}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                                required
                                disabled={loadingGeoData}
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {loadingGeoData && <p className="text-blue-500 text-xs mt-1">Loading countries...</p>}
                        </div>

                        {/* State Dropdown */}
                        <div>
                            <label htmlFor="state" className={labelClass}>State</label>
                            <select
                                id="state"
                                name="state"
                                value={formData.restaurantAddress.state}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                                required
                                disabled={!formData.restaurantAddress.country || loadingGeoData} // Disable if no country selected or loading
                            >
                                <option value="">Select State</option>
                                {states.map((stateName) => (
                                    <option key={stateName} value={stateName}>{stateName}</option>
                                ))}
                            </select>
                            {loadingGeoData && formData.restaurantAddress.country && <p className="text-blue-500 text-xs mt-1">Loading states...</p>}
                        </div>

                        {/* City Dropdown */}
                        <div>
                            <label htmlFor="city" className={labelClass}>City</label>
                            <select
                                id="city"
                                name="city"
                                value={formData.restaurantAddress.city}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                                required
                                disabled={!formData.restaurantAddress.state || loadingGeoData} // Disable if no state selected or loading
                            >
                                <option value="">Select City</option>
                                {cities.map((cityName) => (
                                    <option key={cityName} value={cityName}>{cityName}</option>
                                ))}
                            </select>
                            {loadingGeoData && formData.restaurantAddress.state && <p className="text-blue-500 text-xs mt-1">Loading cities...</p>}
                        </div>

                        <div>
                            <label htmlFor="zipCode" className={labelClass}>ZIP Code</label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                autoComplete="postal-code"
                                value={formData.restaurantAddress.zipCode}
                                onChange={handleChange}
                                className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                                required
                                placeholder="e.g., 575001"
                            />
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label htmlFor="mobileNumber" className={labelClass}>Mobile Number</label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            autoComplete="tel"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className={`${inputClass} mt-1 bg-blue-50/50 border-blue-200 focus:ring-blue-400`}
                            required
                            placeholder="e.g., +91 98765 43210"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 font-semibold shadow-md transition duration-300 rounded-md mt-2"
                        disabled={loadingGeoData} // Disable submit button while geo data is loading
                    >
                        {loadingGeoData ? 'Loading...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link to="/retail/login" className="text-blue-600 font-medium hover:underline">Login</Link>
                </p>
            </div>
            <Footer />
        </div>
    );
}