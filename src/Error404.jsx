import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown, ArrowLeftCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-inter transition-colors duration-300">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-700 max-w-md w-full transition-colors duration-300">
                    <Frown 
                        className="w-24 h-24 mx-auto text-blue-500 dark:text-blue-400 mb-6" 
                        strokeWidth={1.5} 
                    />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4">
                        404
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        Oops! It looks like the page you're looking for doesn't exist.
                        It might have been moved or deleted.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
                    >
                        <ArrowLeftCircle className="w-5 h-5 mr-2" /> 
                        Go to Homepage
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}