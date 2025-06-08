import { CircleUserRound } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function Header() {

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md w-full border-b border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <div onClick={() => navigate("/")} className="flex cursor-pointer items-center space-x-4">
                    <img
                        src="/cuisine.png"
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shadow-sm border border-blue-100"
                        alt="Cuisineberg Logo"
                    />
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text tracking-tight">
                        Cuisineberg
                    </h1>
                </div>
                <svg
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    width={32}
                    height={32}
                    viewBox="0 0 24 24"
                    fill="none"
                    data-src="https://cdn.hugeicons.com/icons/user-circle-02-solid-sharp.svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    role="img"
                    color="#2563eb"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0001 3.20455C7.14247 3.20455 3.20461 7.1424 3.20461 12C3.20461 16.8576 7.14247 20.7955 12.0001 20.7955C16.8577 20.7955 20.7955 16.8576 20.7955 12C20.7955 7.1424 16.8577 3.20455 12.0001 3.20455ZM1.25006 12C1.25006 6.06294 6.063 1.25 12.0001 1.25C17.9371 1.25 22.7501 6.06294 22.7501 12C22.7501 17.9371 17.9371 22.75 12.0001 22.75C6.063 22.75 1.25006 17.9371 1.25006 12Z"
                        fill="#2563eb"
                    />
                    <path
                        d="M8.50006 9.5C8.50006 7.567 10.0671 6 12.0001 6C13.9331 6 15.5001 7.567 15.5001 9.5C15.5001 11.433 13.9331 13 12.0001 13C10.0671 13 8.50006 11.433 8.50006 9.5Z"
                        fill="#2563eb"
                    />
                    <path
                        d="M5.40958 17.6472C6.43332 15.8556 8.33855 14.75 10.402 14.75H13.5988C15.6622 14.75 17.5674 15.8556 18.5911 17.6472L19.6179 19.6074L19.1846 19.9969C17.2812 21.7079 14.7616 22.7499 12.0004 22.7499C9.2392 22.7499 6.71957 21.7079 4.81613 19.9968L4.38287 19.6073L5.40958 17.6472Z"
                        fill="#2563eb"
                    />
                </svg>
            </div>
        </header>
    );
}
