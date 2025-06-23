import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    const [step, setStep] = useState('register'); // 'register' or 'verify'
    const [emailForVerification, setEmailForVerification] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New loading state for all async operations
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
        setMessage({ text: '', type: '' }); // Clear message when typing
        setErrors({}); // Clear specific field errors when typing
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        setMessage({ text: '', type: '' }); // Clear message when typing
        setErrors({}); // Clear specific field errors when typing
    };

    const validateRegisterForm = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    };

    const validateOtpForm = () => {
        const newErrors = {};
        if (!otp.trim()) newErrors.otp = 'OTP is required';
        else if (!/^\d{6}$/.test(otp)) newErrors.otp = 'OTP must be a 6-digit number';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateRegisterForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/send-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: form.email }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage({ text: data.message || 'Failed to send OTP!', type: 'error' });
                } else {
                    setMessage({ text: 'OTP sent to your email. Please verify.', type: 'success' });
                    setEmailForVerification(form.email);
                    setStep('verify'); // Move to OTP verification step
                }
            } catch (error) {
                console.error('OTP sending error:', error);
                setMessage({ text: 'Something went wrong. Please try again later.', type: 'error' });
            } finally {
                setIsLoading(false); // End loading
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const validationErrors = validateOtpForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true); // Start loading
            setMessage({ text: 'Verifying OTP...', type: '' }); // Inform user
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/verify-and-register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...form, otp: otp }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage({ text: data.message || 'OTP verification failed!', type: 'error' });
                } else {
                    setMessage({ text: 'Account has been successfully verified! Redirecting to login...', type: 'success' });
                    setForm({ name: '', email: '', password: '' });
                    setOtp('');
                    setErrors({});
                    // No setStep('register') here, as we are redirecting
                    setTimeout(() => {
                        navigate('/login'); // Redirect to login after a short delay
                    }, 2000); // 2 second delay to show success message
                }
            } catch (error) {
                console.error('OTP verification error:', error);
                setMessage({ text: 'Something went wrong during verification. Please try again later.', type: 'error' });
            } finally {
                setIsLoading(false); // End loading
            }
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true); // Start loading for resend
        setMessage({ text: 'Resending OTP...', type: '' });
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailForVerification }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage({ text: data.message || 'Failed to resend OTP!', type: 'error' });
            } else {
                setMessage({ text: 'New OTP sent to your email.', type: 'success' });
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            setMessage({ text: 'Something went wrong. Please try again later.', type: 'error' });
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
    <Header />
    <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 shadow-2xl border border-blue-100 dark:border-gray-700 rounded-lg">
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center tracking-tight">
                {step === 'register' ? 'Create Account' : 'Verify Your Email'}
            </h2>

            {step === 'register' && (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={50}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                            placeholder="Enter your name"
                            disabled={isLoading}
                        />
                        {errors.name && <span className="text-xs text-red-500 dark:text-red-400">{errors.name}</span>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                            placeholder="Enter your email"
                            disabled={isLoading}
                        />
                        {errors.email && <span className="text-xs text-red-500 dark:text-red-400">{errors.email}</span>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                            placeholder="Create a password"
                            disabled={isLoading}
                        />
                        {errors.password && <span className="text-xs text-red-500 dark:text-red-400">{errors.password}</span>}
                    </div>

                    {message.text && (
                        <div
                            className={`mb-4 text-sm font-medium text-center px-4 py-2 rounded-md ${message.type === 'success' 
                                ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700' 
                                : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 px-4 font-semibold shadow-lg transition duration-300 text-lg rounded-md
                            ${isLoading
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Register'}
                    </button>
                </form>
            )}

            {step === 'verify' && (
                <form onSubmit={handleVerifyOtp} autoComplete="off">
                    <p className="mb-4 text-gray-600 dark:text-gray-300 text-center">
                        An OTP has been sent to <span className="font-semibold">{emailForVerification}</span>.
                        Please enter it below to verify your email.
                    </p>
                    <div className="mb-6">
                        <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errors.otp ? 'border-red-500 dark:border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            disabled={isLoading}
                        />
                        {errors.otp && <span className="text-xs text-red-500 dark:text-red-400">{errors.otp}</span>}
                    </div>

                    {message.text && (
                        <div
                            className={`mb-4 text-sm font-medium text-center px-4 py-2 rounded-md ${message.type === 'success' 
                                ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700' 
                                : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-md font-semibold shadow-lg transition duration-300 text-lg
                            ${isLoading
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        className={`mt-4 w-full py-2 px-4 rounded-md font-semibold transition duration-300 text-sm
                            ${isLoading
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                </form>
            )}

            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
                Already have an account?{' '}
                <Link to="/login">
                    <span className="text-blue-500 dark:text-blue-400 hover:underline font-semibold cursor-pointer">
                        Login
                    </span>
                </Link>
            </p>
        </div>
    </div>
</div>
    );
}