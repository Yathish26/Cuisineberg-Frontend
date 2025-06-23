import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { X } from 'lucide-react';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          message: '',
        });
        setLoadingProfile(false);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [navigate]);

  const handleChange = (e) => {
    // Only the message field is editable
    setFormData((prev) => ({
      ...prev,
      message: e.target.value.slice(0, 1000), // Enforce max 1000 chars
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      // Only send name, email, and message
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData((prev) => ({ ...prev, message: '' }));
      } else {
        const data = await res.json();
        if (
          data.message &&
          data.message.toLowerCase().includes('one feedback per day')
        ) {
          setErrorMsg('You have already submitted feedback for today. Try again tomorrow.');
        } else {
          setErrorMsg('Something went wrong. Please try again.');
        }
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white py-8 px-4">
        <div className="max-w-xl mx-auto w-full rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2 text-center">
            Feedback Form
          </h2>
          <p className="mb-8 text-md text-blue-700 dark:text-blue-300 text-center">
            Found a bug or need support? Let us know!
          </p>
          {loadingProfile ? (
            <div className="flex items-center justify-center py-10">
              <svg className="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Only show the message field */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  maxLength={1000}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="peer w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent py-3 px-2 text-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition resize-none"
                  placeholder=" " // keep this single space!
                  autoComplete="off"
                />
                <label
                  className="
      absolute left-2 top-3 text-gray-500 dark:text-gray-400 text-md transition-all
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-md
      peer-focus:-top-5 peer-focus:text-sm peer-focus:text-blue-600 dark:peer-focus:text-blue-400 pointer-events-none
      peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-blue-600 dark:peer-[&:not(:placeholder-shown)]:text-blue-400
    "
                >
                  Message (max 1000 characters)
                </label>
                <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {formData.message.length}/1000
                </span>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' && (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
              </button>
              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/40 rounded-md px-3 py-2 mt-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thank you for your feedback!</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/40 rounded-md px-3 py-2 mt-2">
                  <X className="h-5 w-5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
