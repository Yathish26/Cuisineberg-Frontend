import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner'; // For the loading spinner

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

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`);
            setItems(res.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleAddPhotoField = () => {
        setPhotoURLs(prevURLs => [...prevURLs, '']);
    };

    const handlePhotoChange = (index, value) => {
        const newPhotoURLs = [...photoURLs];
        newPhotoURLs[index] = value;
        setPhotoURLs(newPhotoURLs);
    };

    const handleAddItem = async () => {
        if (!itemName.trim()) {
            window.alert("Item name cannot be empty.");
            return;
        }
        setIsLoading(true);
        try {
            const newItem = { name: itemName.trim(), photos: photoURLs.filter(url => url.trim()) };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`, newItem);
            setItemName('');
            setPhotoURLs(['']);
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
            window.alert("Failed to add item.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setEditName(item.name);
        setEditPhotoURLs(item.photos && item.photos.length > 0 ? item.photos : ['']); // Ensure at least one empty string for new photos
    };

    const handleEditChange = (index, value) => {
        const newURLs = [...editPhotoURLs];
        newURLs[index] = value;
        setEditPhotoURLs(newURLs);
    };

    const handleAddEditField = () => {
        setEditPhotoURLs(prevURLs => [...prevURLs, '']);
    };

    const handleUpdateItem = async () => {
        if (!editName.trim()) {
            window.alert("Item name cannot be empty.");
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
            window.alert("Failed to update item.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Replaced window.confirm with a custom modal for better UX and consistency in iframes
        if (!window.confirm('Are you sure you want to delete this item?')) return; // Revert to alert for consistency with platform guidelines
        setIsLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${id}`);
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            window.alert("Failed to delete item.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        if (showNoPhotosFirst) {
            const aHasPhotos = a.photos && a.photos.length > 0;
            const bHasPhotos = b.photos && b.photos.length > 0;
            if (!aHasPhotos && bHasPhotos) return -1;
            if (aHasPhotos && !bHasPhotos) return 1;
        }
        return 0; // Maintain original order if no photos first is not active or both have/don't have photos
    });

    return (
        <div className="p-4 max-w-6xl mx-auto font-sans">
            <h2 className="text-3xl font-extrabold mb-8 text-indigo-700 text-center">Inventory Management</h2>

            {/* Add New Item Form */}
            <div className="my-10 p-8 border border-gray-200 bg-white shadow-xl rounded-none">
                <h3 className="text-2xl font-bold text-indigo-600 mb-6 border-b pb-3">Add New Item</h3>
                <div className="mb-4">
                    <label htmlFor="itemName" className="block text-gray-800 font-semibold mb-2">Item Name</label>
                    <input
                        type="text"
                        id="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all duration-200 rounded-none"
                        placeholder="e.g., Spicy Paneer Tikka"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2">Photo URLs</label>
                    {photoURLs.map((url, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => handlePhotoChange(index, e.target.value)}
                                className="flex-grow px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all duration-200 rounded-none"
                                placeholder={`Image URL ${index + 1}`}
                            />
                            {photoURLs.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setPhotoURLs(prevURLs => prevURLs.filter((_, i) => i !== index))}
                                    className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPhotoField}
                        className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mt-2 flex items-center"
                    >
                        <span className="text-lg mr-1">+</span> Add another image
                    </button>
                </div>

                <button
                    onClick={handleAddItem}
                    className="bg-indigo-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 transition-colors duration-200 w-full text-lg rounded-none"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Oval
                                height={20}
                                width={20}
                                color="#fff"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#f0f0f0"
                                strokeWidth={4}
                                strokeWidthSecondary={4}
                            />
                            <span className="ml-2">Adding...</span>
                        </div>
                    ) : (
                        'Add Item'
                    )}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                {/* Search Bar */}
                <div className="w-full sm:w-1/2">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all duration-200 rounded-none"
                        placeholder="Search items by name..."
                    />
                </div>

                {/* Toggle for No Photos First */}
                <label className="flex items-center cursor-pointer p-2 bg-gray-100 rounded-none shadow-sm">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={showNoPhotosFirst}
                            onChange={() => setShowNoPhotosFirst(v => !v)}
                            className="sr-only"
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${showNoPhotosFirst ? "bg-green-600" : "bg-gray-400"}`}></div>
                        <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 transform ${showNoPhotosFirst ? "translate-x-6" : ""}`}></div>
                    </div>
                    <span className="ml-3 text-gray-800 font-medium select-none">
                        Show No Photos First
                    </span>
                </label>
            </div>

            {/* Inventory Items */}
            {isLoading && (
                <div className="flex justify-center items-center my-8">
                    <Oval
                        height={50}
                        width={50}
                        color="#4F46E5"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#A5B4FC"
                        strokeWidth={4}
                        strokeWidthSecondary={4}
                    />
                    <p className="ml-3 text-lg text-indigo-700">Loading items...</p>
                </div>
            )}

            {!isLoading && filteredItems.length === 0 && (
                <p className="text-center text-gray-600 text-lg mt-10">No items found. Add some to get started!</p>
            )}

            {!isLoading && filteredItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-2 sm:p-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="group bg-white border border-gray-200 shadow-sm p-4 flex flex-col transition-transform duration-300 hover:scale-[1.025]"
                        >
                            <h3 className="font-bold text-base sm:text-lg text-indigo-700 mb-3 text-center truncate">
                                {item.name}
                            </h3>

                            <div
                                className={`mb-4 flex-grow ${item.photos?.length === 1
                                        ? "flex justify-center"
                                        : "grid grid-cols-2 gap-2"
                                    }`}
                            >
                                {item.photos && item.photos.length > 0 ? (
                                    item.photos.map((photo, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden bg-gray-100 flex items-center justify-center h-28 max-w-[140px]"
                                            style={item.photos.length === 1 ? { width: "140px" } : {}}
                                        >
                                            <img
                                                src={photo}
                                                alt={`${item.name} - ${i}`}
                                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center bg-gray-100 h-28 w-full text-gray-500 text-sm rounded-md">
                                        No image available
                                    </div>
                                )}
                            </div>


                            <div
                                className={`flex justify-center gap-3 mt-auto pt-2 border-t border-gray-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300`}
                            >
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Edit Modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-none shadow-2xl w-full max-w-md relative animate-fade-in-up">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
                            onClick={() => {
                                setEditingId(null);
                                setEditName('');
                                setEditPhotoURLs(['']);
                            }}
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-indigo-700 border-b pb-3">Edit Item</h3>

                        <div className="mb-4">
                            <label htmlFor="editItemName" className="block text-gray-800 font-semibold mb-2">Item Name</label>
                            <input
                                type="text"
                                id="editItemName"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all duration-200 rounded-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-800 font-semibold mb-2">Photo URLs</label>
                            {editPhotoURLs.map((url, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleEditChange(index, e.target.value)}
                                        className="flex-grow px-4 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all duration-200 rounded-none"
                                        placeholder={`Image URL ${index + 1}`}
                                    />
                                    {editPhotoURLs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setEditPhotoURLs(prevURLs => prevURLs.filter((_, i) => i !== index))}
                                            className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddEditField}
                                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mt-2 flex items-center"
                            >
                                <span className="text-lg mr-1">+</span> Add another image
                            </button>
                        </div>

                        <button
                            onClick={handleUpdateItem}
                            className="bg-indigo-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 transition-colors duration-200 w-full text-lg rounded-none"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <Oval
                                        height={20}
                                        width={20}
                                        color="#fff"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                        ariaLabel='oval-loading'
                                        secondaryColor="#f0f0f0"
                                        strokeWidth={4}
                                        strokeWidthSecondary={4}
                                    />
                                    <span className="ml-2">Updating...</span>
                                </div>
                            ) : (
                                'Update Item'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}