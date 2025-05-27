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

  const foodCategories = [
    "Starters",
    "Main Course",
    "Biryani & Rice",
    "Indian Breads",
    "Curries & Gravies",
    "Snacks",
    "Breakfast",
    "Desserts",
    "Salads",
    "Soups",
    "Chinese",
    "South Indian",
    "North Indian",
    "Fast Food",
    "Burgers",
    "Pizzas",
    "Wraps & Rolls",
    "Sandwiches",
    "Beverages",
    "Milkshakes",
    "Mocktails",
    "Ice Creams",
    "Combos & Thalis",
    "Tandoori",
    "Seafood Specials",
    "Egg Specials",
    "Veg Specials",
    "Non-Veg Specials"
  ];


  const [orders, setOrders] = useState([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: '', price: '', photoURL: '' });
  const [isItemAdded, setIsItemAdded] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // For edit mode
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemPhoto, setEditItemPhoto] = useState('');

  const [isDeleting, setIsDeleting] = useState(false); // For deletion
  const [deletingItemId, setDeletingItemId] = useState(null);

  const [editButton, setEditButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('retailtoken');
    if (!token) {
      navigate('/retail/login');
    }
  }, [navigate]);

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
        localStorage.removeItem('retailtoken');
        navigate('/retail/login');
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
          photoURL: newItem.photoURL || '',
          foodCategory: newItem.foodCategory || '',
          dishType: newItem.dishType || '', // <-- add this
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const addedItem = data.menu[data.menu.length - 1];
        setRestaurantInfo((prevState) => ({
          ...prevState,
          menu: [...prevState.menu, addedItem],
        }));
        setIsItemAdded(true);
        setTimeout(() => {
          setIsItemAdded(false);
          setIsAddItemModalOpen(false);
          setNewItem({ itemName: '', price: '', photoURL: '', foodCategory: '', dishType: '' });
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
    setNewItem({ itemName: '', price: '', photoURL: '' });
  }

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditItemName(item.itemName);
    setEditItemPrice(item.price);
    setEditItemPhoto(item.photoURL || '');
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
          photoURL: editItemPhoto || '',
          foodCategory: editingItem?.foodCategory || '',
          dishType: editingItem?.dishType || '', // <-- add this
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
        setEditItemPhoto('');
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Restaurant Info */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-6 px-8 shadow-lg rounded-b-3xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1">{restaurantInfo.restaurantName || 'Restaurant Name'}</h1>
            <p className="text-base opacity-90">
              <span className="font-semibold">Location:</span> {restaurantInfo.restaurantAddress?.street || 'Street'}, {restaurantInfo.restaurantAddress?.city || 'City'}, {restaurantInfo.restaurantAddress?.state || "State"} - {restaurantInfo.restaurantAddress?.zipCode || "Zipcode"}
            </p>
            <p className="text-base opacity-90"><span className="font-semibold">Contact:</span> {restaurantInfo.mobileNumber || '+123-456-7890'}</p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={() => navigate('/retail/edit')}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200 backdrop-blur"
            >
              Edit Info
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-red-500/80 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200 backdrop-blur"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="bg-white/80 w-fit mx-4 my-6 rounded-2xl shadow-lg p-8 border border-orange-100">
        <h2 className="text-2xl font-bold text-orange-600 mb-2">Total Menu Items</h2>
        <p className="text-5xl font-bold text-gray-800">{restaurantInfo.menu.length}</p>
      </section>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Menu Section */}
        <section className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-orange-600">Menu</h2>
            <button
              onClick={() => setEditButton(!editButton)}
              className={`${editButton
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-orange-500 hover:bg-orange-600'
                } text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200`}
            >
              {editButton ? "Done" : "Edit Menu"}
            </button>
          </div>
          <ul className="space-y-4">
            {restaurantInfo.menu.length > 0 ? (
              restaurantInfo.menu.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 shadow transition"
                >
                  {item.photoURL && (
                    <img
                      src={item.photoURL}
                      alt={item.itemName}
                      className="w-full sm:w-16 h-40 sm:h-16 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                    <span className="text-gray-900 text-lg font-semibold flex-1">
                      {item.itemName}
                    </span>
                    <span className="text-orange-700 font-bold text-right sm:text-left">
                      ₹ {item.price.toFixed(2)}
                    </span>

                    {editButton && (
                      <div className="flex gap-2 justify-end sm:ml-4 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 px-4 rounded-lg shadow transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleting(true);
                            setDeletingItemId(item._id);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-lg shadow transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-center py-8">No menu items available</li>
            )}
          </ul>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="mt-8 w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200"
          >
            + Add Item
          </button>
        </section>

        {isAddItemModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-600 mb-6">Add Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="text"
                placeholder="Photo URL (optional)"
                value={newItem.photoURL}
                onChange={(e) => setNewItem({ ...newItem, photoURL: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {/* Food Category Dropdown */}
              <select
                value={newItem.foodCategory || ''}
                onChange={(e) => setNewItem({ ...newItem, foodCategory: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Food Category</option>
                {foodCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {/*Veg/Non-Veg/None Selection */}
              <div className="mb-6 flex gap-4 items-center">
                <span className="text-gray-700 font-medium">Type:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="dishType"
                    value="V"
                    checked={newItem.dishType === 'V'}
                    onChange={() => setNewItem({ ...newItem, dishType: 'V' })}
                  />
                  <span>Veg</span>
                  <input
                    type="radio"
                    name="dishType"
                    value="NV"
                    checked={newItem.dishType === 'NV'}
                    onChange={() => setNewItem({ ...newItem, dishType: 'NV' })}
                  />
                  <span>Non-Veg</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="dishType"
                    value=""
                    checked={!newItem.dishType}
                    onChange={() => setNewItem({ ...newItem, dishType: '' })}
                  />
                  <span>None</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleAddItem}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Add Item
                </button>
                <button
                  onClick={handleCancelAddItem}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-600 mb-6">Edit Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="number"
                placeholder="Price"
                value={editItemPrice}
                onChange={(e) => setEditItemPrice(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="text"
                placeholder="Photo URL (optional)"
                value={editItemPhoto}
                onChange={(e) => setEditItemPhoto(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {/* Food Category Dropdown */}
              <select
                value={editingItem?.foodCategory || ''}
                onChange={(e) =>
                  setEditingItem((prev) => ({ ...prev, foodCategory: e.target.value }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Food Category</option>
                {foodCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {/* Veg/Non-Veg/None Selection */}
              <div className="mb-6 flex gap-4 items-center">
                <span className="text-gray-700 font-medium">Type:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="editVegType"
                    value="V"
                    checked={editingItem?.dishType === 'V'}
                    onChange={() =>
                      setEditingItem((prev) => ({ ...prev, dishType: 'V' }))
                    }
                  />
                  <span>Veg</span>
                  <input
                    type="radio"
                    name="editVegType"
                    value="NV"
                    checked={editingItem?.dishType === 'NV'}
                    onChange={() =>
                      setEditingItem((prev) => ({ ...prev, dishType: 'NV' }))
                    }
                  />
                  <span>Non-Veg</span>
                  <input
                    type="radio"
                    name="editVegType"
                    value=""
                    checked={!editingItem?.dishType}
                    onChange={() =>
                      setEditingItem((prev) => ({ ...prev, dishType: '' }))
                    }
                  />
                  <span>None</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleting && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Delete Menu Item</h2>
              <p className="mb-6 text-gray-700">Are you sure you want to delete this item?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDeleteItem}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Success Confirmation */}
      {isItemAdded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white py-3 px-8 rounded-xl shadow-lg text-lg font-semibold z-50 animate-bounce">
          Item added successfully!
        </div>
      )}
    </div>
  );
}
