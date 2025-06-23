import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Privacy() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const infoCollection = [
        {
            title: "Personal Information",
            items: [
                "Name",
                "Phone number",
                "Email address",
                "Business name (for restaurants)",
                "GSTIN / FSSAI number (where applicable)",
                "Location (city, pin code)",
            ],
        },
        {
            title: "Transactional Information",
            items: [
                "Payment details (via Razorpay/Stripe, we do not store full card data)",
                "Subscription history",
                "Order logs (for restaurants and clients)",
            ],
        },
        {
            title: "Technical & Device Information",
            items: [
                "IP address",
                "Device type, OS, browser version",
                "Usage logs",
                "Cookies and session tracking",
            ],
        },
        {
            title: "Communication Data",
            items: [
                "WhatsApp/chat messages",
                "Emails",
                "Call history (for support)",
            ],
        },
    ];

    const usagePurposes = [
        "Create and manage your user or vendor account",
        "Send order notifications and alerts via WhatsApp/SMS/email",
        "Show digital menus, prices, and real-time updates",
        "Provide customer support",
        "Process subscriptions and payments",
        "Analyze behavior to improve the platform",
        "Prevent fraud, abuse, or unauthorized access",
    ];

    const dataSharing = [
        "With third-party vendors like Razorpay (for payments), Google/Facebook (for analytics)",
        "With government authorities if legally required",
        "With your consent, for integrations (e.g., WhatsApp order notifications)",
    ];

    const securityMeasures = [
        "SSL encryption (HTTPS)",
        "Cloud-based firewalls",
        "Data backups and encrypted storage",
        "Access control and IP logging",
    ];

    const cookieUsage = [
        "Session management",
        "Saving preferences",
        "Tracking engagement (analytics)",
        "Marketing personalization",
    ];

    const userRights = [
        "Access your data",
        "Correct inaccurate information",
        "Delete your account and data",
        "Opt-out of marketing emails/SMS",
    ];

    const dataRetention = [
        "Account data until deactivation or 12 months post-expiry",
        "Transactional data as required by law (typically 7 years)",
        "Chat/support data for 6 months for training and safety",
    ];

    const compliance = [
        "Indian IT Act, 2000 (and its rules)",
        "Draft Indian Data Protection Bill (anticipated)",
        "GDPR-like principles (for fairness, transparency, security)",
    ];

    return (
        <>
            <Header />
            <div className="bg-white dark:bg-gray-900 text-blue-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
                <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
                    <h1 className="text-4xl font-bold text-center text-blue-800 dark:text-blue-400 mb-6">
                        Cuisineberg – Privacy Policy
                    </h1>
                    <p className="text-center mb-8 text-blue-700 dark:text-blue-300">
                        Effective Date: June 7, 2025
                    </p>

                    {/* Intro */}
                    <section className="mb-10">
                        <p className="leading-relaxed mb-4 text-blue-800 dark:text-gray-300">
                            This Privacy Policy describes how Cuisineberg (“we”, “our”, or “us”) collects,
                            uses, stores, and protects your personal data when you access or use our website,
                            applications, and services.
                        </p>
                        <p className="leading-relaxed text-blue-800 dark:text-gray-300">
                            By using the Cuisineberg platform, you consent to the practices described in this
                            Privacy Policy.
                        </p>
                    </section>

                    {/* Sections */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">1. Information We Collect</h2>
                        {infoCollection.map(({ title, items }) => (
                            <div key={title} className="mb-6">
                                <h3 className="text-xl font-medium text-blue-800 dark:text-blue-400 mb-2">{title}</h3>
                                <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="mb-2">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300">
                            {usagePurposes.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">3. Data Sharing & Disclosure</h2>
                        <p className="mb-4 text-blue-800 dark:text-gray-300">We do not sell your data to third parties. We may share data:</p>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300">
                            {dataSharing.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">4. Data Security</h2>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300 mb-4">
                            {securityMeasures.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                        <p className="text-blue-800 dark:text-gray-300">
                            However, no system is 100% secure. Please maintain strong passwords and good security practices.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">5. Cookies & Tracking</h2>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300 mb-4">
                            {cookieUsage.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                        <p className="text-blue-800 dark:text-gray-300">You can manage cookies in your browser settings.</p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">6. Your Rights & Choices</h2>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300 mb-4">
                            {userRights.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                        <p className="text-blue-800 dark:text-gray-300">
                            To exercise your rights, email us at:{" "}
                            <a href="mailto:cuisineberg@gmail.com" className="text-blue-600 dark:text-blue-400 underline">
                                cuisineberg@gmail.com
                            </a>
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">7. Children’s Privacy</h2>
                        <p className="text-blue-800 dark:text-gray-300">
                            Cuisineberg is not intended for users under 18. We do not knowingly collect data from minors.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">8. Data Retention</h2>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300">
                            {dataRetention.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">9. International Users</h2>
                        <p className="text-blue-800 dark:text-gray-300">
                            Our platform primarily serves India. If accessed internationally, data may be stored in India or associated cloud regions.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">10. Legal Compliance</h2>
                        <ul className="list-disc pl-6 text-blue-800 dark:text-gray-300">
                            {compliance.map((item, idx) => (
                                <li key={idx} className="mb-2">{item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">11. Contact Us</h2>
                        <p className="leading-relaxed text-blue-800 dark:text-gray-300">
                            Cuisineberg Pvt Ltd<br />
                            Email:{" "}
                            <a href="mailto:cuisineberg@gmail.com" className="text-blue-600 dark:text-blue-400 underline">
                                cuisineberg@gmail.com
                            </a>
                            <br />
                            Website:{" "}
                            <a href="https://cuisineberg.com" className="text-blue-600 dark:text-blue-400 underline">
                                https://cuisineberg.com
                            </a>
                        </p>
                    </section>

                    <p className="text-center text-blue-700 dark:text-blue-400 text-sm mt-12">
                        &copy; {new Date().getFullYear()} Cuisineberg. All rights reserved.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
