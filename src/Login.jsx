import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // General success messages
    const [error, setError] = useState('');     // General error messages
    const [isLoading, setIsLoading] = useState(false); // Loading state for all async operations

    // Forgot Password specific states
    const [forgotPasswordStep, setForgotPasswordStep] = useState('none'); // 'none', 'email', 'otp', 'reset'
    const [forgotEmail, setForgotEmail] = useState(''); // Email entered for password reset
    const [otpForReset, setOtpForReset] = useState(''); // OTP entered for password reset
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState(''); // Specific error for forgot password flow
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState(''); // Specific message for forgot password flow


    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || '/';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/profile');
        }
    }, [navigate]);

    const clearMessagesAndErrors = () => {
        setMessage('');
        setError('');
        setForgotPasswordError('');
        setForgotPasswordMessage('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        clearMessagesAndErrors();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setMessage('Logging in...');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
                setMessage(''); // Clear any pending messages
            } else {
                setMessage('Login successful! Redirecting...');
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 1000);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
            setMessage(''); // Clear any pending messages
        } finally {
            setIsLoading(false);
        }
    };

    // --- Forgot Password Handlers ---

    const handleForgotPasswordEmailSubmit = async (e) => {
        e.preventDefault();
        setForgotPasswordError('');
        setForgotPasswordMessage('');

        if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
            setForgotPasswordError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setForgotPasswordMessage('Sending OTP to your email...');

        try {
            // Backend endpoint to send OTP for password reset
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/forgot-password-send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            const data = await response.json();

            if (!response.ok) {
                setForgotPasswordError(data.message || 'Failed to send OTP for password reset.');
            } else {
                setForgotPasswordMessage('OTP sent to your email. Please check your inbox.');
                setForgotPasswordStep('otp'); // Move to OTP verification step
            }
        } catch (err) {
            console.error('Forgot password OTP send error:', err);
            setForgotPasswordError('Could not send OTP. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordOtpVerify = async (e) => {
        e.preventDefault();
        setForgotPasswordError('');
        setForgotPasswordMessage('');

        if (!otpForReset || !/^\d{6}$/.test(otpForReset)) {
            setForgotPasswordError('Please enter a 6-digit OTP.');
            return;
        }

        setIsLoading(true);
        setForgotPasswordMessage('Verifying OTP...');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/verify-otp`, {
                email: forgotEmail,
                otp: otpForReset
            });
            if (response.status === 200 && response.data.message === 'OTP verified') {
                setForgotPasswordMessage('OTP verified. Please set your new password.');
                setForgotPasswordStep('reset');
            } else {
                setForgotPasswordError('OTP verification failed. Please try again.');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setForgotPasswordError(
                err.response?.data?.message || 'OTP verification failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };


    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setForgotPasswordError('');
        setForgotPasswordMessage('');

        if (!newPassword || newPassword.length < 6) {
            setForgotPasswordError('New password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setForgotPasswordError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setForgotPasswordMessage('Resetting your password...');

        try {
            // Backend endpoint to reset password with OTP and new password
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: forgotEmail,
                    otp: otpForReset,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setForgotPasswordError(data.message || 'Failed to reset password.');
            } else {
                setForgotPasswordMessage('Password successfully changed! Redirecting to login...');
                setTimeout(() => {
                    setForgotPasswordStep('none'); // Reset flow
                    clearMessagesAndErrors();
                    setEmail(''); // Clear login fields
                    setPassword('');
                }, 2000); // Give time to read message before redirecting
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setForgotPasswordError('Something went wrong during password reset. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render Logic ---

    const renderForgotPasswordForm = () => {
        switch (forgotPasswordStep) {
            case 'email':
                return (
                    <form onSubmit={handleForgotPasswordEmailSubmit} className="space-y-6">
                        <p className="text-gray-600 text-center mb-4">Enter your email address to receive a password reset OTP.</p>
                        <div>
                            <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="forgotEmail"
                                value={forgotEmail}
                                onChange={e => { setForgotEmail(e.target.value); setForgotPasswordError(''); setForgotPasswordMessage(''); }}
                                required
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>
                        {forgotPasswordError && <div className="text-red-500 text-sm text-center">{forgotPasswordError}</div>}
                        {forgotPasswordMessage && <div className="text-blue-600 text-sm text-center">{forgotPasswordMessage}</div>}
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 font-semibold shadow-md transition duration-300
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setForgotPasswordStep('none'); clearMessagesAndErrors(); }}
                            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 font-semibold hover:bg-gray-300 transition duration-300 text-sm"
                            disabled={isLoading}
                        >
                            Back to Login
                        </button>
                    </form>
                );
            case 'otp':
                return (
                    <form onSubmit={handleForgotPasswordOtpVerify} className="space-y-6">
                        <p className="text-gray-600 text-center mb-4">
                            An OTP has been sent to <span className="font-semibold">{forgotEmail}</span>. Enter it below to proceed.
                        </p>
                        <div>
                            <label htmlFor="otpForReset" className="block text-sm font-semibold text-gray-700 mb-1">OTP</label>
                            <input
                                type="text"
                                id="otpForReset"
                                value={otpForReset}
                                onChange={e => { setOtpForReset(e.target.value); setForgotPasswordError(''); setForgotPasswordMessage(''); }}
                                required
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                disabled={isLoading}
                            />
                        </div>
                        {forgotPasswordError && <div className="text-red-500 text-sm text-center">{forgotPasswordError}</div>}
                        {forgotPasswordMessage && <div className="text-blue-600 text-sm text-center">{forgotPasswordMessage}</div>}
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 font-semibold shadow-md transition duration-300
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={handleForgotPasswordEmailSubmit} // Re-use the email submit for resend
                            className={`w-full mt-2 py-2 px-4 font-semibold transition duration-300 text-sm
                                ${isLoading
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resending...' : 'Resend OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setForgotPasswordStep('email'); setForgotPasswordError(''); setForgotPasswordMessage(''); }}
                            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 font-semibold hover:bg-gray-300 transition duration-300 text-sm"
                            disabled={isLoading}
                        >
                            Change Email
                        </button>
                    </form>
                );
            case 'reset':
                return (
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        <p className="text-gray-600 text-center mb-4">
                            Enter and confirm your new password for <span className="font-semibold">{forgotEmail}</span>.
                        </p>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={e => { setNewPassword(e.target.value); setForgotPasswordError(''); setForgotPasswordMessage(''); }}
                                required
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={e => { setConfirmNewPassword(e.target.value); setForgotPasswordError(''); setForgotPasswordMessage(''); }}
                                required
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                disabled={isLoading}
                            />
                        </div>
                        {forgotPasswordError && <div className="text-red-500 text-sm text-center">{forgotPasswordError}</div>}
                        {forgotPasswordMessage && <div className="text-green-600 text-sm text-center">{forgotPasswordMessage}</div>}
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 font-semibold shadow-md transition duration-300
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setForgotPasswordStep('none'); clearMessagesAndErrors(); }}
                            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 font-semibold hover:bg-gray-300 transition duration-300 text-sm"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </form>
                );
            default: // 'none'
                return (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                required
                                onChange={e => { setEmail(e.target.value); clearMessagesAndErrors(); }}
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                required
                                onChange={e => { setPassword(e.target.value); clearMessagesAndErrors(); }}
                                className="w-full p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={isLoading}
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        {message && <div className="text-green-600 text-sm text-center">{message}</div>}
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 font-semibold shadow-md transition duration-300
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white'
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging In...' : 'Login'}
                        </button>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { setForgotPasswordStep('email'); clearMessagesAndErrors(); }}
                                className="text-blue-500 hover:underline text-sm font-semibold"
                                disabled={isLoading}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 shadow-2xl border border-blue-100">
                    <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center tracking-tight">
                        {forgotPasswordStep === 'none' ? 'Login' : 'Forgot Password'}
                    </h2>

                    {renderForgotPasswordForm()}

                    {forgotPasswordStep === 'none' && (
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Don't have an account?</span>
                            <Link
                                to="/register"
                                className="text-blue-500 font-semibold hover:underline transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}