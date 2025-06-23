import { AnimatePresence, motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import React, { useState } from 'react';

export default function RetailPassChange() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [field, setField] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('New password and confirmation do not match.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('retailtoken')}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok && data.message === 'Password changed successfully.') {
                setMessage('Password changed successfully!');
                setTimeout(() => setMessage(''), 2000);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setField(false), 2000);
            } else {
                setMessage(data.message || 'Could not change password.');
            }
        } catch (error) {
            setMessage(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mt-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6'>


            <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center">
                <KeyRound className="mr-2 text-blue-600" size={18} />
                Change Password
            </h3>

            <AnimatePresence>
                {!field && (
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Change the Password of your Account
                        </p>
                        <button
                            onClick={() => setField(true)}
                            className="bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 rounded-md"
                        >
                            Update
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {field &&
                    <motion.form
                        className="space-y-4 "
                        key="password-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your current password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        {message && (
                            <div
                                className={`text-sm mb-2 ${message.includes('success')
                                    ? 'text-green-500 dark:text-green-400'
                                    : 'text-red-500 dark:text-red-400'
                                    }`}
                            >
                                {message}
                            </div>
                        )}

                        <div className="pt-2 flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                            >
                                {loading && (
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                )}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setField(false)} className='bg-red-600 hover:bg-red-700 transition-colors duration-150 text-white px-4 py-2 rounded-md'>
                                Cancel
                            </button>
                        </div>
                    </motion.form>}
            </AnimatePresence>
        </div>
    );
}
