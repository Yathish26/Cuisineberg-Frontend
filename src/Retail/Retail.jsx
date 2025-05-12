import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Retail() {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    email: '',
    restaurantName: '',
    restaurantAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    mobileNumber: '',
    menu: [],
  });

  const [orders, setOrders] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: '', price: '' });
  const [isItemAdded, setIsItemAdded] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // For edit mode
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');

  const [isDeleting, setIsDeleting] = useState(false); // For deletion
  const [deletingItemId, setDeletingItemId] = useState(null);

  const [editButton, setEditButton] = useState(false);

  const navigate = useNavigate();

  const fetchRestaurantData = async () => {
    try {
      const token = localStorage.getItem('retailtoken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant data');
      }

      const data = await response.json();

      setRestaurantInfo({
        name: data.name,
        email: data.email,
        restaurantName: data.restaurantName,
        restaurantAddress: data.restaurantAddress || {},
        mobileNumber: data.mobileNumber,
        menu: data.menu || [],
      });

      setOrders([]); // Placeholder for orders
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.itemName || !newItem.price) {
      alert('Please provide both item name and price');
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price)) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const token = localStorage.getItem('retailtoken');
      const email = restaurantInfo.email;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/restaurant/addmenu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          itemName: newItem.itemName,
          price: price,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const addedItem = data.menu[data.menu.length - 1]; // Assuming the response contains updated menu
        setRestaurantInfo((prevState) => ({
          ...prevState,
          menu: [...prevState.menu, addedItem], // Add the new item to the menu
        }));
        setIsItemAdded(true);
        setTimeout(() => {
          setIsItemAdded(false);
          setIsAddItemModalOpen(false);
          setNewItem({ itemName: '', price: '' });
        }, 1000);
      } else {
        alert('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('An error occurred while adding the item');
    }
  };

  const handleCancelAddItem = () => {
    setIsAddItemModalOpen(false);
    setNewItem({ itemName: '', price: '' });
  }

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditItemName(item.itemName);
    setEditItemPrice(item.price);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editItemName || !editItemPrice) {
      alert('Please provide both item name and price');
      return;
    }

    const price = parseFloat(editItemPrice);
    if (isNaN(price)) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const token = localStorage.getItem('retailtoken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/restaurant/menu/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName: editItemName,
          price: price,
        }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setRestaurantInfo(prevState => ({
          ...prevState,
          menu: prevState.menu.map(item =>
            item._id === updatedItem._id ? { ...item, ...updatedItem } : item
          ),
        }));
        setIsEditing(false);
        setEditingItem(null);
        setEditItemName('');
        setEditItemPrice('');
        fetchRestaurantData();
      } else {
        alert('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('An error occurred while updating the item');
    }
  };


  // Delete Item
  const handleDeleteItem = async () => {
    console.log('Deleting item with ID:', deletingItemId); // Debugging log to verify deletingItemId
    try {
      const token = localStorage.getItem('retailtoken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/restaurant/menu/${deletingItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRestaurantInfo((prevState) => ({
          ...prevState,
          menu: prevState.menu.filter((item) => item._id !== deletingItemId), // Removing deleted item from UI
        }));
        setIsDeleting(false); // Close delete mode
      } else {
        const error = await response.json();
        alert(`Failed to delete item: ${error.message}`); // Show error message from backend
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('An error occurred while deleting the item');
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('retailtoken');
    navigate('/retail/login');
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Restaurant Info */}
      <header className="bg-orange-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{restaurantInfo.restaurantName || 'Restaurant Name'}</h1>
            <p className="text-sm">
              Location: {restaurantInfo.restaurantAddress?.street || 'Street'}, {restaurantInfo.restaurantAddress?.city || 'City'}, {restaurantInfo.restaurantAddress?.state || "State"} - {restaurantInfo.restaurantAddress?.zipCode || "Zipcode"}
            </p>
            <p className="text-sm">Contact: {restaurantInfo.mobileNumber || '+123-456-7890'}</p>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate('/retail/edit')}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Edit Info
            </button>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="bg-white w-fit mx-4 my-2 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Total Menu Items</h2>
        <p className="text-4xl font-bold text-gray-700">{restaurantInfo.menu.length}</p>
      </section>

      <main className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Menu</h2>
            <button onClick={() => setEditButton(!editButton)} className={`${editButton ? 'bg-green-500 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-700'}  text-white font-bold py-2 px-4 rounded transition`}>
              Edit Menu
            </button>
          </div>
          <ul className="space-y-4">
            {restaurantInfo.menu.length > 0 ? (
              restaurantInfo.menu.map((item) => (
                <li key={item._id} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium flex-1">{item.itemName}</span>
                  <span className="text-gray-600 w-1/4">{`₹ ${item.price.toFixed(2)}`}</span>
                  {editButton &&
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setIsDeleting(true); setDeletingItemId(item._id); }}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No menu items available</li>
            )}
          </ul>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add Item
          </button>
        </section>

        {/* Add Item Modal */}
        {isAddItemModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Add Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <button
                onClick={handleAddItem}
                className="bg-orange-500 text-white py-2 px-4 rounded transition"
              >
                Add Item
              </button>
              <button
                onClick={handleCancelAddItem}
                className="ml-4 bg-gray-300 text-black py-2 px-4 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Edit Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="number"
                placeholder="Price"
                value={editItemPrice}
                onChange={(e) => setEditItemPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white py-2 px-4 rounded transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-4 bg-gray-300 text-black py-2 px-4 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {isDeleting && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Delete Menu Item</h2>
              <p>Are you sure you want to delete this item?</p>
              <button
                onClick={handleDeleteItem}
                className="bg-red-500 text-white py-2 px-4 rounded transition"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="ml-4 bg-gray-300 text-black py-2 px-4 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Success Confirmation */}
      {isItemAdded && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white py-2 px-4 rounded">
          Item added successfully!
        </div>
      )}
    </div>
  );
}
