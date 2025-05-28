import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [photoURLs, setPhotoURLs] = useState(['']);
    const [editingId, setEditingId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

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

        if (editingId) {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${editingId}`, newItem);
        } else {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`, newItem);
        }

        setItemName('');
        setPhotoURLs(['']);
        setEditingId(null);
        fetchItems();
    };

    const handleEdit = (item) => {
        setItemName(item.name);
        setPhotoURLs(item.photos);
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items/${id}`);
        fetchItems();
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-orange-600">Inventory</h2>

            <div className="bg-orange-50 p-3 rounded-lg shadow mb-4">
                <div className="mb-3">
                    <label className="block  font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md "
                        placeholder="e.g., Chicken Biryani"
                    />
                </div>

                <div className="mb-3">
                    <label className="block  font-medium text-gray-700 mb-1">Photo URLs</label>
                    {photoURLs.map((url, index) => (
                        <input
                            key={index}
                            type="text"
                            value={url}
                            onChange={(e) => handlePhotoChange(index, e.target.value)}
                            className="w-full mb-2 px-3 py-2 border rounded-md "
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
                    className="bg-orange-500 text-white px-3 py-1.5 rounded-md  font-medium hover:bg-orange-600"
                >
                    {editingId ? 'Update' : 'Save'}
                </button>
            </div>

            <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
                {items.map((item) => (
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
        </div>
    );
}