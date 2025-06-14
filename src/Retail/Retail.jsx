import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import Orders from './Orders';

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
  const [search, setSearch] = useState('');

  const [isDeleting, setIsDeleting] = useState(false); // For deletion
  const [deletingItemId, setDeletingItemId] = useState(null);

  const [editButton, setEditButton] = useState(false);

  const [loading, setLoading] = useState(true);
  const [photoDiv, setDiv] = useState(false);
  const [isPhotoLibraryOpen, setIsPhotoLibraryOpen] = useState(false);

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
        publicCode: data.publicCode
      });
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('retailtoken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
    fetchOrders();
  }, []);

  const filteredMenu = restaurantInfo.menu.filter(item =>
    item.itemName?.toLowerCase().includes(search.toLowerCase())
  );

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
      const publicCode = restaurantInfo.publicCode;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/restaurant/addmenu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          publicCode: publicCode,
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

  const ImageLibrary = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchImages();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    setEditItemPhoto(selectedImage);
    setIsPhotoLibraryOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Main Modal */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100 relative">
        <div className="flex justify-between mb-6 items-center">
          <h2 className="text-2xl font-bold text-blue-600">Search Item Image</h2>
          <svg
            onClick={() => setIsPhotoLibraryOpen(false)}
            className="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 10.2623L18.0123 4.25L19.75 5.98775L13.7377 12L19.75 18.0123L18.0123 19.75L12 13.7377L5.98775 19.75L4.25 18.0123L10.2623 12L4.25 5.98775L5.98775 4.25L12 10.2623Z"
              fill="#f5a623"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-2 gap-4 h-64 overflow-y-auto pr-2">
          {filteredItems.map((item, index) => {
            const primaryPhoto = item.photos?.[0];
            const extraCount = item.photos?.length > 1 ? item.photos.length - 1 : 0;

            return (
              <div
                key={index}
                className="relative bg-gray-100 p-2 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedImage(primaryPhoto)}
              >
                <img
                  src={primaryPhoto}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {extraCount > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    +{extraCount}
                  </div>
                )}
                <p className="text-gray-700 text-sm text-center mt-2">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Popup */}
      {selectedImage && (
        <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center max-w-xs w-full">
            <p className="text-lg font-semibold mb-4">Select this picture?</p>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Restaurant Info */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 px-8 shadow-lg rounded-b-3xl">
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
              Edit Profile
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

      <section className="bg-white/80 w-fit mx-4 my-6 rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Total Menu Items</h2>
        <p className="text-5xl font-bold text-gray-800">{restaurantInfo.menu.length}</p>
      </section>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Menu Section */}
        <section className="bg-white/90 rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-600">Menu</h2>
            <button
              onClick={() => setEditButton(!editButton)}
              className={`${editButton
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200`}
            >
              {editButton ? "Done" : "Edit"}
            </button>
          </div>
          <div className="relative">
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="search"
              id="search"
              placeholder="Search menu item"
              aria-label="Search menu item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Search Icon */}
            <span className="absolute top-[36%] left-4 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            {/* Clear (X) Icon */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-[36%] right-4 transform -translate-y-1/2 text-gray-500 hover:text-red-500 focus:outline-none"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>


          <ul className="space-y-4">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <li
                  key={item._id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 shadow transition`}
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
                    <span className="text-blue-700 font-bold text-right sm:text-left">
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
            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200"
          >
            + Add Item
          </button>
        </section>

        <Orders orders={orders} />

        {isAddItemModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Add Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Photo URL (optional)"
                value={newItem.photoURL}
                onChange={(e) => setNewItem({ ...newItem, photoURL: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {/* Food Category Dropdown */}
              <select
                value={newItem.foodCategory || ''}
                onChange={(e) => setNewItem({ ...newItem, foodCategory: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
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
          <div className={`fixed inset-0 z-50 bg-black/30 flex items-center justify-center
          transform transition-transform duration-300 ease-in-out pointer-events-none"}`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Edit Menu Item</h2>
              <input
                type="text"
                placeholder="Item Name"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Price"
                value={editItemPrice}
                onChange={(e) => setEditItemPrice(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => setDiv(!photoDiv)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 mb-6 px-6 rounded-lg shadow transition">
                Add a Photo
              </button>
              {photoDiv &&
                <div className="border border-gray-200 rounded-lg p-4 mb-6 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Photo URL (optional)"
                    value={editItemPhoto}
                    onChange={(e) => setEditItemPhoto(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <h3 className="text-lg text-gray-400 mb-2">OR</h3>
                  <button onClick={() => setIsPhotoLibraryOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 mb-6 px-6 rounded-lg shadow transition">
                    Select a Photo from Libraries
                  </button>
                </div>}
              {/* Food Category Dropdown */}
              <select
                value={editingItem?.foodCategory || ''}
                onChange={(e) =>
                  setEditingItem((prev) => ({ ...prev, foodCategory: e.target.value }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        {isPhotoLibraryOpen && <ImageLibrary />}
        {isDeleting && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Delete Menu Item</h2>
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
