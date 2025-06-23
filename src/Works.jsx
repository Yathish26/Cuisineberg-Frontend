import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Works() {
  return (
    <div className="bg-[#d2dcfa] dark:bg-gray-900 min-h-screen flex flex-col justify-between transition-colors duration-300">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How Cuisineberg Works
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
            We’re not Swiggy or Zomato. We do things differently – simple, direct, and built for better experiences.
          </p>

          <div className="space-y-10 sm:space-y-12 text-left">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-blue-100 dark:border-blue-800  transition">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                1. Dine-In First Approach
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Our platform is mainly designed for dine-in customers. Browse a restaurant’s live menu on your phone, share items with your group, and place the order from your table – no more flipping through big menu books.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-blue-100 dark:border-blue-800  transition">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                2. Group Sharing & ETA
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Share the menu with your group, select dishes together, and place one group order. Get real-time updates on when your food will be ready (ETA) – making dining smoother and faster.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-blue-100 dark:border-blue-800  transition">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                3. Restaurant-Handled Delivery
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Unlike other platforms, we don’t have a fleet of delivery workers. If a restaurant chooses to offer delivery, their own staff will handle it. We just make the process easy for both sides.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-blue-100 dark:border-blue-800  transition">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                4. Faster Orders. Direct Payments.
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                All payments go straight to the restaurant. That means no third-party cuts, no middlemen – just faster service, happier customers, and better business for local restaurants.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border border-blue-100 dark:border-blue-800  transition">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                5. Restaurant Owners – Join the Future
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base">
                Register your restaurant on Cuisineberg in minutes. Let customers find you, dine-in easily, or even request delivery from your own team.
              </p>
              <Link
                to="/retail/register"
                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
              >
                Register Now →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
