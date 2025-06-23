import Svg from "./svgvault";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      
      {/* Circular loader around logo */}
      <div className="relative h-24 w-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-700 border-b-blue-200 dark:border-t-blue-400 dark:border-b-gray-700 animate-spin"></div>

        {/* Food SVG in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Svg icon="loadingLogo" />
        </div>
      </div>
    </div>
  );
}
