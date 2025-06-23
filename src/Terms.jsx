import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Terms() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "1. Definitions",
            content: [
                "Platform – Refers to Cuisineberg, its website (https://cuisineberg.com), mobile web, or any software services provided.",
                "Vendor / Restaurant – Any business listing its digital menu or accepting orders using Cuisineberg’s platform.",
                "Customer / Client – End-users browsing or ordering via Cuisineberg.",
                "Agent / Partner – A person or entity that brings new restaurants or clients to Cuisineberg.",
                "Subscription Plan – The active plan chosen by a vendor for platform access.",
                "Commission – Revenue share received by agents upon successful referrals."
            ]
        },
        {
            title: "2. Terms for Restaurants / Vendors",
            content: [
                "Eligibility: Vendors must have valid local licenses and must not engage in illegal food service activities.",
                "Subscription & Payment Terms: Vendors pay a monthly subscription fee (e.g., ₹499 or more) to access the Cuisineberg system. Subscription is non-refundable, except under special promotional policies. Restaurants are not allowed to share logins or misuse the platform for non-restaurant purposes.",
                "Platform Usage Restrictions: Vendors must not divert customers away from Cuisineberg after showing their menu online. Misleading content, false prices, or unavailable items are prohibited.",
                "QR Codes & Promotions: QR codes must not be replicated, modified, or redirected outside of Cuisineberg links.",
                "Refund / Cancellation: Cancellation does not entitle a vendor to refund unless explicitly stated."
            ]
        },
        {
            title: "3. Terms for Agents / Partners",
            content: [
                "Referral Commissions: Agents earn 30% of the subscription amount per referral. Example: ₹999 subscription = ₹299 commission.",
                "Commission Duration: Valid for 6 months per referred restaurant unless re-sold again.",
                "Data Freeze: Once a referral is verified, its agent link is permanently frozen. No agent switch without valid proof.",
                "Fraud, Misuse & Penalty: Fake referrals, duplicates, or impersonation will result in blacklisting and commission cancellation."
            ]
        },
        {
            title: "4. Terms for Clients / End-Users",
            content: [
                "General Use: Clients can browse menus, place orders (if enabled), and view listings.",
                "Disclaimer: Cuisineberg is not responsible for food quality or delivery — restaurants hold that responsibility.",
                "Data Storage: User data is stored to improve experience. No personal data is sold to advertisers."
            ]
        },
        {
            title: "5. Platform Usage & Technical Access",
            content: [
                "System Availability: 99.9% uptime target, but occasional maintenance may occur.",
                "Feature Access: Premium features like video menus or festival themes are part of ELITE plans only."
            ]
        },
        {
            title: "6. Intellectual Property & Licensing",
            content: [
                "All designs, logos, and technology are owned by Cuisineberg.",
                "No system content or code may be reused without written permission."
            ]
        },
        {
            title: "7. Data & Privacy",
            content: [
                "Data is encrypted and stored securely.",
                "Used only for performance improvement and platform support."
            ]
        },
        {
            title: "8. Payment, Tax & Compliance",
            content: [
                "Vendors are responsible for taxes such as GST on subscription.",
                "Agents must declare income in compliance with Indian tax law."
            ]
        },
        {
            title: "9. Termination & Suspension",
            content: [
                "Cuisineberg may suspend accounts that violate Terms.",
                "Permanent bans apply in cases of fraud or abuse."
            ]
        },
        {
            title: "10. Governing Law",
            content: [
                "These Terms are governed under Indian law.",
                "Disputes are subject to jurisdiction of Mangalore or Bengaluru."
            ]
        },
        {
            title: "11. Contact Us",
            content: [
                "Cuisineberg Pvt Ltd",
                "Email: support@cuisineberg.com",
                "Phone: +91-XXXXXXXXXX",
                "Website: https://cuisineberg.com"
            ]
        }
    ];

    return (
        <>
            <Header />

            <div className="bg-white dark:bg-gray-900 text-blue-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
                <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-400 mb-6 text-center">
                        Cuisineberg – Terms & Conditions
                    </h1>
                    <p className="text-lg text-blue-700 dark:text-blue-300 mb-8 text-center">
                        Last Updated: June 7, 2025
                    </p>
                    <p className="text-base text-blue-700 dark:text-gray-300 mb-10 leading-relaxed">
                        By accessing, subscribing to, or using Cuisineberg (“Platform”), you agree to be bound by these Terms & Conditions (“Terms”). These Terms govern the relationship between Cuisineberg and Restaurants/Vendors, Clients/Customers, Agents/Partners, and Visitors/Users.
                    </p>

                    {sections.map((section, i) => (
                        <section key={i} className="mb-10">
                            <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
                                {section.title}
                            </h2>
                            {section.content.map((line, j) => (
                                <p key={j} className="leading-relaxed text-blue-800 dark:text-gray-300 mb-3">
                                    {line}
                                </p>
                            ))}
                        </section>
                    ))}

                    <p className="text-center text-blue-700 dark:text-blue-400 text-sm mt-12">
                        &copy; {new Date().getFullYear()} Cuisineberg. All rights reserved.
                    </p>
                </div>
            </div>

            <Footer />
        </>

    );
}
