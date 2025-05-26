import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="bg-[#fffaf0] min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white shadow fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <img src="/cuisine.png" className='w-16 h-16' alt="Logo" />
          <h1 className="text-3xl font-bold text-red-600 tracking-wide">Cuisineberg</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-red-100 to-[#fffaf0] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Order food right from your phone
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Dine-in, Pickup, and Delivery - all in one platform designed for convenience.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/order">
              <button className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-red-700 transition">
                Start Ordering
              </button>
            </Link>
            <Link to="/retail/register">
              <button className="bg-white border border-red-600 text-red-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-50 transition">
                Register Restaurant
              </button>
            </Link>
          </div>
          <Link to="/howitworks" className="mt-8 inline-block text-red-600 hover:text-red-700">
            <p className="text-lg font-semibold">Learn how it works</p>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-[#fffaf0]">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-10">At Cuisineberg we offer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-red-100">
              <h4 className="text-lg font-semibold mb-2 text-red-600">Dine-In Convenience</h4>
              <p className="text-gray-700 text-sm">Book a table or view a dine-in menu before arriving.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-red-100">
              <h4 className="text-lg font-semibold mb-2 text-red-600">Pickup Made Easy</h4>
              <p className="text-gray-700 text-sm">Order ahead and collect it at your convenience.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition border border-red-100">
              <h4 className="text-lg font-semibold mb-2 text-red-600">Delivery (Optional)</h4>
              <p className="text-gray-700 text-sm">If restaurants support it, get meals at your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-2xl font-semibold mb-4 text-red-500">Cuisineberg</p>
          <p className="text-sm mb-6">&copy; 2025 Cuisineberg. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/contact" className="hover:text-red-400">Contact</Link>
            <Link to="/login" className="hover:text-red-400">Sign In</Link>
          </div>
          <p className="mt-6 text-sm">
            Follow us on{' '}
            <span className="cursor-pointer hover:text-red-400">Facebook</span>,{' '}
            <span className="cursor-pointer hover:text-red-400">Twitter</span>, and{' '}
            <span className="cursor-pointer hover:text-red-400">Instagram</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
