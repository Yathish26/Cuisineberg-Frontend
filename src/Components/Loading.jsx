export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center">

            {/* Circular loader around logo */}
            <div className="relative h-24 w-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-t-orange-700 border-b-orange-200 animate-spin"></div>

                {/* Food SVG in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/spoon-and-fork-stroke-sharp.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#f97316">
                        <path d="M18.4998 3.00195L13.9998 7.50195L17.4998 11.002L21.9998 6.50195M15.7498 9.25195L3.99976 21.002" stroke="#f97316" stroke-width="1.5" stroke-linecap="square"></path>
                        <path d="M20 4.99902L17.5 7.49902" stroke="#f97316" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
                        <path d="M7.98914 8.99011C6.79472 10.1845 5.15674 10.4831 3.66377 8.99011C2.17075 7.49709 1.38801 4.77783 2.58243 3.58341C3.77685 2.38899 6.49611 3.17172 7.98914 4.66475C9.48211 6.15772 9.18356 7.79569 7.98914 8.99011ZM7.98914 8.99011L20 21.001" stroke="#f97316" stroke-width="1.5" stroke-linecap="square"></path>
                        <path d="M9.20542 2.39669C10.0923 2.13908 11.03 2.00098 12 2.00098C13.1517 2.00098 14.2579 2.19567 15.2876 2.55394M2.04937 11.001C2.01672 11.3299 2 11.6635 2 12.001C2 14.0328 2.60598 15.9231 3.64707 17.501M7.77267 21.0661C9.05671 21.6659 10.4892 22.001 12 22.001C13.5244 22.001 14.9691 21.6599 16.262 21.0499M20.3529 17.501C21.394 15.9231 22 14.0328 22 12.001C22 11.4228 21.9509 10.8561 21.8567 10.3048" stroke="#f97316" stroke-width="1.5" stroke-linecap="square"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}
