import React, { useState } from 'react';
import {
  FiUser,
  FiLock,
  FiMail,
  FiShield,
  FiUsers,
  FiSettings,
  FiClock,
  FiCreditCard,
  FiDatabase,
  FiBell,
  FiLayers,
  FiFileText,
  FiCheckCircle,
  FiX,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiUpload
} from 'react-icons/fi';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'Head Admin', lastActive: '2 hours ago' },
    { id: 2, name: 'Manager User', email: 'manager@example.com', role: 'Admin', lastActive: '1 day ago' },
    { id: 3, name: 'Support User', email: 'support@example.com', role: 'Support', lastActive: '3 days ago' }
  ]);
  const [sessions, setSessions] = useState([
    { id: 'session1', device: 'Chrome on Windows', ip: '192.168.1.1', lastActive: 'Current session' },
    { id: 'session2', device: 'Safari on iPhone', ip: '192.168.1.2', lastActive: '2 days ago' }
  ]);
  const [apiKeys, setApiKeys] = useState([
    { id: 'key1', name: 'Payment Gateway', key: 'sk_test_*****1234', created: 'Jun 12, 2023', lastUsed: '1 hour ago' },
    { id: 'key2', name: 'Analytics Service', key: 'sk_live_*****5678', created: 'May 5, 2023', lastUsed: '3 days ago' }
  ]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [siteName, setSiteName] = useState('CuisineBerg');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('en');
  const [deliveryZones, setDeliveryZones] = useState([
    { id: 1, name: 'Central District', fee: 50, minOrder: 200 },
    { id: 2, name: 'Suburban Areas', fee: 80, minOrder: 300 },
    { id: 3, name: 'Outskirts', fee: 120, minOrder: 500 }
  ]);
  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', open: '09:00', close: '22:00', delivery: true },
    { day: 'Tuesday', open: '09:00', close: '22:00', delivery: true },
    { day: 'Wednesday', open: '09:00', close: '22:00', delivery: true },
    { day: 'Thursday', open: '09:00', close: '22:00', delivery: true },
    { day: 'Friday', open: '09:00', close: '23:00', delivery: true },
    { day: 'Saturday', open: '10:00', close: '23:00', delivery: true },
    { day: 'Sunday', open: '10:00', close: '22:00', delivery: false }
  ]);

  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState('Default Privacy Policy content...');
  const [displayPrivacyPolicy, setDisplayPrivacyPolicy] = useState(true);
  const [termsOfServiceContent, setTermsOfServiceContent] = useState('Default Terms of Service content...');
  const [displayTermsOfService, setDisplayTermsOfService] = useState(true);
  const [gdprEnabled, setGdprEnabled] = useState(false);
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('12 months');


  const handleAddAdmin = () => {
    console.log('Add new admin');
  };

  const handleRevokeSession = (sessionId) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const handleRegenerateApiKey = (keyId) => {
    console.log(`Regenerate API key ${keyId}`);
  };

  const handleSaveSettings = () => {
    console.log('Settings saved');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'profile' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiUser className="mr-3" />
                Profile & Account
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'users' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiUsers className="mr-3" />
                User & Role Management
              </button>
              <button
                onClick={() => setActiveTab('app')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'app' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiSettings className="mr-3" />
                Application Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'security' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiShield className="mr-3" />
                Security & Access
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'business' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiCreditCard className="mr-3" />
                Business Operations
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'data' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiDatabase className="mr-3" />
                Data & Backup
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'notifications' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiBell className="mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('customization')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'customization' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiLayers className="mr-3" />
                Customization
              </button>
              <button
                onClick={() => setActiveTab('legal')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${activeTab === 'legal' ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <FiFileText className="mr-3" />
                Legal & Compliance
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile & Account Management</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 rounded-full"
                      src="https://placehold.co/150"
                      alt="Admin profile"
                    />
                  </div>
                  <div>
                    <button className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                      Change Photo
                    </button>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      JPG, GIF or PNG. Max size of 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      defaultValue="admin@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      defaultValue="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiLock className="mr-2" /> Change Password
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiShield className="mr-2" /> Security
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">User & Role Management</h3>
                <button
                  onClick={handleAddAdmin}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-1" /> Add Admin
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {admins.map((admin) => (
                        <tr key={admin.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {admin.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              admin.role === 'Head Admin'
                                ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {admin.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-3">
                              <FiEdit2 />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500">
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Role Permissions</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Head Admin</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> Full access</li>
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> User management</li>
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> Settings modification</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Admin</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> Manage orders</li>
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> View reports</li>
                          <li className="flex items-center"><FiX className="mr-1 text-red-500" /> No user management</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Support</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> View orders</li>
                          <li className="flex items-center"><FiCheckCircle className="mr-1 text-green-500" /> Customer support</li>
                          <li className="flex items-center"><FiX className="mr-1 text-red-500" /> No settings access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Application Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">General Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="site-name"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="primary-color-app" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="primary-color-app"
                          className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{primaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Regional Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      >
                        <option value="Asia/Kolkata">(GMT+5:30) India Standard Time</option>
                        <option value="America/New_York">(GMT-5:00) Eastern Time</option>
                        <option value="Europe/London">(GMT+0:00) London</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                          Email Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive important updates via email
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms-notifications"
                          name="sms-notifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                          SMS Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive urgent alerts via SMS
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="push-notifications"
                          name="push-notifications"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="push-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                          Push Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Get real-time updates on your device
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security & Access</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Device
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sessions.map((session) => (
                          <tr key={session.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {session.device}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {session.ip}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {session.lastActive}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {session.lastActive !== 'Current session' && (
                                <button
                                  onClick={() => handleRevokeSession(session.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                                >
                                  Revoke
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Password Policies</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Minimum Password Length</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Require passwords to be at least 8 characters
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="6"
                          max="20"
                          className="block w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          defaultValue="8"
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">characters</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="complexity"
                          name="complexity"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="complexity" className="font-medium text-gray-700 dark:text-gray-300">
                          Require Complexity
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Must include uppercase, lowercase, numbers, and symbols
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Password Expiry</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Require password change every
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          className="block w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          defaultValue="3"
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">months</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">API Keys</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Key
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Last Used
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {apiKeys.map((key) => (
                          <tr key={key.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {key.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {key.key}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {key.created}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {key.lastUsed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleRegenerateApiKey(key.id)}
                                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-3"
                              >
                                Regenerate
                              </button>
                              <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500">
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <FiPlus className="mr-1" /> Generate New API Key
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Login Security</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Failed Login Attempts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lock account after too many failed attempts
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          className="block w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          defaultValue="5"
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">attempts</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Account Lockout Duration</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          How long to lock the account after too many failed attempts
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="120"
                          className="block w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                          defaultValue="30"
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">minutes</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="ip-restriction"
                          name="ip-restriction"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="ip-restriction" className="font-medium text-gray-700 dark:text-gray-300">
                          IP Restriction
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Only allow access from specific IP addresses
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Security Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Operations</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Delivery Zones</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Zone Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Delivery Fee
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Minimum Order
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {deliveryZones.map((zone) => (
                          <tr key={zone.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {zone.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              ₹{zone.fee}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              ₹{zone.minOrder}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500 mr-3">
                                <FiEdit2 />
                              </button>
                              <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <FiPlus className="mr-1" /> Add Delivery Zone
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Business Hours</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Day
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Opening Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Closing Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Delivery Available
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {businessHours.map((day) => (
                          <tr key={day.day}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {day.day}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <input
                                type="time"
                                className="border-gray-300 dark:border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                                defaultValue={day.open}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <input
                                type="time"
                                className="border-gray-300 dark:border-gray-600 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                                defaultValue={day.close}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                defaultChecked={day.delivery}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-500">
                                <FiCheckCircle />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="cash-on-delivery"
                          name="cash-on-delivery"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="cash-on-delivery" className="font-medium text-gray-700 dark:text-gray-300">
                          Cash on Delivery
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Allow customers to pay when they receive their order
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="online-payment"
                          name="online-payment"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="online-payment" className="font-medium text-gray-700 dark:text-gray-300">
                          Online Payment
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Accept credit/debit cards and digital wallets
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="wallet-payment"
                          name="wallet-payment"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="wallet-payment" className="font-medium text-gray-700 dark:text-gray-300">
                          Wallet Payment
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Allow payments from customer wallet balance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Business Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data & Backup</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Database Backups</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Last Backup</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          June 20, 2023 at 2:30 AM (2.4 GB)
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FiDownload className="mr-1" /> Download
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FiPlus className="mr-1" /> Create Backup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Backup Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic Backups</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Regularly backup your database automatically
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div>
                      <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Backup Frequency
                      </label>
                      <select
                        id="backup-frequency"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      >
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="backup-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Backup Time
                      </label>
                      <input
                        type="time"
                        id="backup-time"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        defaultValue="02:00"
                      />
                    </div>
                    <div>
                      <label htmlFor="backup-retention" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Backup Retention
                      </label>
                      <select
                        id="backup-retention"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      >
                        <option>Keep last 7 backups</option>
                        <option>Keep last 14 backups</option>
                        <option>Keep last 30 backups</option>
                        <option>Keep all backups</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Data Export</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="export-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Export Format
                      </label>
                      <select
                        id="export-format"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      >
                        <option>CSV</option>
                        <option>JSON</option>
                        <option>Excel</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiDownload className="mr-2" /> Export Orders
                      </button>
                      <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiDownload className="mr-2" /> Export Customers
                      </button>
                      <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiDownload className="mr-2" /> Export Menu Items
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Data Import</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="import-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Import File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            CSV, JSON, or Excel files up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiUpload className="mr-2" /> Import Orders
                      </button>
                      <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiUpload className="mr-2" /> Import Customers
                      </button>
                      <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiUpload className="mr-2" /> Import Menu Items
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h4>
                  <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">Delete All Data</p>
                        <p className="text-sm text-red-600 dark:text-red-300">
                          This will permanently delete all data from the database. This action cannot be undone.
                        </p>
                      </div>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete All Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-orders-email"
                          name="new-orders-email"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-orders-email" className="font-medium text-gray-700 dark:text-gray-300">
                          New Orders
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive email notifications when new orders are placed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="order-updates-email"
                          name="order-updates-email"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="order-updates-email" className="font-medium text-gray-700 dark:text-gray-300">
                          Order Status Updates
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Get notified when order status changes (confirmed, shipped, delivered)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="payments-email"
                          name="payments-email"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="payments-email" className="font-medium text-gray-700 dark:text-gray-300">
                          Payment Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive emails for successful and failed payments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="reviews-email"
                          name="reviews-email"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="reviews-email" className="font-medium text-gray-700 dark:text-gray-300">
                          New Reviews
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Get notified when customers leave reviews
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">SMS Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="urgent-orders-sms"
                          name="urgent-orders-sms"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="urgent-orders-sms" className="font-medium text-gray-700 dark:text-gray-300">
                          Urgent Orders
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive SMS for large or urgent orders
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="after-hours-sms"
                          name="after-hours-sms"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="after-hours-sms" className="font-medium text-gray-700 dark:text-gray-300">
                          After-Hours Orders
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Get SMS notifications for orders placed outside business hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Push Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-orders-push"
                          name="new-orders-push"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-orders-push" className="font-medium text-gray-700 dark:text-gray-300">
                          New Orders
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive push notifications when new orders are placed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="promotions-push"
                          name="promotions-push"
                          type="checkbox"
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="promotions-push" className="font-medium text-gray-700 dark:text-gray-300">
                          Promotions & Offers
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Get notified about special promotions and offers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="notification-sound" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notification Sound
                      </label>
                      <select
                        id="notification-sound"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      >
                        <option>Default</option>
                        <option>Chime</option>
                        <option>Bell</option>
                        <option>None</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Desktop Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Show desktop notifications when new orders arrive
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div>
                      <label htmlFor="notification-delay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notification Delay
                      </label>
                      <select
                        id="notification-delay"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      >
                        <option>Immediately</option>
                        <option>After 5 minutes</option>
                        <option>After 15 minutes</option>
                        <option>After 30 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customization' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customization</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Theme Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="primary-color"
                          className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="secondary-color"
                          className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          defaultValue="#10B981"
                        />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">#10B981</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Logo & Favicon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Upload Logo
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <img src="https://placehold.co/100x50/aabbcc/ffffff?text=Logo" alt="Current Logo" className="mx-auto mb-2" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="logo-file-upload"
                              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input id="logo-file-upload" name="logo-file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="favicon-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Upload Favicon
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <img src="https://placehold.co/32x32/ddeeff/000000?text=Fav" alt="Current Favicon" className="mx-auto mb-2" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="favicon-file-upload"
                              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input id="favicon-file-upload" name="favicon-file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ICO, PNG, SVG up to 1MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Custom Code</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="custom-css" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Custom CSS
                      </label>
                      <textarea
                        id="custom-css"
                        rows="5"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 font-mono text-sm"
                        value={customCSS}
                        onChange={(e) => setCustomCSS(e.target.value)}
                        placeholder={`/* Add your custom CSS here */\nbody { font-family: 'Inter', sans-serif; }`}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="custom-js" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Custom JavaScript
                      </label>
                      <textarea
                        id="custom-js"
                        rows="5"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 font-mono text-sm"
                        value={customJS}
                        onChange={(e) => setCustomJS(e.target.value)}
                        placeholder={`// Add your custom JavaScript here\nconsole.log('Hello from custom JS!');`}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Customization
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Legal & Compliance</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Privacy Policy</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="privacy-policy-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Privacy Policy Content
                      </label>
                      <textarea
                        id="privacy-policy-content"
                        rows="10"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={privacyPolicyContent}
                        onChange={(e) => setPrivacyPolicyContent(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Display on Website</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Make the privacy policy visible on your public website.
                        </p>
                      </div>
                      <button
                        onClick={() => setDisplayPrivacyPolicy(!displayPrivacyPolicy)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${displayPrivacyPolicy ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${displayPrivacyPolicy ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Terms of Service</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="terms-of-service-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Terms of Service Content
                      </label>
                      <textarea
                        id="terms-of-service-content"
                        rows="10"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={termsOfServiceContent}
                        onChange={(e) => setTermsOfServiceContent(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Display on Website</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Make the terms of service visible on your public website.
                        </p>
                      </div>
                      <button
                        onClick={() => setDisplayTermsOfService(!displayTermsOfService)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${displayTermsOfService ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${displayTermsOfService ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">GDPR Compliance</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">GDPR Compliance Enabled</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable features to help comply with GDPR regulations.
                        </p>
                      </div>
                      <button
                        onClick={() => setGdprEnabled(!gdprEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${gdprEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${gdprEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <div>
                      <label htmlFor="data-retention" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data Retention Period
                      </label>
                      <select
                        id="data-retention"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700"
                        value={dataRetentionPeriod}
                        onChange={(e) => setDataRetentionPeriod(e.target.value)}
                      >
                        <option>6 months</option>
                        <option>12 months</option>
                        <option>24 months</option>
                        <option>Indefinite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Legal Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
