import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const PAGE_SIZE = 10;

export default function AdminFeedback() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch feedbacks for the current page
    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/feedback?page=${page}&limit=${PAGE_SIZE}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch feedback');
                }
                const data = await response.json();
                setFeedbackList(data.feedbacks);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [page]);

    // Filter only the currently loaded page
    const filteredFeedback = feedbackList.filter(
        (feedback) =>
            feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedback.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/cuisineberg/admin/feedback/${feedbackId}`,
                    { method: 'DELETE' }
                );
                if (!response.ok) {
                    throw new Error('Failed to delete feedback');
                }
                // Remove from local state
                setFeedbackList((prev) => prev.filter((feedback) => feedback._id !== feedbackId));
                setTotal((prev) => prev - 1);
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete feedback');
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 max-w-6xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Feedback</h1>

            {/* Search and filter section */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Feedback count and pagination info */}
            <div className="mb-4 text-sm text-gray-600 flex justify-between items-center">
                <span>
                    Showing {filteredFeedback.length} of {total} feedback entries (Page {page} of {totalPages})
                </span>
                {/* Pagination controls */}
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePageChange(idx + 1)}
                            className={`px-3 py-1 rounded ${
                                page === idx + 1
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Feedback list */}
            <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((feedback) => (
                        <div key={feedback._id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">{feedback.name}</h3>
                                    <p className="text-gray-600 mt-1">{feedback.message}</p>
                                </div>
                                <div className="sm:text-right">
                                    <div className="text-sm text-gray-500">
                                        {new Date(feedback.createdAt || '').toLocaleString()}
                                    </div>
                                    <a
                                        href={`mailto:${feedback.email}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm block mt-1"
                                    >
                                        {feedback.email}
                                    </a>
                                    {/* Remove mobile number if not needed */}
                                    <button
                                        onClick={() => handleDelete(feedback._id)}
                                        className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try a different search term' : 'No feedback has been submitted yet'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
