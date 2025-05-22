import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuItem, setMenuItem] = useState({ itemName: "", price: "" });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

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
        console.error(data.error);
      }
    } catch (error) {
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
        alert("Restaurant updated successfully!");
        setEditMode(false);
        fetchRestaurant();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  // Add a menu item
  const addMenuItem = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/retail/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addMenuItem", newItem: menuItem }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Menu item added successfully!");
        setMenuItem({ itemName: "", price: "" });
        fetchRestaurant();
      } else {
        console.error(data.error);
      }
    } catch (error) {
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
        alert("Menu item deleted successfully!");
        fetchRestaurant();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleDeleteRestaurant = async (id, navigate) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
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
          alert("Restaurant deleted successfully!");
          navigate("/admin");
        } else {
          console.error(data.error);
        }
      } catch (error) {
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-orange-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-0 min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <header className="flex justify-between items-center bg-orange-600 text-white px-8 py-5 shadow-lg rounded-b-2xl">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
          </svg>
          Admin Dashboard
          <span className="ml-3 text-orange-200 text-lg font-medium">{restaurant?.restaurantName}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white text-orange-600 px-5 py-2 rounded-full font-semibold shadow hover:bg-orange-100 transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto mt-10 space-y-8">
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-orange-600">Restaurant Details</h2>
            <button
              onClick={() => handleDeleteRestaurant(id, navigate)}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
          {!editMode ? (
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{restaurant?.restaurantName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{restaurant?.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="ml-2 text-gray-900">
                  {restaurant?.restaurantAddress?.street}, {restaurant?.restaurantAddress?.city}
                </span>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700 transition"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="block border border-orange-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <button
                onClick={updateRestaurant}
                className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="ml-3 text-orange-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </section>

        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-orange-600 mb-4">Menu</h2>
          <ul className="divide-y divide-orange-100">
            {restaurant?.menu.map((item) => (
              <li key={item._id} className="flex justify-between items-center py-3">
                <span className="text-gray-800 font-medium">
                  {item.itemName} <span className="text-gray-400">–</span> <span className="text-orange-600 font-semibold">₹{item.price}</span>
                </span>
                <button
                  onClick={() => deleteMenuItem(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-red-600 transition"
                  title="Delete menu item"
                >
                  Delete
                </button>
              </li>
            ))}
            {restaurant?.menu?.length === 0 && (
              <li className="text-gray-400 italic py-3">No menu items yet.</li>
            )}
          </ul>

          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-orange-600 mb-2">Add New Menu Item</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Item Name"
                value={menuItem.itemName}
                onChange={(e) => setMenuItem({ ...menuItem, itemName: e.target.value })}
                className="border border-orange-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={menuItem.price}
                onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                className="border border-orange-200 rounded-lg p-3 w-full md:w-32 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <button
                onClick={addMenuItem}
                className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
