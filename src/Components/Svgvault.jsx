export default function Svg({ icon, tcss, click }) {
    const svgIcons = {
        location: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-src="https://cdn.hugeicons.com/icons/navigation-03-solid-standard.svg" role="img" color="#f5a623">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.0617 2.7726C20.3818 2.39544 21.6022 3.6158 21.2252 4.93589L17.1529 19.1934C16.6848 20.8323 14.3885 20.9031 13.8203 19.2962L11.4782 12.6719C11.4531 12.6007 11.3971 12.5447 11.3258 12.5195L4.70211 10.1788C3.09501 9.61087 3.16552 7.31438 4.80443 6.84612L19.0617 2.7726Z" fill="#f5a623"></path>
            </svg>
        ),
        search: (
            <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="currentColor" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeLinecap="round" />
            </svg>
        ),
        cross: (
            <svg onClick={click} className={tcss} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" data-src="https://cdn.hugeicons.com/icons/cancel-01-solid-sharp.svg" role="img" color="#f5a623">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 10.2623L18.0123 4.25L19.75 5.98775L13.7377 12L19.75 18.0123L18.0123 19.75L12 13.7377L5.98775 19.75L4.25 18.0123L10.2623 12L4.25 5.98775L5.98775 4.25L12 10.2623Z" fill="#f5a623"></path>
            </svg>
        ),
        vegetarian: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#0F8A65" />
                <circle cx="8" cy="8" r="4" fill="#0F8A65" />
            </svg>
        ),
        nonvegetarian: (
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#E43B4F" />
                <path d="M3 12L8 4L13 12H3Z" fill="#E43B4F" />
            </svg>
        ),
        plus: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path fill="#fff" d="M13 8a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V8Z" />
            </svg>
        ),
        remove: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" />
                <path d="M16 12H8" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    }
    return svgIcons[icon];
}
