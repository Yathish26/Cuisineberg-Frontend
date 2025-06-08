import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white w-full py-10 px-4 text-center">
            <div className="max-w-2xl mx-auto">
                <p className="text-2xl font-semibold mb-4 text-blue-500">Cuisineberg</p>
                <p className="text-sm mb-6">&copy; 2025 Cuisineberg. All rights reserved.</p>
                <div className="flex justify-center gap-6 text-sm">
                    <Link to="/contact" className="hover:text-blue-400">Contact</Link>
                    <Link to="/login" className="hover:text-blue-400">Sign In</Link>
                </div>
                <div className="flex mt-6 justify-center gap-6 text-sm">
                    <Link to="/terms-and-conditions" className="hover:text-blue-400">Terms of Service</Link>
                    <Link to="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    )
}
