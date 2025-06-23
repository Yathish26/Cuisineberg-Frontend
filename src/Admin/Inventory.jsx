import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Plus, X, Search, Image, Edit2, Trash2, Package,
    ChevronDown, Check, ArrowUpDown, Calendar, Filter
} from 'lucide-react';

// Custom CSS for a simple spinner
const spinnerStyles = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #3B82F6; /* Blue color for the spinner */
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
`;

// Add Item Modal Component
const AddItemModal = ({ show, onClose, onAddItem, isLoading, itemName, setItemName, photoURLs, setPhotoURLs, handleAddPhotoField, handlePhotoChange }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg md:rounded-xl shadow-2xl w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Add New Item</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                            <input
                                type="text"
                                id="itemName"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="e.g., Spicy Paneer Tikka"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URLs</label>
                            <div className="space-y-2">
                                {photoURLs.map((url, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => handlePhotoChange(index, e.target.value)}
                                            className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder={`Image URL ${index + 1}`}
                                        />
                                        {photoURLs.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setPhotoURLs(prevURLs => prevURLs.filter((_, i) => i !== index))}
                                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                aria-label="Remove photo URL"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddPhotoField}
                                className="mt-2 flex items-center text-xs md:text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                Add another image
                            </button>
                        </div>

                        <button
                            onClick={onAddItem}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center text-sm md:text-base shadow-md hover:shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner w-4 h-4 mr-2"></div>
                                    Adding...
                                </>
                            ) : (
                                'Add Item'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter Modal Component (Search removed from here)
const FilterModal = ({ show, onClose, sortOption, setSortOption, showNoPhotosFirst, setShowNoPhotosFirst }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg md:rounded-xl shadow-2xl w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">Sort & Options</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <div>
                            <label htmlFor="sortModal" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                id="sortModal"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="date-newest">Date (Newest)</option>
                                <option value="date-oldest">Date (Oldest)</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">No photos first</span>
                            <button
                                type="button"
                                onClick={() => setShowNoPhotosFirst(!showNoPhotosFirst)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showNoPhotosFirst ? 'bg-blue-600' : 'bg-gray-200'}`}
                                role="switch"
                                aria-checked={showNoPhotosFirst}
                            >
                                <span className="sr-only">Toggle "No photos first"</span>
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${showNoPhotosFirst ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </button>
                        </div>

                        <div className="flex justify-end pt-3 md:pt-4">
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center shadow-md hover:shadow-lg"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [photoURLs, setPhotoURLs] = useState(['']);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhotoURLs, setEditPhotoURLs] = useState(['']);
    const [search, setSearch] = useState('');
    const [showNoPhotosFirst, setShowNoPhotosFirst] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [sortOption, setSortOption] = useState('name-asc');
    // Removed isSortOpen state as it's no longer needed for mobile sort dropdown
    const [showAddItemModal, setShowAddItemModal] = useState(false); // State for Add Item Modal
    const [showFilterModal, setShowFilterModal] = useState(false);   // State for Filter Modal

    // Function to fetch items from the API
    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            // Replace with your actual API endpoint
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`);
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect hook to fetch items on component mount
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Handles adding a new photo URL input field when adding an item
    const handleAddPhotoField = () => {
        setPhotoURLs(prevURLs => [...prevURLs, '']);
    };

    // Updates the photo URL at a specific index when adding an item
    const handlePhotoChange = (index, value) => {
        const newPhotoURLs = [...photoURLs];
        newPhotoURLs[index] = value;
        setPhotoURLs(newPhotoURLs);
    };

    // Handles adding a new inventory item
    const handleAddItem = async () => {
        if (!itemName.trim()) {
            console.log("Item name cannot be empty.");
            return;
        }
        setIsLoading(true);
        try {
            const newItem = { name: itemName.trim(), photos: photoURLs.filter(url => url.trim()) };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`, newItem);
            setItemName('');
            setPhotoURLs(['']);
            setShowAddItemModal(false); // Close modal after adding
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Sets the state for editing an existing item
    const handleEdit = (item) => {
        setEditingId(item._id);
        setEditName(item.name);
        setEditPhotoURLs(item.photos && item.photos.length > 0 ? item.photos : ['']);
    };

    // Updates the photo URL at a specific index when editing an item
    const handleEditChange = (index, value) => {
        const newURLs = [...editPhotoURLs];
        newURLs[index] = value;
        setEditPhotoURLs(newURLs);
    };

    // Handles adding a new photo URL input field when editing an item
    const handleAddEditField = () => {
        setEditPhotoURLs(prevURLs => [...prevURLs, '']);
    };

    // Handles updating an existing inventory item
    const handleUpdateItem = async () => {
        if (!editName.trim()) {
            console.log("Item name cannot be empty for edit.");
            return;
        }
        setIsLoading(true);
        try {
            const updatedItem = { name: editName.trim(), photos: editPhotoURLs.filter(url => url.trim()) };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${editingId}`, updatedItem);
            setEditingId(null);
            setEditName('');
            setEditPhotoURLs(['']);
            fetchItems();
        } catch (error) {
            console.error("Error updating item:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handles deleting an inventory item
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return; // Consider custom modal
        setIsLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${id}`);
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filters and sorts items based on search term, active tab, and sort option
    const filteredItems = items
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            if (activeTab === 'withPhotos') return matchesSearch && item.photos?.length > 0;
            if (activeTab === 'withoutPhotos') return matchesSearch && (!item.photos || item.photos.length === 0);
            return matchesSearch;
        })
        .sort((a, b) => {
            if (showNoPhotosFirst) {
                const aHasPhotos = a.photos && a.photos.length > 0;
                const bHasPhotos = b.photos && b.photos.length > 0;
                if (!aHasPhotos && bHasPhotos) return -1;
                if (aHasPhotos && !bHasPhotos) return 1;
            }

            switch (sortOption) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-newest':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case 'date-oldest':
                    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                default:
                    return 0;
            }
        });

    return (
        <>
            <style>{spinnerStyles}</style>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-6 md:mb-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Inventory Management</h1>
                        <p className="text-sm md:text-base text-gray-600">Manage your product catalog efficiently</p>
                    </div>

                    {/* Mobile: Search Bar, Action Buttons (Add Item & Filter), and Tabs */}
                    <div className="flex flex-col lg:hidden mb-4 space-y-3">
                        {/* Mobile Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                id="mobileSearch"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Search items..."
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            {/* Add Item Button for Mobile */}
                            <button
                                onClick={() => setShowAddItemModal(true)}
                                className="flex-grow flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors text-sm"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add New Item
                            </button>
                            {/* Filter Button for Mobile (now only for sorting/no photos first) */}
                            <button
                                onClick={() => setShowFilterModal(true)}
                                className="flex-shrink-0 flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors text-sm"
                            >
                                <Filter className="h-4 w-4 mr-1" /> Sort/Options
                            </button>
                        </div>
                        {/* Mobile Tab Buttons */}
                        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-full transition-colors duration-200 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveTab('withPhotos')}
                                className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-full transition-colors duration-200 ${activeTab === 'withPhotos' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                            >
                                With Photos
                            </button>
                            <button
                                onClick={() => setActiveTab('withoutPhotos')}
                                className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-full transition-colors duration-200 ${activeTab === 'withoutPhotos' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
                            >
                                Without Photos
                            </button>
                        </div>
                    </div>

                    {/* Main Content Grid Layout - Sidebar on larger screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Sidebar for Add New Item and Filters (visible only on lg+) */}
                        <div className="hidden lg:block lg:col-span-1 space-y-4 md:space-y-6">
                            {/* Add New Item Card (Desktop) */}
                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Add New Item</h3>
                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <label htmlFor="itemNameDesktop" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                        <input
                                            type="text"
                                            id="itemNameDesktop"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="e.g., Spicy Paneer Tikka"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo URLs</label>
                                        <div className="space-y-2">
                                            {photoURLs.map((url, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={url}
                                                        onChange={(e) => handlePhotoChange(index, e.target.value)}
                                                        className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                        placeholder={`Image URL ${index + 1}`}
                                                    />
                                                    {photoURLs.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPhotoURLs(prevURLs => prevURLs.filter((_, i) => i !== index))}
                                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                            aria-label="Remove photo URL"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddPhotoField}
                                            className="mt-2 flex items-center text-xs md:text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                            Add another image
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddItem}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center text-sm md:text-base shadow-md hover:shadow-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="spinner w-4 h-4 mr-2"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Item'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Filters Card (Desktop) */}
                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Filters</h3>
                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <label htmlFor="searchDesktop" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="searchDesktop"
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Search items..."
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="sortDesktop" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                        <select
                                            id="sortDesktop"
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        >
                                            <option value="name-asc">Name (A-Z)</option>
                                            <option value="name-desc">Name (Z-A)</option>
                                            <option value="date-newest">Date (Newest)</option>
                                            <option value="date-oldest">Date (Oldest)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">No photos first</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowNoPhotosFirst(!showNoPhotosFirst)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showNoPhotosFirst ? 'bg-blue-600' : 'bg-gray-200'}`}
                                            role="switch"
                                            aria-checked={showNoPhotosFirst}
                                        >
                                            <span className="sr-only">Toggle "No photos first"</span>
                                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${showNoPhotosFirst ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {/* Tabs for larger screens (hidden on mobile) */}
                            <div className="hidden lg:flex border-b border-gray-200 mb-4 md:mb-6">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    All Items
                                </button>
                                <button
                                    onClick={() => setActiveTab('withPhotos')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'withPhotos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    With Photos
                                </button>
                                <button
                                    onClick={() => setActiveTab('withoutPhotos')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'withoutPhotos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Without Photos
                                </button>
                            </div>

                            {/* Conditional Rendering: Loading, No Items, or Item Grid */}
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12 md:py-20 bg-white rounded-xl shadow-sm">
                                    <div className="text-center">
                                        <div className="spinner w-12 h-12 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading your inventory...</p>
                                    </div>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center border border-gray-200">
                                    <Package className="h-10 w-10 mx-auto text-gray-400" />
                                    <h3 className="mt-3 text-base md:text-lg font-medium text-gray-900">No items found</h3>
                                    <p className="mt-1 text-sm text-gray-500">{search ? 'Try adjusting your search' : 'Add your first item to get started'}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {filteredItems.map((item) => (
                                        <div key={item._id} className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow group relative">
                                            {/* Item Image Display */}
                                            <div className="relative w-full pb-[100%] bg-gray-50"> {/* Use pb for aspect ratio */}
                                                {item.photos && item.photos.length > 0 ? (
                                                    <img
                                                        src={item.photos[0]}
                                                        alt={item.name}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://placehold.co/400x400/E5E7EB/6B7280?text=No+Image";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-400">
                                                        <Image className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item Information */}
                                            <div className="p-3 md:p-4">
                                                <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-1">{item.name}</h3>
                                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                                    <span>{item.photos?.length || 0} photos</span>
                                                    <span className="mx-1.5">•</span>
                                                    <span>{new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons (Edit, Delete) */}
                                            <div className="absolute top-2 right-2 flex space-x-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-1.5 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                                    aria-label="Edit"
                                                >
                                                    <Edit2 className="h-3 w-3 md:h-4 md:w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Render Add Item Modal */}
                <AddItemModal
                    show={showAddItemModal}
                    onClose={() => setShowAddItemModal(false)}
                    onAddItem={handleAddItem}
                    isLoading={isLoading}
                    itemName={itemName}
                    setItemName={setItemName}
                    photoURLs={photoURLs}
                    setPhotoURLs={setPhotoURLs}
                    handleAddPhotoField={handleAddPhotoField}
                    handlePhotoChange={handlePhotoChange}
                />

                {/* Render Filter Modal */}
                <FilterModal
                    show={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    // Removed search, setSearch from props as it's now a direct input
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    showNoPhotosFirst={showNoPhotosFirst}
                    setShowNoPhotosFirst={setShowNoPhotosFirst}
                />

                {/* Edit Item Modal (Existing) */}
                {editingId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-lg md:rounded-xl shadow-2xl w-full max-w-md animate-scale-in max-h-[90vh] overflow-y-auto">
                            <div className="p-4 md:p-6">
                                <div className="flex justify-between items-center mb-3 md:mb-4">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Edit Item</h3>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditName('');
                                            setEditPhotoURLs(['']);
                                        }}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5 md:h-6 md:w-6" />
                                    </button>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <label htmlFor="editItemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                        <input
                                            type="text"
                                            id="editItemName"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo URLs</label>
                                        <div className="space-y-2">
                                            {editPhotoURLs.map((url, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={url}
                                                        onChange={(e) => handleEditChange(index, e.target.value)}
                                                        className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                        placeholder={`Image URL ${index + 1}`}
                                                    />
                                                    {editPhotoURLs.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditPhotoURLs(prevURLs => prevURLs.filter((_, i) => i !== index))}
                                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                            aria-label="Remove photo URL"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddEditField}
                                            className="mt-2 flex items-center text-xs md:text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                            Add another image
                                        </button>
                                    </div>

                                    <div className="flex justify-end space-x-2 md:space-x-3 pt-3 md:pt-4">
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditName('');
                                                setEditPhotoURLs(['']);
                                            }}
                                            className="px-3 py-1.5 md:px-4 md:py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateItem}
                                            className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center shadow-md hover:shadow-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="spinner w-4 h-4 mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}