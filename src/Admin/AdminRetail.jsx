import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";
import { IoFastFoodOutline, IoRestaurantOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";

export default function RetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuItem, setMenuItem] = useState({ 
    itemName: "", 
    price: "", 
    photoURL: "",
    foodCategory: "",
    dishType: "V"
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [menuEditMode, setMenuEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch restaurant details
  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/retail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fetch" }),
      });
      const data = await response.json();
      if (response.ok) {
        setRestaurant(data);
        setFormData(data);
      } else {
        showNotification(data.error || "Failed to fetch restaurant", "error");
      }
    } catch (error) {
      showNotification("Error fetching restaurant", "error");
      console.error("Error fetching restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update restaurant details
  const updateRestaurant = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/retail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", updateData: formData }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Restaurant updated successfully!");
        setEditMode(false);
        fetchRestaurant();
      } else {
        showNotification(data.error || "Failed to update restaurant", "error");
      }
    } catch (error) {
      showNotification("Error updating restaurant", "error");
      console.error("Error updating restaurant:", error);
    }
  };

  // Add a menu item
  const addMenuItem = async () => {
    if (!menuItem.itemName || !menuItem.price) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/retail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addMenuItem", newItem: menuItem }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Menu item added successfully!");
        setMenuItem({ itemName: "", price: "", photoURL: "", foodCategory: "", dishType: "V" });
        fetchRestaurant();
      } else {
        showNotification(data.error || "Failed to add menu item", "error");
      }
    } catch (error) {
      showNotification("Error adding menu item", "error");
      console.error("Error adding menu item:", error);
    }
  };

  // Delete a menu item
  const deleteMenuItem = async (menuItemId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/retail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteMenuItem", menuItemId }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Menu item deleted successfully!");
        fetchRestaurant();
      } else {
        showNotification(data.error || "Failed to delete menu item", "error");
      }
    } catch (error) {
      showNotification("Error deleting menu item", "error");
      console.error("Error deleting menu item:", error);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (window.confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("admintoken");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/retail/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          showNotification("Restaurant deleted successfully!");
          navigate("/admin");
        } else {
          showNotification(data.error || "Failed to delete restaurant", "error");
        }
      } catch (error) {
        showNotification("Error deleting restaurant", "error");
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg text-white ${
          notification.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                activeTab === "details" 
                  ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <IoRestaurantOutline className="mr-3" />
              Restaurant Details
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                activeTab === "menu" 
                  ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <IoFastFoodOutline className="mr-3" />
              Menu Management
            </button>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {restaurant?.restaurantName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {restaurant?.restaurantAddress?.street}, {restaurant?.restaurantAddress?.city}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <FiHome className="mr-2" />
              Dashboard
            </button>
          </div>
        </header>

        {/* Restaurant Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Restaurant Information</h2>
              <div className="flex space-x-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={updateRestaurant}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <FiCheck className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={handleDeleteRestaurant}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {!editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Restaurant Name</h3>
                    <p className="text-gray-800 dark:text-white">{restaurant?.restaurantName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h3>
                    <p className="text-gray-800 dark:text-white">{restaurant?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</h3>
                    <p className="text-gray-800 dark:text-white">
                      {restaurant?.restaurantAddress?.street}, {restaurant?.restaurantAddress?.city}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      value={formData.restaurantName || ""}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
                      <input
                        type="text"
                        value={formData.restaurantAddress?.street || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          restaurantAddress: { 
                            ...formData.restaurantAddress, 
                            street: e.target.value 
                          } 
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.restaurantAddress?.city || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          restaurantAddress: { 
                            ...formData.restaurantAddress, 
                            city: e.target.value 
                          } 
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === "menu" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu Management</h2>
              <button
                onClick={() => setMenuEditMode(!menuEditMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  menuEditMode 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {menuEditMode ? (
                  <>
                    <FiCheck className="mr-2" />
                    Done Editing
                  </>
                ) : (
                  <>
                    <FiEdit2 className="mr-2" />
                    Edit Menu
                  </>
                )}
              </button>
            </div>
            
            <div className="p-6">
              {/* Menu Items List */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Current Menu Items</h3>
                {restaurant?.menu?.length > 0 ? (
                  <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                          {menuEditMode && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {restaurant?.menu.map((item) => (
                          <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.photoURL ? (
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full object-cover" src={item.photoURL} alt={item.itemName} />
                                  </div>
                                ) : (
                                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <IoFastFoodOutline className="text-gray-400" />
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {item.foodCategory || "Uncategorized"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.dishType === "V" 
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" 
                                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                              }`}>
                                {item.dishType === "V" ? "Vegetarian" : "Non-Vegetarian"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              ₹{item.price}
                            </td>
                            {menuEditMode && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => deleteMenuItem(item._id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                                >
                                  <FiTrash2 />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <IoFastFoodOutline className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No menu items</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by adding a new menu item.
                    </p>
                  </div>
                )}
              </div>

              {/* Add New Menu Item */}
              {menuEditMode && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Add New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name*</label>
                      <input
                        type="text"
                        placeholder="e.g. Margherita Pizza"
                        value={menuItem.itemName}
                        onChange={(e) => setMenuItem({ ...menuItem, itemName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price*</label>
                      <input
                        type="number"
                        placeholder="e.g. 299"
                        value={menuItem.price}
                        onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Pizza, Pasta"
                        value={menuItem.foodCategory}
                        onChange={(e) => setMenuItem({ ...menuItem, foodCategory: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dish Type</label>
                      <select
                        value={menuItem.dishType}
                        onChange={(e) => setMenuItem({ ...menuItem, dishType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="V">Vegetarian</option>
                        <option value="NV">Non-Vegetarian</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={menuItem.photoURL}
                        onChange={(e) => setMenuItem({ ...menuItem, photoURL: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        onClick={addMenuItem}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <FiPlus className="mr-2" />
                        Add Menu Item
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}