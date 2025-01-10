import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function RetailAdmin() {
  const { id } = useParams(); // Extract the restaurant ID from the URL
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("admintoken");
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="text-center text-orange-500">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center bg-orange-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard - {restaurant?.restaurantName}</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-orange-500 px-4 py-2 rounded shadow hover:bg-gray-200"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-orange-500">Restaurant Details</h2>
        {!editMode ? (
          <div>
            <p><strong>Name:</strong> {restaurant?.name}</p>
            <p><strong>Email:</strong> {restaurant?.email}</p>
            <p><strong>Address:</strong> {restaurant?.restaurantAddress?.street}, {restaurant?.restaurantAddress?.city}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Edit
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block border rounded p-2 w-full mb-4"
            />
            <button
              onClick={updateRestaurant}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-orange-500">Menu</h2>
        <ul>
          {restaurant?.menu.map((item) => (
            <li key={item._id} className="flex justify-between border-b py-2">
              <span>
                {item.itemName} - ₹{item.price}
              </span>
              <button
                onClick={() => deleteMenuItem(item._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <h3 className="font-semibold text-orange-500">Add New Menu Item</h3>
          <input
            type="text"
            placeholder="Item Name"
            value={menuItem.itemName}
            onChange={(e) => setMenuItem({ ...menuItem, itemName: e.target.value })}
            className="block border rounded p-2 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={menuItem.price}
            onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
            className="block border rounded p-2 w-full mb-2"
          />
          <button
            onClick={addMenuItem}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add Menu Item
          </button>
        </div>
      </div>
    </div>
  );
}
