import React from 'react';
import { Link } from 'react-router-dom';

export default function Works() {
  return (
    <div className="bg-[#fffaf0] min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white shadow fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <img src="/cuisine.png" className="w-16 h-16" alt="Logo" />
          <h1 className="text-3xl font-bold text-red-600 tracking-wide">Cuisineberg</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">How Cuisineberg Works</h2>
          <p className="text-lg text-gray-700 mb-12">
            We’re not Swiggy or Zomato. We do things differently – simple, direct, and built for better experiences.
          </p>

          <div className="space-y-12 text-left">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow border border-red-100">
              <h3 className="text-2xl font-semibold text-red-600 mb-2">1. Dine-In First Approach</h3>
              <p className="text-gray-700 text-base">
                Our platform is mainly designed for dine-in customers. Browse a restaurant’s live menu on your phone, share items with your group, and place the order from your table – no more flipping through big menu books.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow border border-red-100">
              <h3 className="text-2xl font-semibold text-red-600 mb-2">2. Group Sharing & ETA</h3>
              <p className="text-gray-700 text-base">
                Share the menu with your group, select dishes together, and place one group order. Get real-time updates on when your food will be ready (ETA) – making dining smoother and faster.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow border border-red-100">
              <h3 className="text-2xl font-semibold text-red-600 mb-2">3. Restaurant-Handled Delivery</h3>
              <p className="text-gray-700 text-base">
                Unlike other platforms, we don’t have a fleet of delivery workers. If a restaurant chooses to offer delivery, their own staff will handle it. We just make the process easy for both sides.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl shadow border border-red-100">
              <h3 className="text-2xl font-semibold text-red-600 mb-2">4. Faster Orders. Direct Payments.</h3>
              <p className="text-gray-700 text-base">
                All payments go straight to the restaurant. That means no third-party cuts, no middlemen – just faster service, happier customers, and better business for local restaurants.
              </p>
            </div>

            {/* Step 5 for Restaurants */}
            <div className="bg-white p-6 rounded-xl shadow border border-red-100">
              <h3 className="text-2xl font-semibold text-red-600 mb-2">5. Restaurant Owners – Join the Future</h3>
              <p className="text-gray-700 text-base">
                Register your restaurant on Cuisineberg in minutes. Let customers find you, dine-in easily, or even request delivery from your own team.
              </p>
              <Link to="/retail/register" className="inline-block mt-3 text-red-600 hover:text-red-700 font-medium">
                Register Now →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4 text-center mt-auto">
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
