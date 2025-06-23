import React, { useState } from 'react';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiTrendingUp, 
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AdminReport = () => {
  // Date filter state
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dummy data
  const summaryData = {
    totalOrders: {
      today: 42,
      week: 287,
      month: 1250,
      trend: 'up'
    },
    totalRevenue: {
      delivery: 185000,
      dineIn: 142000,
      combined: 327000,
      trend: 'up'
    },
    activeUsers: 843,
    avgOrderValue: 1450,
    completionRate: '92%',
    cancellationRate: '8%'
  };

  const orderBreakdown = {
    deliveryVsDineIn: [
      { name: 'Delivery', value: 65 },
      { name: 'Dine-In', value: 35 }
    ],
    dailyTrend: [
      { name: 'Mon', orders: 35, revenue: 45000 },
      { name: 'Tue', orders: 42, revenue: 52000 },
      { name: 'Wed', orders: 38, revenue: 48000 },
      { name: 'Thu', orders: 55, revenue: 62000 },
      { name: 'Fri', orders: 62, revenue: 75000 },
      { name: 'Sat', orders: 78, revenue: 92000 },
      { name: 'Sun', orders: 65, revenue: 81000 }
    ],
    peakTimes: [
      { hour: '8-10', orders: 45 },
      { hour: '10-12', orders: 78 },
      { hour: '12-2', orders: 132 },
      { hour: '2-4', orders: 65 },
      { hour: '4-6', orders: 89 },
      { hour: '6-8', orders: 112 },
      { hour: '8-10', orders: 76 }
    ]
  };

  const revenueData = {
    byType: [
      { name: 'Delivery', value: 65 },
      { name: 'Dine-In', value: 35 }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 280000 },
      { month: 'Feb', revenue: 310000 },
      { month: 'Mar', revenue: 295000 },
      { month: 'Apr', revenue: 320000 },
      { month: 'May', revenue: 350000 },
      { month: 'Jun', revenue: 327000 }
    ],
    topItems: [
      { name: 'Butter Chicken', orders: 342, revenue: 410400 },
      { name: 'Biryani', orders: 298, revenue: 357600 },
      { name: 'Paneer Tikka', orders: 265, revenue: 318000 },
      { name: 'Dal Makhani', orders: 210, revenue: 252000 },
      { name: 'Naan', orders: 587, revenue: 117400 }
    ]
  };

  const customerData = {
    repeatVsNew: [
      { name: 'Repeat', value: 62 },
      { name: 'New', value: 38 }
    ],
    avgRating: 4.5,
    recentFeedback: [
      { rating: 5, comment: 'Excellent food and service!' },
      { rating: 4, comment: 'Good but delivery was late' },
      { rating: 5, comment: 'Will order again' },
      { rating: 3, comment: 'Food was cold on arrival' }
    ]
  };

  const operationalData = {
    avgDeliveryTime: '35 mins',
    avgDineInTime: '25 mins',
    fulfillmentTime: '15 mins',
    deliveryPartners: [
      { name: 'Partner A', rating: 4.8, deliveries: 142 },
      { name: 'Partner B', rating: 4.6, deliveries: 128 },
      { name: 'Partner C', rating: 4.3, deliveries: 95 }
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, you would fetch data based on the selected range
  };

  const handleRefresh = () => {
    // In a real app, this would refresh the data
    console.log('Refreshing data...');
  };

  const handleExport = (format) => {
    console.log(`Exporting data as ${format}...`);
    // In a real app, this would trigger a download
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Reports & Analytics
        </h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              className="block pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {dateRange === 'custom' && (
            <div className="flex space-x-2">
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summaryData.totalOrders.today}
                </p>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">today</span>
                <span className="ml-2 text-sm text-green-500">
                  ({summaryData.totalOrders.week} this week)
                </span>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FiShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹{(summaryData.totalRevenue.combined / 1000).toFixed(1)}k
                </p>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">this month</span>
              </div>
              <div className="mt-2 text-xs">
                <span className="text-gray-500 dark:text-gray-400">Delivery: ₹{(summaryData.totalRevenue.delivery / 1000).toFixed(1)}k</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Dine-In: ₹{(summaryData.totalRevenue.dineIn / 1000).toFixed(1)}k</span>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Customers</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {summaryData.activeUsers}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">30% repeat customers</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <FiUsers className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Order Value</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{summaryData.avgOrderValue}
              </p>
              <p className="mt-1 text-sm text-green-500 flex items-center">
                <FiTrendingUp className="mr-1" /> 12% from last month
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </div>

        {/* Order Completion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Completion</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {summaryData.completionRate}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FiCheckCircle className="mr-1 text-green-500" /> Successful orders
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancellation Rate</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {summaryData.cancellationRate}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FiXCircle className="mr-1 text-red-500" /> Failed orders
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <FiXCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Type Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Order Type Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderBreakdown.deliveryVsDineIn}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderBreakdown.deliveryVsDineIn.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Order Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Daily Order Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderBreakdown.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Monthly Revenue Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Order Times */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Peak Order Times
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderBreakdown.peakTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#ffc658" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Top Selling Items
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Popularity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {revenueData.topItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ₹{item.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(item.orders / revenueData.topItems[0].orders) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Feedback */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Customer Feedback
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customerData.recentFeedback.map((feedback, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  {feedback.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                "{feedback.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReport;