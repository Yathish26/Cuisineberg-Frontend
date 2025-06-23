import { useLocation, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    Search,
    User,
    Home,
    Utensils,
    LayoutGrid,
    Moon,
    Sun,
    PlaneTakeoff
} from "lucide-react";
import Svg from "./Components/svgvault";
import { useState, useEffect } from "react";

export default function Header() {
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedAppearance = localStorage.getItem('appearanceisDark');
        if (storedAppearance === 'true') {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.removeItem('appearanceisDark');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('appearanceisDark', 'true');
            setIsDarkMode(true);
        }
    };

    const location = useLocation();

    const isHomePage = location.pathname === '/';

    const headerClasses = isHomePage
        ? 'bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-900 dark:to-gray-800 shadow-md dark:shadow-lg w-full transition-colors duration-300'
        : 'bg-white dark:bg-gray-900 shadow-md dark:shadow-lg w-full transition-colors duration-300';

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Left: Logo */}
                <div
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-3 cursor-pointer"
                >
                    <Svg icon="sidelogo" />
                </div>

                {/* Center Nav */}
                <nav className="hidden md:flex items-center space-x-6 font-medium">
                    <button
                        onClick={() => navigate("/explore")}
                        className="flex items-center text-blue-900 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <PlaneTakeoff className="w-5 h-5 mr-1" /> Explore
                    </button>
                    <button
                        onClick={() => navigate("/dinein")}
                        className="flex items-center text-blue-900 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <Utensils className="w-5 h-5 mr-1" /> Dine-In
                    </button>
                </nav>

                {/* Right: Icons */}
                <div className="flex items-center space-x-4">
                    <Search
                        onClick={() => navigate("/search")}
                        className="w-5 h-5 cursor-pointer text-blue-900 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    />
                    <ShoppingCart
                        onClick={() => navigate("/cart")}
                        className="w-5 h-5 cursor-pointer text-blue-900 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    />
                    <User
                        onClick={() => navigate("/profile")}
                        className="w-5 h-5 cursor-pointer text-blue-900 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    />
                    {isDarkMode ? (
                        <Sun
                            onClick={toggleTheme}
                            className="w-5 h-5 cursor-pointer text-yellow-500 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition"
                            aria-label="Switch to light mode"
                        />
                    ) : (
                        <Moon
                            onClick={toggleTheme}
                            className="w-5 h-5 cursor-pointer text-blue-900 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            aria-label="Switch to dark mode"
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
