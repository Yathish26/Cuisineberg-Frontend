import React, { useState, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function DineIn() {
    const [scanResult, setScanResult] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = (result) => {
        if (result) {
            setScanResult(result);
            setCameraActive(false);
        }
    };

    const handleError = (err) => {
        console.error(err);
        setError('Failed to access camera. Please check permissions or try manual entry.');
        setCameraActive(false);
    };

    const toggleCamera = () => {
        setCameraActive(!cameraActive);
        setError(null);
        if (!cameraActive) {
            setScanResult('');
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            setScanResult(manualCode);
            alert(`Restaurant code submitted: ${manualCode}`);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2">
                        Dine-In Ordering
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        Scan the QR code or enter the restaurant code to start ordering
                    </p>

                    {scanResult ? (
                        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                            <p className="text-green-800 dark:text-green-200 font-medium">
                                Scanned successfully!
                            </p>
                            <p className="text-sm mt-1 break-all">{scanResult}</p>
                            <button
                                onClick={() => setScanResult('')}
                                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Scan again
                            </button>
                        </div>
                    ) : (
                        <>
                            {cameraActive ? (
                                <div className="mb-6 relative rounded-lg overflow-hidden border-2 border-blue-500">
                                    <Scanner
                                        onDecode={handleScan}
                                        onError={handleError}
                                        constraints={{
                                            facingMode: 'environment',
                                        }}
                                        containerStyle={{
                                            width: '100%',
                                            height: '300px',
                                        }}
                                        videoStyle={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div className="absolute inset-0 border-4 border-blue-400 rounded-lg pointer-events-none"></div>
                                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
                                        <div className="border-2 border-white rounded-lg w-64 h-64"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
                                    <div className="text-center">
                                        <svg
                                            className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                            />
                                        </svg>
                                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                                            QR code scanner inactive
                                        </p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 rounded-lg text-red-800 dark:text-red-200">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={toggleCamera}
                                className={`w-full py-3 px-4 mb-6 rounded-lg font-medium flex items-center justify-center ${cameraActive
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    } transition-colors`}
                            >
                                {cameraActive ? (
                                    <>
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Stop Camera
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Scan QR Code
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <form onSubmit={handleManualSubmit}>
                        <div className="mb-4">
                            <label htmlFor="restaurantCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Enter Restaurant Code
                            </label>
                            <input
                                id="restaurantCode"
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="e.g. REST1234"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Submit Code
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}