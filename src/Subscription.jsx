import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { load } from '@cashfreepayments/cashfree-js';

const plans = [
    {
        name: 'Starter',
        price: 499,
        displayPrice: '₹499/month',
        planId: 'starter_plan',
        popular: false,
    },
    {
        name: 'Professional',
        price: 999,
        displayPrice: '₹999/month',
        planId: 'pro_plan',
        popular: true,
    },
    {
        name: 'Business',
        price: 1999,
        displayPrice: '₹1,999/month',
        planId: 'business_plan',
        popular: false,
    },
    {
        name: 'Enterprise',
        price: 0,
        displayPrice: 'Contact Us',
        planId: 'enterprise_plan',
        popular: false,
    },
];

export default function Subscription() {
    const handlePayment = async (amount, customerId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/cashfree/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, customerId }),
            });

            const data = await response.json();

            if (!data.orderToken) {
                alert('Payment session creation failed.');
                return;
            }

            // Step 2: Load Cashfree SDK
            const cashfree = await load({ mode: 'sandbox' }); // Use 'production' when going live

            // Step 3: Open the hosted checkout
            await cashfree.checkout({
                paymentSessionId: data.orderToken,
                redirectTarget: '_self', // Or '_blank' to open in new tab
            });

        } catch (err) {
            console.error('Payment Error:', err);
            alert('Something went wrong during payment. Please try again.');
        }
    };


    return (
        <>
            <Header />
            <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
                        Choose Your Subscription Plan
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`flex flex-col justify-between rounded-2xl border-2 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${plan.popular
                                        ? 'border-blue-500 shadow-xl bg-white dark:bg-gray-800'
                                        : 'border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800'
                                    }`}
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{plan.name}</h3>
                                    <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">
                                        {plan.displayPrice}
                                    </p>
                                    <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                                        <li className="flex items-start">
                                            <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                                            Basic features of {plan.name}
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-green-600 dark:text-green-400 mr-2 mt-1">✓</span>
                                            Plan ID: {plan.planId}
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handlePayment(plan.price, "test_customer_123")}
                                    className={`mt-8 w-full py-2 px-4 rounded-lg font-semibold text-center transition duration-300 ${plan.popular
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {plan.price === 0 ? 'Contact Us' : 'Choose Plan'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
