import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [photoURLs, setPhotoURLs] = useState(['']);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhotoURLs, setEditPhotoURLs] = useState(['']);
    const [hoveredId, setHoveredId] = useState(null);
    const [search,setSearch] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`);
        setItems(res.data);
    };

    const handleAddPhotoField = () => {
        setPhotoURLs([...photoURLs, '']);
    };

    const handlePhotoChange = (index, value) => {
        const newPhotoURLs = [...photoURLs];
        newPhotoURLs[index] = value;
        setPhotoURLs(newPhotoURLs);
    };

    const handleAddItem = async () => {
        if (!itemName.trim()) return;
        const newItem = { name: itemName, photos: photoURLs.filter(url => url.trim()) };
        await axios.post(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`, newItem);
        setItemName('');
        setPhotoURLs(['']);
        fetchItems();
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setEditName(item.name);
        setEditPhotoURLs(item.photos);
    };

    const handleEditChange = (index, value) => {
        const newURLs = [...editPhotoURLs];
        newURLs[index] = value;
        setEditPhotoURLs(newURLs);
    };

    const handleAddEditField = () => {
        setEditPhotoURLs([...editPhotoURLs, '']);
    };

    const handleUpdateItem = async () => {
        const updatedItem = { name: editName, photos: editPhotoURLs.filter(url => url.trim()) };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${editingId}`, updatedItem);
        setEditingId(null);
        fetchItems();
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (!confirmDelete) return;
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${id}`);
        fetchItems();
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-orange-600">Inventory</h2>

            {/* Add New Item Form */}
            <div className="my-10 p-6 border rounded-lg bg-white shadow-md">
                <h3 className="text-lg font-bold text-orange-600 mb-4">Add New Item</h3>
                <div className="mb-3">
                    <label className="block font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="e.g., Paneer Tikka"
                    />
                </div>

                <div className="mb-3">
                    <label className="block font-medium text-gray-700 mb-1">Photo URLs</label>
                    {photoURLs.map((url, index) => (
                        <input
                            key={index}
                            type="text"
                            value={url}
                            onChange={(e) => handlePhotoChange(index, e.target.value)}
                            className="w-full mb-2 px-3 py-2 border rounded-md"
                            placeholder={`Image URL ${index + 1}`}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPhotoField}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        + Add another image
                    </button>
                </div>

                <button
                    onClick={handleAddItem}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 w-full"
                >
                    Add Item
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Search items..."
                />
            </div>

            {/* Inventory Items */}
            <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white border border-orange-100 rounded-lg shadow-sm break-inside-avoid p-2 relative"
                        onMouseEnter={() => setHoveredId(item._id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <h3 className="font-semibold text-orange-600 mb-2 truncate text-center">{item.name}</h3>
                        <div className="grid grid-cols-2 gap-1 mb-2">
                            {item.photos.map((photo, i) => (
                                <div key={i} className="overflow-hidden rounded">
                                    <img
                                        src={photo}
                                        alt={`photo-${i}`}
                                        className="w-full h-20 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        {hoveredId === item._id && (
                            <div className="flex gap-2 absolute top-2 right-2 bg-white bg-opacity-90 rounded shadow px-2 py-1">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-500 hover:underline text-center"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-500 hover:underline text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            

            {/* Edit Modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-3 text-gray-600 hover:text-black"
                            onClick={() => {
                                setEditingId(null);
                                setEditName('');
                                setEditPhotoURLs(['']);
                            }}
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4 text-orange-600">Edit Item</h3>

                        <div className="mb-3">
                            <label className="block font-medium text-gray-700 mb-1">Item Name</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block font-medium text-gray-700 mb-1">Photo URLs</label>
                            {editPhotoURLs.map((url, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={url}
                                    onChange={(e) => handleEditChange(index, e.target.value)}
                                    className="w-full mb-2 px-3 py-2 border rounded-md"
                                    placeholder={`Image URL ${index + 1}`}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={handleAddEditField}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                + Add another image
                            </button>
                        </div>

                        <button
                            onClick={handleUpdateItem}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 w-full"
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
