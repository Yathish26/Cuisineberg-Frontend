export default function Method() {
    return (
        <>
            {/* PC Screen */}
            {orderMode && (
                <div className="bg-[#f5e9e0] mt-3 border border-orange-200 p-3 sm:p-4 rounded-xl transition-all duration-300 transform translate-y-0 max-w-full sm:max-w-md xl:max-w-lg mx-auto">
                    <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">Choose your order method</h3>
                    <ul className="flex justify-center gap-4">
                        <li>
                            <button
                                className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                onClick={() => setOrderMode('dineIn')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/hotel-bell-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                    <path d="M2 20.5H22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M4 14.5C4 10.0817 7.58172 6.5 12 6.5C16.4183 6.5 20 10.0817 20 14.5C20.8656 14.5 21.6043 15.1258 21.7466 15.9796L22 17H2L2.2534 15.9796C2.3957 15.1258 3.13442 14.5 4 14.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M12 6.5V3.5M12 3.5H9.5M12 3.5H14.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M19 5.5L18.5 6.5M21.5 8L20.5009 8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M5 5.5L5.5 6.5M3.49913 8.5L2.5 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                                <p>Dine In</p>
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                onClick={() => setOrderMode('pickup')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/shopping-bag-03-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                    <path d="M7.5 9.5L7.71501 5.98983C7.87559 3.74176 9.7462 2 12 2C14.2538 2 16.1244 3.74176 16.285 5.98983L16.5 9.5" stroke="#ffffff" stroke-width="1.5"></path>
                                    <path d="M20.0318 7H4.00672L2.00105 21.8775C1.99233 21.9421 2.03916 22 2.10015 22H21.8998C21.9607 22 22.0075 21.9423 21.999 21.8778L20.0318 7Z" stroke="#ffffff" stroke-width="1.5"></path>
                                </svg>
                                <p>Pickup</p>
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                                onClick={() => setOrderMode('delivery')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/delivery-truck-01-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                    <path d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                    <path d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                    <path d="M14.5 17.5H9.5M19.5 17.5H22V13C22 9.41015 19 6.5 15 6.5M2 4H14C14.5523 4 15 4.44772 15 5V16M4.5 17.4885L3.00461 17.4954C2.45053 17.4979 2 17.0495 2 16.4954V13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M2 7H8M2 10H6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                                <p>Delivery</p>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {/* Mobile Screen */}
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${orderMode ? 'max-h-80 opacity-100 mt-3' : 'max-h-0 opacity-0'
                    } bg-[#f5e9e0] z-50 p-3 sm:p-4 rounded-t-2xl max-w-full sm:max-w-md xl:max-w-lg mx-auto lg:hidden`}
            >
                {orderMode && (
                    <h3 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">
                        How would you like to receive your order?
                    </h3>
                )}
                <ul className="flex justify-center gap-4">
                    <li>
                        <button
                            className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                            onClick={() => setOrderMode('dineIn')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/hotel-bell-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                <path d="M2 20.5H22" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M4 14.5C4 10.0817 7.58172 6.5 12 6.5C16.4183 6.5 20 10.0817 20 14.5C20.8656 14.5 21.6043 15.1258 21.7466 15.9796L22 17H2L2.2534 15.9796C2.3957 15.1258 3.13442 14.5 4 14.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M12 6.5V3.5M12 3.5H9.5M12 3.5H14.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M19 5.5L18.5 6.5M21.5 8L20.5009 8.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M5 5.5L5.5 6.5M3.49913 8.5L2.5 8" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Dine In</p>
                        </button>
                    </li>
                    <li>
                        <button
                            className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                            onClick={() => setOrderMode('pickup')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/shopping-bag-03-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                <path d="M7.5 9.5L7.71501 5.98983C7.87559 3.74176 9.7462 2 12 2C14.2538 2 16.1244 3.74176 16.285 5.98983L16.5 9.5" stroke="#ffffff" stroke-width="1.5"></path>
                                <path d="M20.0318 7H4.00672L2.00105 21.8775C1.99233 21.9421 2.03916 22 2.10015 22H21.8998C21.9607 22 22.0075 21.9423 21.999 21.8778L20.0318 7Z" stroke="#ffffff" stroke-width="1.5"></path>
                            </svg>
                            <p>Pickup</p>
                        </button>
                    </li>
                    <li>
                        <button
                            className="w-full flex flex-col items-center bg-orange-500 text-white p-2 rounded-lg text-sm sm:text-base font-semibold shadow-sm transition"
                            onClick={() => setOrderMode('delivery')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/delivery-truck-01-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
                                <path d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                <path d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z" stroke="#ffffff" stroke-width="1.5"></path>
                                <path d="M14.5 17.5H9.5M19.5 17.5H22V13C22 9.41015 19 6.5 15 6.5M2 4H14C14.5523 4 15 4.44772 15 5V16M4.5 17.4885L3.00461 17.4954C2.45053 17.4979 2 17.0495 2 16.4954V13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M2 7H8M2 10H6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <p>Delivery</p>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}
