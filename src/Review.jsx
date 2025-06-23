import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function ReviewForm({ publicCode }) {
    const [rating, setRating] = useState(0);
    const [reviewerName, setReviewerName] = useState('');
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !reviewerName) {
            setMessage('Please provide your name and a rating.');
            return;
        }

        setStatus('submitting');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurant/addreview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicCode, rating, comment, reviewerName }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Review submitted successfully!');
                setRating(0);
                setComment('');
                setReviewerName('');
            } else {
                setMessage(data.error || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Failed to submit review.');
        } finally {
            setStatus('idle');
            setTimeout(() => setMessage(''), 4000);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-blue-200 dark:border-blue-700 transition-all duration-300">
                    <h2 className="text-3xl font-extrabold mb-6 text-blue-700 dark:text-blue-300 text-center tracking-tight">
                        Leave a Review
                    </h2>

                    {message && (
                        <div className="mb-5 text-sm text-center px-4 py-3 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 shadow">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full rounded-lg border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                Rating
                            </label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-bold shadow-sm transition
                                            ${rating >= star
                                                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-700 scale-110'
                                                : 'bg-blue-100 text-blue-500 dark:bg-gray-700 dark:text-blue-200 border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800'
                                            }`}
                                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                    >
                                        <span>{rating >= star ? '★' : '☆'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                Comment <span className="text-xs text-blue-400">(optional)</span>
                            </label>
                            <textarea
                                rows="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full rounded-lg border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 disabled:opacity-60"
                        >
                            {status === 'submitting' ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
