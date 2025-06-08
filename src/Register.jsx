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
            setIsLoading(true); // Start loading
            setMessage({ text: 'Sending OTP...', type: '' }); // Inform user
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 shadow-2xl border border-blue-100 ">
                    <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center tracking-tight">
                        {step === 'register' ? 'Create Account' : 'Verify Your Email'}
                    </h2>

                    {step === 'register' && (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Enter your name"
                                    disabled={isLoading} // Disable input when loading
                                />
                                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Enter your email"
                                    disabled={isLoading} // Disable input when loading
                                />
                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Create a password"
                                    disabled={isLoading} // Disable input when loading
                                />
                                {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                            </div>

                            {message.text && (
                                <div
                                    className={`mb-4 text-sm font-medium text-center px-4 py-2 rounded-md ${message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-300' : 'text-red-700 bg-red-100 border border-red-300'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`w-full py-3 px-4 rounded-md font-semibold shadow-lg transition duration-300 text-lg
                                    ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                                    }`}
                                disabled={isLoading} // Disable button when loading
                            >
                                {isLoading ? 'Processing...' : 'Register'}
                            </button>
                        </form>
                    )}

                    {step === 'verify' && (
                        <form onSubmit={handleVerifyOtp} autoComplete="off">
                            <p className="mb-4 text-gray-600 text-center">
                                An OTP has been sent to <span className="font-semibold">{emailForVerification}</span>.
                                Please enter it below to verify your email.
                            </p>
                            <div className="mb-6">
                                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-1">
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.otp ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength="6"
                                    disabled={isLoading} // Disable input when loading
                                />
                                {errors.otp && <span className="text-xs text-red-500">{errors.otp}</span>}
                            </div>

                            {message.text && (
                                <div
                                    className={`mb-4 text-sm font-medium text-center px-4 py-2 rounded-md ${message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-300' : 'text-red-700 bg-red-100 border border-red-300'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`w-full py-3 px-4 rounded-md font-semibold shadow-lg transition duration-300 text-lg
                                    ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white'
                                    }`}
                                disabled={isLoading} // Disable button when loading
                            >
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className={`mt-4 w-full py-2 px-4 rounded-md font-semibold transition duration-300 text-sm
                                    ${isLoading
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                disabled={isLoading} // Disable resend button when loading
                            >
                                {isLoading ? 'Sending...' : 'Resend OTP'}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-sm text-gray-600 text-center">
                        Already have an account?{' '}
                        <Link to="/login">
                            <span className="text-blue-500 hover:underline font-semibold cursor-pointer">
                                Login
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}