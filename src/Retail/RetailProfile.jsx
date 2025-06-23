import React, { useEffect, useState, useRef } from 'react';
import { Globe, Banknote, MapPin, Clock, Instagram, Facebook, Globe2, CreditCard, User, Edit, Share2, Linkedin, Twitter, Star, Briefcase, MessageSquare, DollarSign, Camera } from 'lucide-react'; // Added icons for new sections
import Footer from '../Footer';
import Loading from '../Components/Loading';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import RetailHeader from './RetailHeader';

// Mock Header component, now accepting a coverImageUrl prop
const Cover = ({ coverImageUrl }) => (
    <div
        className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 flex justify-between items-center relative z-0 h-48 md:h-64" // Responsive height
        style={{ backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
        <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
);

export default function RetailProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    // Refs for each section
    const overviewRef = useRef(null);
    const aboutRef = useRef(null);
    const jobsRef = useRef(null);
    const reviewsRef = useRef(null);
    const salariesRef = useRef(null);
    const photosRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('retailtoken');

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cuisineberg/retail/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setProfile(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);


    if (loading) return <Loading />
    if (!profile) return <div className="text-center py-10 text-red-500 font-semibold">Failed to load profile.</div>;

    // Function to scroll to a section
    const scrollToSection = (ref, tabName) => {
        setActiveTab(tabName);
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Helper component for information blocks (key-value pairs)
    const InfoBlock = ({ label, value }) => (
        value ? (
            <div className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600 text-sm">{label}</span>
                <span className="text-gray-800 font-medium text-sm">{value}</span>
            </div>
        ) : null
    );

    // Helper component for statistics blocks
    const StatBlock = ({ value, label, icon: Icon }) => (
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 flex-1 min-w-[120px]">
            {Icon && <Icon size={24} className="text-blue-600 mb-2" />}
            <span className="text-xl font-bold text-blue-800">{value}</span>
            <span className="text-xs text-gray-600 text-center">{label}</span>
        </div>
    );

    function normalizeUrl(url) {
        if (/^https?:\/\//i.test(url)) {
            return url;
        }
        return `http://${url}`;
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <RetailHeader  restaurantName={profile.restaurantName} street={profile.restaurantAddress.street} city={profile.restaurantAddress.city} state={profile.restaurantAddress.state} zipCode={profile.restaurantAddress.zipCode} mobileNumber={profile.mobileNumber}/>
            <Cover coverImageUrl={profile.coverImageUrl} />

            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10"> {/* Negative margin to overlap header */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 flex flex-col md:flex-row gap-8">
                    {/* Left Column: Logo, Name, Category, Social, Tabs, About */}
                    <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col">
                        {/* Adjusted for mobile responsiveness */}
                        <div className="flex flex-col items-center text-center gap-4 mb-8 sm:flex-row sm:items-start sm:text-left sm:gap-6">
                            {/* Logo and Edit/Share Buttons */}
                            <div className="relative">
                                {profile.logoUrl ? (
                                    <img src={profile.logoUrl} alt="Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-blue-100 shadow-md" />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 border-4 border-blue-100 shadow-md">
                                        No Logo
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 flex gap-1">
                                    <button onClick={() => navigate('/retail/edit')} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                                        <Edit size={16} className="text-gray-600" />
                                    </button>
                                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                                        <Share2 size={16} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Restaurant Name and Category/Location */}
                            <div className="flex flex-col">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{profile.restaurantName}</h1> {/* Responsive font size */}
                                <p className="text-base sm:text-lg text-gray-600 mt-1">{profile.restaurantCategory}</p> {/* Responsive font size */}
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1"> {/* Responsive font size and centering */}
                                    <MapPin size={14} className="text-blue-500" />
                                    {profile.restaurantAddress?.city}, {profile.restaurantAddress?.state}, {profile.restaurantAddress?.zipCode}
                                </p>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mb-8 justify-center sm:justify-start"> {/* Centered on mobile */}
                            {profile.websiteUrl && (
                                <a
                                    href={normalizeUrl(profile.websiteUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-400"
                                >
                                    <Globe size={24} />
                                </a>
                            )}
                            {profile.linkedinUrl && (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-500">
                                    <Linkedin size={24} />
                                </a>
                            )}
                            {profile.twitterUrl && (
                                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-300">
                                    <Twitter size={24} />
                                </a>
                            )}
                            {profile.instagramUrl && (
                                <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-400">
                                    <Instagram size={24} />
                                </a>
                            )}
                            {profile.facebookUrl && (
                                <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-600">
                                    <Facebook size={24} />
                                </a>
                            )}
                        </div>

                        {/* Navigation Tabs */}
                        <div className="border-b border-gray-200 mb-8 overflow-x-auto">
                            <nav className="flex text-sm font-medium">
                                <button
                                    className={`whitespace-nowrap py-3 px-4 border-b-2 ${activeTab === 'Overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => scrollToSection(overviewRef, 'Overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`whitespace-nowrap py-3 px-4 border-b-2 ${activeTab === 'About' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => scrollToSection(aboutRef, 'About')}
                                >
                                    About
                                </button>
                                <button
                                    className={`whitespace-nowrap py-3 px-4 border-b-2 ${activeTab === 'Jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => scrollToSection(jobsRef, 'Jobs')}
                                >
                                    Jobs
                                </button>
                                <button
                                    className={`whitespace-nowrap py-3 px-4 border-b-2 ${activeTab === 'Reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => scrollToSection(reviewsRef, 'Reviews')}
                                >
                                    Reviews
                                </button>
                                <button
                                    className={`whitespace-nowrap py-3 px-4 border-b-2 ${activeTab === 'Salaries' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => scrollToSection(salariesRef, 'Salaries')}
                                >
                                    Salaries
                                </button>
                                <button
                                    className={`whitespace-nowrap py-3 px-4 border-b-2 ${activeTab === 'Photos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => scrollToSection(photosRef, 'Photos')}
                                >
                                    Photos
                                </button>
                            </nav>
                        </div>

                        {/* Overview Section */}
                        <div id="overview" ref={overviewRef} className="pt-2"> {/* Added ref and padding for scroll */}
                            <h2 className="sr-only">Overview</h2> {/* Hidden heading for accessibility */}
                            {/* Statistics Section */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <StatBlock value={profile.recurringRevenue} label="Recurring Revenue" icon={Banknote} />
                                <StatBlock value={profile.totalEmployees} label="Total Employees" icon={User} />
                                <StatBlock value={profile.totalReviews} label="Total Reviews" icon={Star} /> {/* Using Star for reviews */}
                                <StatBlock value={profile.overallRating} label="Overall Rating" icon={Globe} /> {/* Using Globe as a generic rating icon */}
                            </div>

                            {/* About Section (still part of left column for layout, but separate scroll target) */}
                            <div id="about" ref={aboutRef} className="mb-8 pt-2"> {/* Added ref and padding for scroll */}
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center sm:text-left">About {profile.restaurantName}</h2> {/* Centered on mobile */}
                                <p className="text-gray-700 leading-relaxed text-center sm:text-left"> {/* Centered on mobile */}
                                    {profile.about}
                                </p>
                            </div>

                            {/* General Info Sections (Owner & Contact, Address, Operating Hours) - adapting to new layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Owner & Contact */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                                        <User size={20} />Owner & Contact
                                    </h3>
                                    <InfoBlock label="Owner Name" value={profile.name} />
                                    <InfoBlock label="Email" value={profile.email} />
                                    <InfoBlock label="Mobile" value={profile.mobileNumber} />
                                    <InfoBlock label="Alternate Number" value={profile.alternateNumber} />
                                </div>

                                {/* Address */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                                        <MapPin size={20} />Address
                                    </h3>
                                    <InfoBlock label="Street" value={profile.restaurantAddress?.street} />
                                    <InfoBlock label="Area" value={profile.restaurantAddress?.area} />
                                    <InfoBlock label="City" value={profile.restaurantAddress?.city} />
                                    <InfoBlock label="State" value={profile.restaurantAddress?.state} />
                                    <InfoBlock label="Zip Code" value={profile.restaurantAddress?.zipCode} />
                                    <InfoBlock
                                        label="Google Maps"
                                        value={
                                            profile.restaurantAddress?.googleMapsUrl?.length > 20
                                                ? `${profile.restaurantAddress?.googleMapsUrl?.slice(0, 20)}...`
                                                : profile.restaurantAddress?.googleMapsUrl
                                        }
                                    />
                                </div>

                                {/* Operating Hours */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                                        <Clock size={20} />Operating Hours
                                    </h3>
                                    <InfoBlock label="Opening Time" value={profile.operatingHours?.openingTime} />
                                    <InfoBlock label="Closing Time" value={profile.operatingHours?.closingTime} />
                                    {profile.operatingHours?.workingDays && profile.operatingHours.workingDays.length > 0 && (
                                        <InfoBlock label="Working Days" value={profile.operatingHours.workingDays.join(', ')} />
                                    )}
                                </div>
                            </div>
                        </div> {/* End Overview Section */}

                        {/* Jobs Section */}
                        <div id="jobs" ref={jobsRef} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 pt-2">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Briefcase size={20} />Current Job Openings
                            </h2>
                            <p className="text-gray-700">No job openings available at the moment. Please check back later!</p>
                        </div>

                        {/* Reviews Section */}
                        <div id="reviews" ref={reviewsRef} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 pt-2">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MessageSquare size={20} />Customer Reviews
                            </h2>
                            <p className="text-gray-700">No reviews yet. Be the first to review IDEAL CAFE!</p>
                        </div>

                        {/* Salaries Section */}
                        <div id="salaries" ref={salariesRef} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 pt-2">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <DollarSign size={20} />Salaries
                            </h2>
                            <p className="text-gray-700">Salary information is not publicly available.</p>
                        </div>

                        {/* Photos Section */}
                        <div id="photos" ref={photosRef} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 pt-2">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Camera size={20} />Photos
                            </h2>
                            {profile.menuImages && profile.menuImages.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {profile.menuImages.map((image, index) => (
                                        <img key={index} src={image} alt={`Menu item ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-700">No photos available at the moment.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Organization Status, Locations, Bank Details, Other Details */}
                    <div className="w-full md:w-1/3 lg:w-2/5 flex flex-col gap-6">
                        {/* Organization Status */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Organization status</h2>
                            <InfoBlock label="Founded" value={profile.organizationStatus?.founded} />
                            <InfoBlock label="Industry" value={profile.organizationStatus?.industry} />
                            <InfoBlock label="Funding" value={profile.organizationStatus?.funding} />
                            <InfoBlock label="Founder" value={profile.organizationStatus?.founder} />
                        </div>

                        {/* Locations */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Locations</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {profile.locations?.map((location, index) => (
                                    <li key={index} className="text-sm">{location}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Bank Details and Other Details (moved from original structure) */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Banknote size={20} />Bank Details
                            </h3>
                            <InfoBlock label="Account Holder" value={profile.bankDetails?.accountHolderName} />
                            <InfoBlock label="Account Number" value={profile.bankDetails?.accountNumber} />
                            <InfoBlock label="IFSC" value={profile.bankDetails?.ifscCode} />
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard size={20} />Other Details
                            </h3>
                            {profile.acceptedPaymentModes && profile.acceptedPaymentModes.length > 0 && (
                                <InfoBlock label="Payment Modes" value={profile.acceptedPaymentModes.join(', ')} />
                            )}
                            <InfoBlock label="UPI ID" value={profile.upiId} />
                            <InfoBlock label="Public Code" value={profile.publicCode} />
                            <InfoBlock label="GST" value={profile.gstNumber} />
                            <InfoBlock label="FSSAI" value={profile.fssaiNumber} />
                            <InfoBlock label="Business Reg. No." value={profile.businessRegNumber} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
