import { LogOut, Pencil, User, MapPin, Phone, ChevronDown } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function RetailHeader({ restaurantName, street, city, state, zipCode, mobileNumber }) {
    const [options, setOptions] = useState(false);
    const navigate = useNavigate();

    const handleOptions = (e) => {
        e.stopPropagation();
        setOptions(!options);
    }

    const handleLogout = () => {
        localStorage.removeItem('retailtoken');
        navigate('/retail/login');
    };

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-row justify-between items-start md:items-end gap-6">
                    {/* Restaurant Info */}
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {restaurantName || 'Restaurant Dashboard'}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base">
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1.5 text-blue-200" />
                                <span>
                                    {street || 'Street'},
                                    {city || 'City'},
                                    {state || 'State'} -
                                    {zipCode || 'Zipcode'}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1.5 text-blue-200" />
                                <span>{mobileNumber || '+123-456-7890'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex relative">
                        <div
                            className="relative"
                            onMouseEnter={() => setOptions(true)}
                            onMouseLeave={() => setOptions(false)}
                        >
                            <button
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${options
                                        ? 'bg-white text-blue-600 shadow-md hover:bg-blue-50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                <span>Options</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${options ? 'rotate-180' : ''}`} />
                            </button>

                            {options && (
                                <div
                                    className="absolute top-full pt-2 right-0" // Added pt-2 for padding top
                                    onMouseEnter={() => setOptions(true)}
                                    onMouseLeave={() => setOptions(false)}
                                >
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-56 z-50 overflow-hidden">
                                        <div className="py-1">
                                            <button
                                                onClick={() => navigate('/retail/edit')}
                                                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <Pencil className="mr-3 h-5 w-5 text-gray-400" />
                                                <span className="text-sm font-medium">Edit Profile</span>
                                            </button>

                                            <button
                                                onClick={() => navigate('/retail/profile')}
                                                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <User className="mr-3 h-5 w-5 text-gray-400" />
                                                <span className="text-sm font-medium">View Profile</span>
                                            </button>

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                                            >
                                                <LogOut className="mr-3 h-5 w-5 text-red-400" />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}