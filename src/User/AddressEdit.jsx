import React from 'react'

export default function AddressEdit() {
    return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-3">Addresses</label>
            {
                formData.addresses.map((addr, index) => (
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
                ))
            }

            <button
                type="button"
                onClick={addAddressField}
                className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100"
            >
                <Plus className="w-4 h-4 mr-1.5" /> Add another address
            </button>
        </>
    )
}
