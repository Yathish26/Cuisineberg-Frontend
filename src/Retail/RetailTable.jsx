import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  ShoppingBag,
  IndianRupee,
  Plus,
  Trash2,
  ChevronDown,
  UtensilsCrossed, // Represents a table
  Receipt, // For Bill Pending
  CheckCircle, // For Available
  CircleDot, // For Eating
  Minus, // For decrementing quantity
  RefreshCcw, // For refresh button if needed
} from 'lucide-react';

export default function RetailTable() {
  // Dummy data for menu items
  const [menuItems, setMenuItems] = useState([
    { id: 'item1', name: 'Penaconda Tortilla', price: 60.00, category: 'Tandoori', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Pen' },
    { id: 'item2', name: 'Spicy Chicken Wings', price: 120.00, category: 'Appetizer', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Chi' },
    { id: 'item3', name: 'Veggie Burger', price: 95.00, category: 'Main Course', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Veg' },
    { id: 'item4', name: 'Chocolate Lava Cake', price: 150.00, category: 'Dessert', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Cho' },
    { id: 'item5', name: 'Paneer Tikka', price: 180.00, category: 'Main Course', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Pan' },
    { id: 'item6', name: 'Lemonade', price: 40.00, category: 'Beverage', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Lem' },
    { id: 'item7', name: 'Chicken Biryani', price: 250.00, category: 'Main Course', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Bir' },
    { id: 'item8', name: 'Butter Naan', price: 30.00, category: 'Bread', imageUrl: 'https://placehold.co/100x100/A0AEC0/FFFFFF?text=Naa' },
  ]);

  // Dummy data for tables and their current status/order
  const [tables, setTables] = useState([
    { id: 'tableAC1', name: 'AC 1', status: 'Available', currentOrderId: null },
    { id: 'tableAC2', name: 'AC 2', status: 'Eating', currentOrderId: 'order_ac2_001' },
    { id: 'tableAC3', name: 'AC 3', status: 'Bill Pending', currentOrderId: 'order_ac3_001' },
    { id: 'tableAC4', name: 'AC 4', status: 'Available', currentOrderId: null },
    { id: 'tableAC5', name: 'AC 5', status: 'Eating', currentOrderId: 'order_ac5_001' },
    { id: 'tableAC6', name: 'AC 6', status: 'Available', currentOrderId: null },
    { id: 'tableNonAC1', name: 'Non-AC 1', status: 'Eating', currentOrderId: 'order_nonac1_001' },
    { id: 'tableNonAC2', name: 'Non-AC 2', status: 'Available', currentOrderId: null },
    { id: 'tableNonAC3', name: 'Non-AC 3', status: 'Bill Pending', currentOrderId: 'order_nonac3_001' },
    { id: 'tableNonAC4', name: 'Non-AC 4', status: 'Eating', currentOrderId: 'order_nonac4_001' },
    { id: 'tableNonAC5', name: 'Non-AC 5', status: 'Available', currentOrderId: null },
    { id: 'tableNonAC6', name: 'Non-AC 6', status: 'Eating', currentOrderId: 'order_nonac6_001' },
    { id: 'tableNonAC7', name: 'Non-AC 7', status: 'Available', currentOrderId: null },
    { id: 'tableNonAC8', name: 'Non-AC 8', status: 'Eating', currentOrderId: 'order_nonac8_001' },
    { id: 'tableNonAC9', name: 'Non-AC 9', status: 'Bill Pending', currentOrderId: 'order_nonac9_001' },
    { id: 'tableNonAC10', name: 'Non-AC 10', status: 'Available', currentOrderId: null },
    { id: 'tableNonAC11', name: 'Non-AC 11', status: 'Eating', currentOrderId: 'order_nonac11_001' },
    { id: 'tableNonAC12', name: 'Non-AC 12', status: 'Available', currentOrderId: null },
  ]);

  // Dummy data for orders (these are the actual orders linked by table.currentOrderId)
  const [orders, setOrders] = useState([
    { id: 'order_ac2_001', tableId: 'tableAC2', items: [{ id: 'item1', name: 'Penaconda Tortilla', quantity: 2, price: 60.00 }], total: 120.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    { id: 'order_ac3_001', tableId: 'tableAC3', items: [{ id: 'item2', name: 'Spicy Chicken Wings', quantity: 1, price: 120.00 }, { id: 'item3', name: 'Veggie Burger', quantity: 1, price: 95.00 }], total: 215.00, timestamp: new Date().toISOString(), status: 'Bill Pending', payments: [{ type: 'Card', amount: 100.00, timestamp: new Date().toISOString() }] }, // Example partial payment
    { id: 'order_ac5_001', tableId: 'tableAC5', items: [{ id: 'item4', name: 'Chocolate Lava Cake', quantity: 1, price: 150.00 }], total: 150.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    { id: 'order_nonac1_001', tableId: 'tableNonAC1', items: [{ id: 'item5', name: 'Paneer Tikka', quantity: 2, price: 180.00 }], total: 360.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    { id: 'order_nonac3_001', tableId: 'tableNonAC3', items: [{ id: 'item6', name: 'Lemonade', quantity: 3, price: 40.00 }], total: 120.00, timestamp: new Date().toISOString(), status: 'Bill Pending', payments: [] },
    { id: 'order_nonac4_001', tableId: 'tableNonAC4', items: [{ id: 'item7', name: 'Chicken Biryani', quantity: 1, price: 250.00 }], total: 250.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    { id: 'order_nonac6_001', tableId: 'tableNonAC6', items: [{ id: 'item8', name: 'Butter Naan', quantity: 4, price: 30.00 }], total: 120.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    { id: 'order_nonac8_001', tableId: 'tableNonAC8', items: [{ id: 'item1', name: 'Penaconda Tortilla', quantity: 1, price: 60.00 }, { id: 'item2', name: 'Spicy Chicken Wings', quantity: 1, price: 120.00 }], total: 180.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    { id: 'order_nonac9_001', tableId: 'tableNonAC9', items: [{ id: 'item3', name: 'Veggie Burger', quantity: 2, price: 95.00 }], total: 190.00, timestamp: new Date().toISOString(), status: 'Bill Pending', payments: [] },
    { id: 'order_nonac11_001', tableId: 'tableNonAC11', items: [{ id: 'item4', name: 'Chocolate Lava Cake', quantity: 1, price: 150.00 }], total: 150.00, timestamp: new Date().toISOString(), status: 'Eating', payments: [] },
    // Completed orders for revenue calculation (not linked to active tables, but have 'Completed' status)
    { id: 'completed_order_001', items: [{ id: 'item1', name: 'Penaconda Tortilla', quantity: 1, price: 60.00 }], total: 60.00, status: 'Completed', timestamp: new Date().toISOString(), payments: [{ type: 'Cash', amount: 60.00, timestamp: new Date().toISOString() }] },
    { id: 'completed_order_002', items: [{ id: 'item5', name: 'Paneer Tikka', quantity: 2, price: 180.00 }], total: 360.00, status: 'Completed', timestamp: new Date().toISOString(), payments: [{ type: 'Card', amount: 360.00, timestamp: new Date().toISOString() }] },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false); // Kept for completeness, not linked in UI
  const [showTableOrderModal, setShowTableOrderModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [currentOrderItems, setCurrentOrderItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [amountToPay, setAmountToPay] = useState(''); // Amount for the current payment transaction
  const [paymentType, setPaymentType] = useState('');     // Type for the current payment transaction
  // showPaymentInputSection is no longer needed as the section is always visible for Bill Pending tables

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dashboard metrics
  const totalMenuItems = menuItems.length;
  const occupiedTables = tables.filter(table => table.status === 'Eating' || table.status === 'Bill Pending').length;
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count 'Completed' orders for revenue
    if (order.status === 'Completed') {
      return sum + order.total; // Use order.total which is already calculated
    }
    return sum;
  }, 0);

  // Handles adding a new menu item to the local state (not directly used in UI now, but kept for completeness)
  const handleAddItem = () => {
    if (!newItemName || !newItemPrice || !newItemCategory) {
      console.error("All fields are required to add a menu item.");
      return;
    }
    const newItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      imageUrl: `https://placehold.co/100x100/A0AEC0/FFFFFF?text=${newItemName.substring(0, 3)}`
    };
    setMenuItems(prevItems => [...prevItems, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory('');
    setShowAddItemModal(false);
  };

  // Adds an item to the current order being built in the modal
  const handleAddToCurrentOrder = (item) => {
    setCurrentOrderItems(prevItems => {
      const existingItem = prevItems.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return prevItems.map(orderItem =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Decrements the quantity of an item in the current order being built in the modal
  const handleDecrementCurrentOrder = (itemId) => {
    setCurrentOrderItems(prevItems => {
      const existingItem = prevItems.find(orderItem => orderItem.id === itemId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          return prevItems.map(orderItem =>
            orderItem.id === itemId ? { ...orderItem, quantity: orderItem.quantity - 1 } : orderItem
          );
        } else {
          // If quantity is 1, remove the item entirely
          return prevItems.filter(orderItem => orderItem.id !== itemId);
        }
      }
      return prevItems;
    });
  };

  // Removes an item from the current order being built in the modal
  const handleRemoveFromCurrentOrder = (itemId) => {
    setCurrentOrderItems(prevItems =>
      prevItems.filter(item => item.id !== itemId)
    );
  };

  // Opens the table order management modal
  const handleOpenTableOrderModal = (table) => {
    setSelectedTable(table);
    if (table.currentOrderId) {
      const existingOrder = orders.find(order => order.id === table.currentOrderId);
      setCurrentOrderItems(existingOrder ? existingOrder.items : []);
      // Reset payment states when opening modal
      setAmountToPay('');
      setPaymentType('');
    } else {
      setCurrentOrderItems([]);
      setAmountToPay('');
      setPaymentType('');
    }
    setShowTableOrderModal(true);
  };

  // Saves or updates the order for the selected table
  const handleSaveTableOrder = () => {
    if (!selectedTable) return;

    const orderTotal = currentOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (selectedTable.currentOrderId) {
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === selectedTable.currentOrderId
          ? { ...order, items: currentOrderItems, total: orderTotal }
          : order
      ));
      // If table was Bill Pending and items are added/changed, revert to Eating
      if (selectedTable.status === 'Bill Pending' && currentOrderItems.length > 0) {
        setTables(prevTables => prevTables.map(table =>
          table.id === selectedTable.id ? { ...table, status: 'Eating' } : table
        ));
        setOrders(prevOrders => prevOrders.map(order =>
          order.id === selectedTable.currentOrderId ? { ...order, status: 'Eating' } : order
        ));
      }
    } else {
      const newOrderId = crypto.randomUUID();
      const newOrder = {
        id: newOrderId,
        tableId: selectedTable.id,
        items: currentOrderItems,
        total: orderTotal,
        timestamp: new Date().toISOString(),
        status: 'Eating',
        payments: [] // Initialize payments array for new orders
      };
      setOrders(prevOrders => [...prevOrders, newOrder]);
      setTables(prevTables => prevTables.map(table =>
        table.id === selectedTable.id ? { ...table, status: 'Eating', currentOrderId: newOrderId } : table
      ));
    }
    setShowTableOrderModal(false);
    setSelectedTable(null);
    setCurrentOrderItems([]);
    setAmountToPay('');
    setPaymentType('');
  };

  // Handles adding a payment transaction
  const handleAddPayment = () => {
    if (!selectedTable || !selectedTable.currentOrderId || !paymentType || parseFloat(amountToPay) <= 0) {
      console.error("Invalid payment details or no table/order selected.");
      return;
    }

    const paymentAmountFloat = parseFloat(amountToPay);

    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === selectedTable.currentOrderId) {
        const updatedPayments = [...order.payments, { type: paymentType, amount: paymentAmountFloat, timestamp: new Date().toISOString() }];
        const newTotalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);

        let newOrderStatus = order.status;
        let newTableStatus = selectedTable.status;
        let newCurrentOrderId = selectedTable.currentOrderId;

        if (newTotalPaid >= order.total) {
          newOrderStatus = 'Completed';
          newTableStatus = 'Available'; // Seat Open
          newCurrentOrderId = null; // Clear order link from table
        }

        // Update table status if it changes to Available
        if (newTableStatus === 'Available' && selectedTable.status !== 'Available') {
          setTables(prevTables => prevTables.map(table =>
            table.id === selectedTable.id ? { ...table, status: newTableStatus, currentOrderId: newCurrentOrderId } : table
          ));
          // Close modal and reset states if payment completes the bill
          setShowTableOrderModal(false);
          setSelectedTable(null);
          setCurrentOrderItems([]);
          setAmountToPay('');
          setPaymentType('');
        }

        return { ...order, status: newOrderStatus, payments: updatedPayments };
      }
      return order;
    }));

    // Reset payment input fields after adding payment
    setAmountToPay('');
    setPaymentType('');
  };

  // Updates the status of a table (used by direct buttons on table cards)
  const updateTableStatus = (tableId, newStatus) => {
    setTables(prevTables => prevTables.map(table => {
      if (table.id === tableId) {
        let updatedTable = { ...table, status: newStatus };
        // If status becomes 'Bill Pending', update linked order status as well
        if (newStatus === 'Bill Pending' && table.currentOrderId) {
          setOrders(prevOrders => prevOrders.map(order =>
            order.id === table.currentOrderId ? { ...order, status: 'Bill Pending' } : order
          ));
        }
        return updatedTable;
      }
      return table;
    }));
  };

  // Deletes a menu item from the local state (not directly used in UI now, but kept for completeness)
  const deleteMenuItem = (itemId) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Function to get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800'; // Green for free
      case 'Eating': return 'bg-yellow-100 text-yellow-800';  // Yellow for occupied (eating)
      case 'Bill Pending': return 'bg-yellow-100 text-yellow-800'; // Yellow for occupied (bill pending)
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <CheckCircle className="w-8 h-8 mb-2" />;
      case 'Eating': return <CircleDot className="w-8 h-8 mb-2" />;
      case 'Bill Pending': return <Receipt className="w-8 h-8 mb-2" />;
      default: return <UtensilsCrossed className="w-8 h-8 mb-2" />;
    }
  };

  // Categorize tables
  const acTables = tables.filter(table => table.name.startsWith('AC'));
  const nonAcTables = tables.filter(table => table.name.startsWith('Non-AC'));

  // Calculate the total for the current order items in the modal
  const currentOrderTotal = currentOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate total paid for the current selected order
  const selectedOrder = selectedTable && selectedTable.currentOrderId
    ? orders.find(order => order.id === selectedTable.currentOrderId)
    : null;
  const totalPaidForSelectedOrder = selectedOrder
    ? selectedOrder.payments.reduce((sum, p) => sum + p.amount, 0)
    : 0;
  const totalDueForSelectedOrder = selectedOrder
    ? Math.max(0, selectedOrder.total - totalPaidForSelectedOrder)
    : 0;


  return (
    <div className="min-h-screen bg-gray-100 font-inter p-4 sm:p-6 lg:p-8">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Menu Items Card */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">TOTAL MENU ITEMS</p>
            <p className="text-3xl font-bold text-gray-800">{totalMenuItems}</p>
            <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Occupied Tables Card */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">OCCUPIED TABLES</p>
            <p className="text-3xl font-bold text-gray-800">{occupiedTables}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <UtensilsCrossed className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        {/* Today's Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">TODAY'S REVENUE</p>
            <p className="text-3xl font-bold text-gray-800">₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <IndianRupee className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Placeholder Card (can be used for something else later) */}
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">QUICK ACTIONS</p>
            <p className="text-3xl font-bold text-gray-800">...</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <RefreshCcw className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full space-y-8">
        {/* AC Tables Section */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AC Tables</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
            {acTables.length > 0 ? (
              acTables.map(table => (
                <div
                  key={table.id}
                  className={`p-4 rounded-lg shadow-md cursor-pointer flex flex-col items-center justify-center text-center
                    ${getStatusColorClass(table.status)} hover:shadow-lg transition duration-300`}
                  onClick={() => handleOpenTableOrderModal(table)}
                >
                  {getStatusIcon(table.status)}
                  <p className="font-semibold text-lg">{table.name}</p>
                  <p className="text-sm font-medium">{table.status}</p>
                  {table.status === 'Eating' && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateTableStatus(table.id, 'Bill Pending'); }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600 transition duration-300"
                        title="Mark Bill Pending"
                      >
                        <Receipt className="inline-block w-4 h-4 mr-1" /> Bill
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm">No AC tables configured.</p>
              </div>
            )}
          </div>
        </div>

        {/* Non-AC Tables Section */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Non-AC Tables</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
            {nonAcTables.length > 0 ? (
              nonAcTables.map(table => (
                <div
                  key={table.id}
                  className={`p-4 rounded-lg shadow-md cursor-pointer flex flex-col items-center justify-center text-center
                    ${getStatusColorClass(table.status)} hover:shadow-lg transition duration-300`}
                  onClick={() => handleOpenTableOrderModal(table)}
                >
                  {getStatusIcon(table.status)}
                  <p className="font-semibold text-lg">{table.name}</p>
                  <p className="text-sm font-medium">{table.status}</p>
                  {table.status === 'Eating' && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateTableStatus(table.id, 'Bill Pending'); }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600 transition duration-300"
                        title="Mark Bill Pending"
                      >
                        <Receipt className="inline-block w-4 h-4 mr-1" /> Bill
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm">No Non-AC tables configured.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal (Still available, but not linked from main UI) */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
            <div className="mb-4">
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                id="itemName"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Penaconda Tortilla"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                id="itemPrice"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="e.g., 60.00"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                id="itemCategory"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                placeholder="e.g., Tandoori"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Order Management Modal */}
      {showTableOrderModal && selectedTable && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Manage Order for Table: {selectedTable.name}</h3>
            <div className="flex-grow overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Available Menu Items for Ordering */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <p className="font-medium mb-2">Available Items</p>
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {filteredMenuItems.length > 0 ? (
                      filteredMenuItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 rounded-md object-cover mr-2"
                              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/A0AEC0/FFFFFF?text=${item.name.substring(0, 3)}`; }}
                            />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-600">₹{item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddToCurrentOrder(item)}
                            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition duration-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm">No items to add.</p>
                    )}
                  </div>
                </div>

                {/* Current Order Summary for the Table */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <p className="font-medium mb-2">Current Order for {selectedTable.name}</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {currentOrderItems.length > 0 ? (
                      currentOrderItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                          <div>
                            <p className="text-sm font-medium">{item.name} x {item.quantity}</p>
                            <p className="text-xs text-blue-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDecrementCurrentOrder(item.id)}
                              className="text-blue-600 hover:text-blue-800 transition duration-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveFromCurrentOrder(item.id)}
                              className="text-red-500 hover:text-red-700 transition duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-sm">No items in order yet for this table.</p>
                    )}
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-200 text-right">
                    <p className="font-bold text-lg">Total: ₹{currentOrderTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Section - Always show if table is Bill Pending */}
              {selectedTable.status === 'Bill Pending' && (
                <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">Payment Details</h4>
                  <p className="text-lg font-bold text-gray-900 mb-2">Total Bill: ₹{currentOrderTotal.toFixed(2)}</p>
                  <p className="text-lg font-bold text-gray-900 mb-2">Total Paid: ₹{totalPaidForSelectedOrder.toFixed(2)}</p>
                  <p className="text-xl font-bold text-red-700 mb-4">Total Due: ₹{totalDueForSelectedOrder.toFixed(2)}</p>

                  {totalDueForSelectedOrder > 0 && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-white mt-4">
                      <h5 className="font-semibold text-gray-800 mb-3">Add Payment</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (₹)</label>
                          <input
                            type="number"
                            id="amountPaid"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={amountToPay}
                            onChange={(e) => setAmountToPay(e.target.value)}
                            placeholder={totalDueForSelectedOrder.toFixed(2)}
                          />
                        </div>
                        <div>
                          <label htmlFor="paymentTypeSelect" className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                          <div className="relative">
                            <select
                              id="paymentTypeSelect"
                              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                              value={paymentType}
                              onChange={(e) => setPaymentType(e.target.value)}
                            >
                              <option value="">Select Type</option>
                              <option value="Cash">Cash</option>
                              <option value="Card">Card</option>
                              <option value="UPI">UPI</option>
                              <option value="Other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddPayment}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                          disabled={!paymentType || parseFloat(amountToPay) <= 0 || parseFloat(amountToPay) > totalDueForSelectedOrder + 0.01} // Allow slight overpayment for change
                        >
                          Add Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedOrder && selectedOrder.payments.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Payment History:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {selectedOrder.payments.map((p, index) => (
                          <li key={index}>
                            ₹{p.amount.toFixed(2)} by {p.type} on {new Date(p.timestamp).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => { setShowTableOrderModal(false); setSelectedTable(null); setCurrentOrderItems([]); setAmountToPay(''); setPaymentType(''); }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Close
              </button>
              {selectedTable.status !== 'Bill Pending' && ( // Only show Save Order if not Bill Pending
                <button
                  onClick={handleSaveTableOrder}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                  disabled={currentOrderItems.length === 0}
                >
                  Save Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
