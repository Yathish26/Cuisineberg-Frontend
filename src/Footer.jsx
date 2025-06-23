import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white text-black dark:bg-gray-900 dark:text-white w-full py-6 px-4 text-center transition-colors">
            <div className="max-w-xl mx-auto">
                <p className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-400">Cuisineberg</p>
                <p className="text-xs mb-4">&copy; {new Date().getFullYear()} Cuisineberg</p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                    <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-300">Sign In</Link>
                    <Link to="/terms-and-conditions" className="hover:text-blue-600 dark:hover:text-blue-300">Terms of Service</Link>
                    <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-300">Privacy Policy</Link>
                    <Link to="/plans" className="hover:text-blue-600 dark:hover:text-blue-300">Plans</Link>
                    <Link to="/retail" className="hover:text-blue-600 dark:hover:text-blue-300">Retail</Link>
                    <Link to="/feedback" className="hover:text-blue-600 dark:hover:text-blue-300">Feedback</Link>
                </div>
            </div>
        </footer>
    );
}
