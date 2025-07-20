import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import Orders from './Orders';
import { ArrowUp, Search, X, Pencil, ClipboardList, IndianRupee, Plus, ShoppingBag, Star, Trash2, AlertTriangle, Minus, ConciergeBell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import RetailHeader from './RetailHeader';
import { FiAlertTriangle } from 'react-icons/fi';
import Databank from '../Editables/Databank';
import PhotoUpload from '../Components/PhotoUpload';
import PhotoURLPicker from '../Components/PhotoURLPicker';

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

  const foodCategories = Databank.foodCategories

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    price: '',
    photoURL: '',
    dishType: '',
    foodCategory: '',
    description: '',
    ingredients: [],
    preparationTime: '',
    cookingTime: '',
    totalTime: '',
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: ''
    },
    allergens: [],
    cuisine: '',
    dietaryRestrictions: [],
    availability: { days: [], times: [] },
    tags: [],
    specialInstructions: '',
    options: [{ name: '', price: '', description: '' }],
    addOns: [{ name: '', price: '', description: '' }]
  });
  const [message, setMessage] = useState('')

  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editItem, setEditItem] = useState({
    name: '',
    price: '',
    photo: ''
  });
  const [search, setSearch] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isPhotoLibraryOpen, setIsPhotoLibraryOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [ingredientInput, setIngredientInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const [additional, setAdditional] = useState(false);

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
      setRestaurant(data);
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdditional = () => {
    setAdditional(!additional);
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const filteredMenu = (restaurantInfo.menu || []).filter(
    item => item?.itemName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddItem = async () => {
    if (!newItem.itemName || !newItem.price) {
      setMessage('Please provide both item name and price');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price)) {
      setMessage('Please enter a valid price');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('retailtoken');
      const publicCode = restaurantInfo.publicCode;

      const payload = {
        publicCode,
        itemName: newItem.itemName,
        price,
        photoURL: newItem.photoURL,
        dishType: newItem.dishType,
        foodCategory: newItem.foodCategory,
        description: newItem.description,
        ingredients: newItem.ingredients,
        preparationTime: newItem.preparationTime,
        nutritionalInfo: newItem.nutritionalInfo,
        allergens: newItem.allergens,
        cuisine: newItem.cuisine,
        dietaryRestrictions: newItem.dietaryRestrictions,
        availability: {
          days: newItem.availability?.days,
          times: newItem.availability?.times
        },
        tags: newItem.tags,
        specialInstructions: newItem.specialInstructions,
        options: newItem.options,
        addOns: newItem.addOns
      };

      // Recursive cleaner for deeply nested structures
      const cleanPayload = (obj) => {
        if (Array.isArray(obj)) {
          const cleanedArr = obj
            .map(item => (typeof item === 'object' ? cleanPayload(item) : item))
            .filter(item => {
              if (typeof item === 'object') return Object.keys(item).length > 0;
              return item !== null && item !== '' && item !== undefined;
            });
          return cleanedArr.length > 0 ? cleanedArr : undefined;
        } else if (typeof obj === 'object' && obj !== null) {
          const cleanedObj = {};
          for (const [key, value] of Object.entries(obj)) {
            const cleanedValue = cleanPayload(value);
            if (
              cleanedValue !== undefined &&
              !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)
            ) {
              cleanedObj[key] = cleanedValue;
            }
          }
          return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
        } else if (obj !== null && obj !== '' && obj !== undefined) {
          return obj;
        }
        return undefined;
      };

      const cleanedPayload = cleanPayload(payload);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/restaurant/addmenu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cleanedPayload)
      });

      if (response.ok) {
        const data = await response.json();
        const addedItem = data.menu?.[data.menu.length - 1];
        setRestaurantInfo((prevState) => ({
          ...prevState,
          menu: [...prevState.menu, addedItem]
        }));
        setMessage('Item added successfully!');
        setTimeout(() => setMessage(''), 3000);
        setTimeout(() => {
          setIsAddItemModalOpen(false);
          resetNewItem();
        }, 1000);
      } else {
        setMessage('Failed to add item');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      setMessage('An error occurred while adding the item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ✅ Modular reset function
  const resetNewItem = () => {
    setNewItem({
      itemName: '',
      price: '',
      photoURL: '',
      dishType: '',
      foodCategory: '',
      description: '',
      ingredients: [],
      preparationTime: '',
      cookingTime: '',
      totalTime: '',
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        sugar: '',
        sodium: ''
      },
      allergens: [],
      cuisine: '',
      dietaryRestrictions: [],
      availability: { days: [], times: [] },
      tags: [],
      specialInstructions: '',
      options: [{ name: '', price: '', description: '' }],
      addOns: [{ name: '', price: '', description: '' }]
    });
  };


  const handleCancelAddItem = () => {
    setIsAddItemModalOpen(false);
    setNewItem({ itemName: '', price: '', photoURL: '' });
    setAdditional(false);
  }

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditItem({
      name: item.itemName,
      price: item.price,
      photo: item.photoURL || ''
    });
    setIsEditing(true);
  };


  // Delete Item
  const handleDeleteItem = async () => {
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
        setIsDeleting(false);
        setMessage('Item deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Failed to delete item: ${error.message}`); // Show error message from backend
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setMessage('An error occurred while deleting the item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const ImageLibrary = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchImages = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/items`);
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error fetching items:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchImages();
    }, []);

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConfirm = () => {
      console.log(selectedImage);
      if (!selectedImage) return;

      if (isEditing) {
        setEditFields(prev => ({ ...prev, photoURL: selectedImage }));
      } else {
        setNewItem(prev => ({ ...prev, photoURL: selectedImage }));
      }
      setIsPhotoLibraryOpen(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        {/* Main Modal */}
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Image Library</h2>
            <button
              onClick={() => setIsPhotoLibraryOpen(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Image Grid */}
          <div className="p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No images found</h3>
                <p className="mt-1 text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredItems.map((item, index) => {
                  const primaryPhoto = item.photos?.[0];
                  const extraCount = item.photos?.length > 1 ? item.photos.length - 1 : 0;

                  return (
                    <div
                      key={index}
                      className={`relative group rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer ${selectedImage === primaryPhoto ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                      onClick={() => setSelectedImage(primaryPhoto)}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={primaryPhoto}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {extraCount > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          +{extraCount}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-sm font-medium truncate w-full text-left">{item.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              onClick={() => setIsPhotoLibraryOpen(false)}
              className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className={`px-5 py-2.5 text-white font-medium rounded-lg shadow-sm transition-colors ${selectedImage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Select Image
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {selectedImage && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Selection</h3>
              <div className="mb-6">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
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

  // EditMenu Modal with all fields
  const EditMenu = () => {
    const [editFields, setEditFields] = useState({
      itemName: editingItem?.itemName || '',
      price: editingItem?.price || '',
      photoURL: editingItem?.photoURL || '',
      foodCategory: editingItem?.foodCategory || '',
      dishType: editingItem?.dishType || '',
      description: editingItem?.description || '',
      ingredients: editingItem?.ingredients || [],
      preparationTime: editingItem?.preparationTime || '',
      nutritionalInfo: editingItem?.nutritionalInfo || {
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        sugar: '',
        sodium: ''
      },
      allergens: editingItem?.allergens || [],
      cuisine: editingItem?.cuisine || '',
      dietaryRestrictions: editingItem?.dietaryRestrictions || [],
      availability: editingItem?.availability || { days: [], times: [] },
      tags: editingItem?.tags || [],
      specialInstructions: editingItem?.specialInstructions || '',
      options: editingItem?.options?.length ? editingItem.options : [{ name: '', price: '', description: '' }],
      addOns: editingItem?.addOns?.length ? editingItem.addOns : [{ name: '', price: '', description: '' }]
    });
    const [ingredientInput, setIngredientInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [editAdditional, setEditAdditional] = useState(false);

    const toggleEditAdditional = () => {
      setEditAdditional(!editAdditional);
    };

    // For photo library selection
    const setEditItemPhoto = (url) => setEditFields(f => ({ ...f, photoURL: url }));

    const handleSaveEdit = async () => {
      if (!editFields.itemName || !editFields.price) {
        setMessage('Please provide both item name and price');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      const price = parseFloat(editFields.price);
      if (isNaN(price)) {
        setMessage('Please enter a valid price');
        setTimeout(() => setMessage(''), 3000);
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
            ...editFields,
            price,
          }),
        });
        if (response.ok) {
          const updatedItem = await response.json();
          setMessage('Item updated successfully');
          setTimeout(() => setMessage(''), 3000);
          setRestaurantInfo(prevState => ({
            ...prevState,
            menu: prevState.menu.map(item =>
              item._id === updatedItem._id ? { ...item, ...updatedItem } : item
            ),
          }));
          setIsEditing(false);
          setEditingItem(null);
          fetchRestaurantData();
        } else {
          setMessage('Failed to update item');
        }
      } catch (error) {
        console.error('Error updating menu item:', error);
        setMessage('An error occurred while updating the item');
        setTimeout(() => setMessage(''), 3000);
      }
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    return (
      <div onClick={handleCancelEdit} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl max-h-[90vh] overflow-y-auto shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Menu Item</h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
              <input
                type="text"
                value={editFields.itemName}
                onChange={e => setEditFields(f => ({ ...f, itemName: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={editFields.price}
                  onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))}
                  className="w-full pl-8 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            {/* Photo URL */}
            <PhotoURLPicker
              editFields={editFields}
              setEditFields={setEditFields}
              setIsPhotoLibraryOpen={setIsPhotoLibraryOpen}
            />

            {/* Food Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                value={editFields.foodCategory}
                onChange={e => setEditFields(f => ({ ...f, foodCategory: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Select Category</option>
                {foodCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Food Type */}
            <div className='mt-4 border-b border-gray-200 pb-4'>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Type*</label>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="dishType"
                    value="V"
                    checked={editFields.dishType === 'V'}
                    onChange={() => setEditFields(f => ({ ...f, dishType: 'V' }))}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Vegetarian</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="dishType"
                    value="NV"
                    checked={editFields.dishType === 'NV'}
                    onChange={() => setEditFields(f => ({ ...f, dishType: 'NV' }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Non-Vegetarian</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="dishType"
                    value=""
                    checked={editFields.dishType === ''}
                    onChange={() => setEditFields(f => ({ ...f, dishType: '' }))}
                    className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">None</span>
                </label>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <div
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={toggleEditAdditional}
              >
                <h3 className="text-lg font-medium text-gray-800">Additional Information</h3>
                {editAdditional ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
            </div>
            {editAdditional &&
              <div className='flex flex-col gap-4'>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editFields.description}
                    onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    rows={3}
                  />
                </div>
                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editFields.ingredients?.map((ingredient, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span className="text-sm">{ingredient}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editFields.ingredients];
                            updated.splice(index, 1);
                            setEditFields(f => ({ ...f, ingredients: updated }));
                          }}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={ingredientInput}
                      onChange={e => setIngredientInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && ingredientInput.trim()) {
                          setEditFields(f => ({
                            ...f,
                            ingredients: [...(f.ingredients || []), ingredientInput.trim()]
                          }));
                          setIngredientInput('');
                        }
                      }}
                      placeholder="Add ingredient and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (ingredientInput.trim()) {
                          setEditFields(f => ({
                            ...f,
                            ingredients: [...(f.ingredients || []), ingredientInput.trim()]
                          }));
                          setIngredientInput('');
                        }
                      }}
                      className="px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {/* Preparation Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={editFields.preparationTime}
                    onChange={e => setEditFields(f => ({ ...f, preparationTime: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                {/* Nutritional Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Nutritional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar', 'sodium'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                        <input
                          type="number"
                          value={editFields.nutritionalInfo?.[field] || ''}
                          onChange={e => setEditFields(f => ({
                            ...f,
                            nutritionalInfo: { ...f.nutritionalInfo, [field]: e.target.value }
                          }))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
                  <div className="flex flex-wrap gap-2">
                    {['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish'].map((allergen) => {
                      const isSelected = editFields.allergens?.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          type="button"
                          onClick={() => {
                            const current = Array.isArray(editFields.allergens) ? editFields.allergens : [];
                            const updated = isSelected
                              ? current.filter(a => a !== allergen)
                              : [...current, allergen];
                            setEditFields(f => ({ ...f, allergens: updated }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${isSelected
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-700 border-gray-300'
                            } hover:bg-red-100 transition`}
                        >
                          {allergen}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Cuisine */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                  <input
                    type="text"
                    value={editFields.cuisine}
                    onChange={e => setEditFields(f => ({ ...f, cuisine: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                  <div className="flex flex-wrap gap-2">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Halal', 'Kosher'].map((restriction) => (
                      <label key={restriction} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={editFields.dietaryRestrictions?.includes(restriction) || false}
                          onChange={e => {
                            const current = editFields.dietaryRestrictions || [];
                            if (e.target.checked) {
                              setEditFields(f => ({
                                ...f,
                                dietaryRestrictions: [...current, restriction]
                              }));
                            } else {
                              setEditFields(f => ({
                                ...f,
                                dietaryRestrictions: current.filter(r => r !== restriction)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{restriction}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Availability */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-3">Availability</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Days Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                          const isSelected = editFields.availability?.days?.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                const current = editFields.availability?.days || [];
                                const updated = isSelected
                                  ? current.filter(d => d !== day)
                                  : [...current, day];
                                setEditFields(f => ({
                                  ...f,
                                  availability: { ...f.availability, days: updated }
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${isSelected
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300'
                                } hover:bg-blue-100 transition`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Time Slots Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
                      <div className="flex flex-wrap gap-2">
                        {['Breakfast', 'Lunch', 'Dinner', 'All Day'].map((time) => {
                          const isSelected = editFields.availability?.times?.includes(time);
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                const current = editFields.availability?.times || [];
                                const updated = isSelected
                                  ? current.filter(t => t !== time)
                                  : [...current, time];
                                setEditFields(f => ({
                                  ...f,
                                  availability: { ...f.availability, times: updated }
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${isSelected
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300'
                                } hover:bg-blue-100 transition`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editFields.tags?.map((tag, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editFields.tags];
                            updated.splice(index, 1);
                            setEditFields(f => ({ ...f, tags: updated }));
                          }}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          setEditFields(f => ({
                            ...f,
                            tags: [...(f.tags || []), tagInput.trim()]
                          }));
                          setTagInput('');
                        }
                      }}
                      placeholder="Add tag and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tagInput.trim()) {
                          setEditFields(f => ({
                            ...f,
                            tags: [...(f.tags || []), tagInput.trim()]
                          }));
                          setTagInput('');
                        }
                      }}
                      className="px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={editFields.specialInstructions}
                    onChange={e => setEditFields(f => ({ ...f, specialInstructions: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    rows={2}
                    placeholder="e.g. Contains nuts, Spicy level options"
                  />
                </div>
                {/* Options */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Options</h3>
                  {editFields.options?.map((option, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Option Name*</label>
                          <input
                            type="text"
                            value={option.name}
                            onChange={e => {
                              const updated = [...editFields.options];
                              updated[index].name = e.target.value;
                              setEditFields(f => ({ ...f, options: updated }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                          <input
                            type="number"
                            value={option.price}
                            onChange={e => {
                              const updated = [...editFields.options];
                              updated[index].price = e.target.value;
                              setEditFields(f => ({ ...f, options: updated }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={option.description || ''}
                          onChange={e => {
                            const updated = [...editFields.options];
                            updated[index].description = e.target.value;
                            setEditFields(f => ({ ...f, options: updated }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          rows={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...editFields.options];
                          updated.splice(index, 1);
                          setEditFields(f => ({ ...f, options: updated }));
                        }}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove Option
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditFields(f => ({
                        ...f,
                        options: [...(f.options || []), { name: '', price: '', description: '' }]
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Option
                  </button>
                </div>
                {/* Add-ons */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Add-ons</h3>
                  {editFields.addOns?.map((addOn, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add-on Name*</label>
                          <input
                            type="text"
                            value={addOn.name}
                            onChange={e => {
                              const updated = [...editFields.addOns];
                              updated[index].name = e.target.value;
                              setEditFields(f => ({ ...f, addOns: updated }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                          <input
                            type="number"
                            value={addOn.price}
                            onChange={e => {
                              const updated = [...editFields.addOns];
                              updated[index].price = e.target.value;
                              setEditFields(f => ({ ...f, addOns: updated }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={addOn.description || ''}
                          onChange={e => {
                            const updated = [...editFields.addOns];
                            updated[index].description = e.target.value;
                            setEditFields(f => ({ ...f, addOns: updated }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          rows={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...editFields.addOns];
                          updated.splice(index, 1);
                          setEditFields(f => ({ ...f, addOns: updated }));
                        }}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove Add-on
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditFields(f => ({
                        ...f,
                        addOns: [...(f.addOns || []), { name: '', price: '', description: '' }]
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Add-on
                  </button>
                </div>
              </div>}
          </div>
          <div className="mt-8 flex justify-end space-x-3 sticky bottom-0 bg-white py-4">
            <button
              onClick={handleCancelEdit}
              className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br relative from-blue-50 via-white to-blue-100">
      {/* Restaurant Info */}
      <RetailHeader restaurantName={restaurantInfo.restaurantName} street={restaurantInfo.restaurantAddress.street} city={restaurantInfo.restaurantAddress.city} state={restaurantInfo.restaurantAddress.state} zipCode={restaurantInfo.restaurantAddress.zipCode} mobileNumber={restaurantInfo.mobileNumber} />

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Menu Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Menu Items</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {restaurantInfo.menu?.length || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUp className="h-3 w-3 mr-1" />
                12% from last month
              </span>
            </div>
          </div>

          {/* Additional Stats Cards (examples) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Orders</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">24</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Today's Revenue</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">₹12,450</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl cursor-pointer shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Take an Order</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">Order</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ConciergeBell className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Menu Section */}
        <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
              <p className="text-gray-500 text-sm mt-1">
                {filteredMenu.length} {filteredMenu.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors"
            >
              <Plus className='w-5 h-5' />
              <span>Add Item</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Menu Items List */}
          <div className="space-y-3">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <div
                  key={item._id}
                  className="group relative flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors shadow-sm hover:shadow-md"
                >
                  {item.photoURL && (
                    <div className="w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden">
                      <img
                        src={item.photoURL}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                      {item.foodCategory && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {item.foodCategory}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                        ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Edit/Delete Buttons (shown on hover) */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-colors"
                      aria-label="Edit item"
                    >
                      <Pencil className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleting(true);
                        setDeletingItemId(item._id);
                      }}
                      className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No menu items found</h3>
                <p className="mt-1 text-gray-500">{search ? 'Try a different search term' : 'Add your first menu item'}</p>
                <button
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add New Item
                </button>
              </div>
            )}
          </div>
        </section>

        <Orders trigger={restaurant} />

        {isAddItemModalOpen && (
          <div onClick={handleCancelAddItem} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Add New Menu Item</h2>
                <button
                  onClick={handleCancelAddItem}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Basic Information Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h3>

                  {/* Item Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                    <input
                      type="text"
                      placeholder="e.g. Margherita Pizza"
                      value={newItem.itemName}
                      onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-full pl-8 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Photo Upload or Library */}
                  <PhotoUpload setNewItem={setNewItem} newItem={newItem} setIsPhotoLibraryOpen={setIsPhotoLibraryOpen} />

                  {/* Food Category */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      value={newItem.foodCategory || ''}
                      onChange={(e) => setNewItem({ ...newItem, foodCategory: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-no-repeat bg-[right_0.75rem_center]"
                      required
                    >
                      <option value="">Select Category</option>
                      {foodCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Food Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Type*</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="dishType"
                          value="V"
                          checked={newItem.dishType === 'V'}
                          onChange={() => setNewItem({ ...newItem, dishType: 'V' })}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Vegetarian</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="dishType"
                          value="NV"
                          checked={newItem.dishType === 'NV'}
                          onChange={() => setNewItem({ ...newItem, dishType: 'NV' })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Non-Vegetarian</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="dishType"
                          value=""
                          checked={newItem.dishType === ''}
                          onChange={() => setNewItem({ ...newItem, dishType: '' })}
                          className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">None</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="border-b border-gray-200 pb-4">
                  <div
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={toggleAdditional}
                  >
                    <h3 className="text-lg font-medium text-gray-800">Additional Information</h3>
                    {additional ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>

                  {additional && (
                    <div className="space-y-4 mt-3">
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newItem.description || ''}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          rows={3}
                        />
                      </div>

                      {/* Ingredients */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newItem.ingredients?.map((ingredient, index) => (
                            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                              <span className="text-sm">{ingredient}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newItem.ingredients];
                                  updated.splice(index, 1);
                                  setNewItem({ ...newItem, ingredients: updated });
                                }}
                                className="ml-1 text-gray-500 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && ingredientInput.trim()) {
                                setNewItem({
                                  ...newItem,
                                  ingredients: [...(newItem.ingredients || []), ingredientInput.trim()]
                                });
                                setIngredientInput('');
                              }
                            }}
                            placeholder="Add ingredient and press Enter"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (ingredientInput.trim()) {
                                setNewItem({
                                  ...newItem,
                                  ingredients: [...(newItem.ingredients || []), ingredientInput.trim()]
                                });
                                setIngredientInput('');
                              }
                            }}
                            className="px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Preparation Time */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
                          <input
                            type="text"
                            placeholder="15 mins"
                            value={newItem.preparationTime || ''}
                            onChange={(e) => setNewItem({ ...newItem, preparationTime: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Nutritional Information */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Nutritional Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calories (kcal)</label>
                            <input
                              type="number"
                              value={newItem.nutritionalInfo?.calories || ''}
                              onChange={(e) => setNewItem({
                                ...newItem,
                                nutritionalInfo: {
                                  ...newItem.nutritionalInfo,
                                  calories: e.target.value
                                }
                              })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                            <input
                              type="number"
                              value={newItem.nutritionalInfo?.protein || ''}
                              onChange={(e) => setNewItem({
                                ...newItem,
                                nutritionalInfo: {
                                  ...newItem.nutritionalInfo,
                                  protein: e.target.value
                                }
                              })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                            <input
                              type="number"
                              value={newItem.nutritionalInfo?.carbohydrates || ''}
                              onChange={(e) => setNewItem({
                                ...newItem,
                                nutritionalInfo: {
                                  ...newItem.nutritionalInfo,
                                  carbohydrates: e.target.value
                                }
                              })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                            <input
                              type="number"
                              value={newItem.nutritionalInfo?.fat || ''}
                              onChange={(e) => setNewItem({
                                ...newItem,
                                nutritionalInfo: {
                                  ...newItem.nutritionalInfo,
                                  fat: e.target.value
                                }
                              })}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Allergens */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
                        <div className="flex flex-wrap gap-2">
                          {['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish'].map((allergen) => {
                            // Ensure newItem.allergens is always an array
                            const allergensArray = Array.isArray(newItem.allergens) ? newItem.allergens : [];
                            const isSelected = allergensArray.includes(allergen);
                            return (
                              <button
                                key={allergen}
                                type="button"
                                onClick={() => {
                                  const current = Array.isArray(newItem.allergens) ? newItem.allergens : [];
                                  const updated = isSelected
                                    ? current.filter(a => a !== allergen)
                                    : [...current, allergen];
                                  setNewItem({
                                    ...newItem,
                                    allergens: updated,
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${isSelected
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'bg-white text-gray-700 border-gray-300'
                                  } hover:bg-red-100 transition`}
                              >
                                {allergen}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cuisine */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                        <input
                          type="text"
                          placeholder="e.g. Italian, Indian"
                          value={newItem.cuisine || ''}
                          onChange={(e) => setNewItem({ ...newItem, cuisine: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>

                      {/* Dietary Restrictions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                        <div className="flex flex-wrap gap-2">
                          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Halal', 'Kosher'].map((restriction) => (
                            <label key={restriction} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={newItem.dietaryRestrictions?.includes(restriction) || false}
                                onChange={(e) => {
                                  const current = newItem.dietaryRestrictions || [];
                                  if (e.target.checked) {
                                    setNewItem({
                                      ...newItem,
                                      dietaryRestrictions: [...current, restriction]
                                    });
                                  } else {
                                    setNewItem({
                                      ...newItem,
                                      dietaryRestrictions: current.filter(r => r !== restriction)
                                    });
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{restriction}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Availability</h4>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Days Selector */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                            <div className="flex flex-wrap gap-2">
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                const isSelected = newItem.availability?.days?.includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      const current = newItem.availability?.days || [];
                                      const updated = isSelected
                                        ? current.filter(d => d !== day)
                                        : [...current, day];
                                      setNewItem({
                                        ...newItem,
                                        availability: {
                                          ...newItem.availability,
                                          days: updated,
                                        },
                                      });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${isSelected
                                      ? 'bg-blue-500 text-white border-blue-500'
                                      : 'bg-white text-gray-700 border-gray-300'
                                      } hover:bg-blue-100 transition`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Time Slots Selector */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
                            <div className="flex flex-wrap gap-2">
                              {['Breakfast', 'Lunch', 'Dinner', 'All Day'].map((time) => {
                                const isSelected = newItem.availability?.times?.includes(time);
                                return (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => {
                                      const current = newItem.availability?.times || [];
                                      const updated = isSelected
                                        ? current.filter(t => t !== time)
                                        : [...current, time];
                                      setNewItem({
                                        ...newItem,
                                        availability: {
                                          ...newItem.availability,
                                          times: updated,
                                        },
                                      });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${isSelected
                                      ? 'bg-blue-500 text-white border-blue-500'
                                      : 'bg-white text-gray-700 border-gray-300'
                                      } hover:bg-blue-100 transition`}
                                  >
                                    {time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newItem.tags?.map((tag, index) => (
                            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                              <span className="text-sm">{tag}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newItem.tags];
                                  updated.splice(index, 1);
                                  setNewItem({ ...newItem, tags: updated });
                                }}
                                className="ml-1 text-gray-500 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && tagInput.trim()) {
                                setNewItem({
                                  ...newItem,
                                  tags: [...(newItem.tags || []), tagInput.trim()]
                                });
                                setTagInput('');
                              }
                            }}
                            placeholder="Add tag and press Enter"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (tagInput.trim()) {
                                setNewItem({
                                  ...newItem,
                                  tags: [...(newItem.tags || []), tagInput.trim()]
                                });
                                setTagInput('');
                              }
                            }}
                            className="px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                        <textarea
                          value={newItem.specialInstructions || ''}
                          onChange={(e) => setNewItem({ ...newItem, specialInstructions: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          rows={2}
                          placeholder="e.g. Contains nuts, Spicy level options"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Options & Add-ons Section */}
                {additional && (
                  <div className="space-y-4">
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Options</h3>
                      {newItem.options?.map((option, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Option Name*</label>
                              <input
                                type="text"
                                value={option.name}
                                onChange={(e) => {
                                  const updated = [...newItem.options];
                                  updated[index].name = e.target.value;
                                  setNewItem({ ...newItem, options: updated });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                              <input
                                type="number"
                                value={option.price}
                                onChange={(e) => {
                                  const updated = [...newItem.options];
                                  updated[index].price = e.target.value;
                                  setNewItem({ ...newItem, options: updated });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={option.description || ''}
                              onChange={(e) => {
                                const updated = [...newItem.options];
                                updated[index].description = e.target.value;
                                setNewItem({ ...newItem, options: updated });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                              rows={2}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newItem.options];
                              updated.splice(index, 1);
                              setNewItem({ ...newItem, options: updated });
                            }}
                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            Remove Option
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setNewItem({
                            ...newItem,
                            options: [...(newItem.options || []), { name: '', price: 0, description: '' }]
                          });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Option
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Add-ons</h3>
                      {newItem.addOns?.map((addOn, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Add-on Name*</label>
                              <input
                                type="text"
                                value={addOn.name}
                                onChange={(e) => {
                                  const updated = [...newItem.addOns];
                                  updated[index].name = e.target.value;
                                  setNewItem({ ...newItem, addOns: updated });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                              <input
                                type="number"
                                value={addOn.price}
                                onChange={(e) => {
                                  const updated = [...newItem.addOns];
                                  updated[index].price = e.target.value;
                                  setNewItem({ ...newItem, addOns: updated });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={addOn.description || ''}
                              onChange={(e) => {
                                const updated = [...newItem.addOns];
                                updated[index].description = e.target.value;
                                setNewItem({ ...newItem, addOns: updated });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                              rows={2}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...newItem.addOns];
                              updated.splice(index, 1);
                              setNewItem({ ...newItem, addOns: updated });
                            }}
                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            Remove Add-on
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setNewItem({
                            ...newItem,
                            addOns: [...(newItem.addOns || []), { name: '', price: 0, description: '' }]
                          });
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Add-on
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end space-x-3 sticky bottom-0 bg-white py-4">
                <button
                  onClick={handleCancelAddItem}
                  className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={!newItem.itemName || !newItem.price || !newItem.foodCategory}
                >
                  Add Menu Item
                </button>
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <EditMenu />
        )}
        {isPhotoLibraryOpen && <ImageLibrary />}
        {isDeleting && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FiAlertTriangle className='h-6 w-6 text-red-600' />
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Menu Item
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  This action cannot be undone. Are you sure you want to permanently delete this item?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Popup Notifications */}
      {message.length > 0 && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white py-3 px-6 rounded-full shadow-lg font-semibold z-50 animate-drop-down">
          {message}
        </div>
      )}
    </div>
  );
}
