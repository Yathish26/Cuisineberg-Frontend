import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10 px-4 text-center">
            <div className="max-w-2xl mx-auto">
                <p className="text-2xl font-semibold mb-4 text-blue-500">Cuisineberg</p>
                <p className="text-sm mb-6">&copy; 2025 Cuisineberg. All rights reserved.</p>
                <div className="flex justify-center gap-6 text-sm">
                    <Link to="/contact" className="hover:text-blue-400">Contact</Link>
                    <Link to="/login" className="hover:text-blue-400">Sign In</Link>
                </div>
                <p className="mt-6 text-sm">
                    Follow us on{' '}
                    <span className="cursor-pointer hover:text-blue-400">Facebook</span>,{' '}
                    <span className="cursor-pointer hover:text-blue-400">Twitter</span>, and{' '}
                    <span className="cursor-pointer hover:text-blue-400">Instagram</span>.
                </p>
            </div>
        </footer>
    )
}
