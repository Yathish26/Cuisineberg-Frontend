import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Homepage() {
  return (
    <div className="bg-[#fffaf0] min-h-screen flex flex-col justify-between">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 bg-gradient-to-br from-blue-100 to-[#fffaf0] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Order food right from your phone
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            Dine-in, Made it Easier
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/order">
              <button className="bg-blue-600 text-white px-6 py-3 text-lg font-semibold shadow hover:bg-blue-700 transition">
                Start Ordering
              </button>
            </Link>
            <Link to="/retail/register">
              <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 text-lg font-semibold hover:bg-blue-50 transition">
                Register Restaurant
              </button>
            </Link>
          </div>
          <Link to="/howitworks" className="mt-8 inline-block text-blue-600 hover:text-blue-700">
            <p className="text-lg font-semibold">Learn how it works</p>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-100 to-[#fffaf0] ">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-10">At Cuisineberg we offer</h3>
            <div className="bg-white p-6 shadow hover:shadow-md transition border border-blue-100">
              <h4 className="text-lg font-semibold mb-2 text-blue-600">Dine-In Convenience</h4>
              <p className="text-gray-700 text-sm">Book a table or view a dine-in menu before arriving.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
