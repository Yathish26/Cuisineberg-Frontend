import React from 'react';
import Library from './Editables/Library';
import { Link } from 'react-router-dom';

export default function Homepage() {

  const fourThumbnail = Library().HomepageFood
  

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <header className="bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-orange-600">Cuisineberg</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-700 font-medium">
              <li className="hover:text-orange-600 cursor-pointer">Home</li>
              <li className="hover:text-orange-600 cursor-pointer">Menu</li>
              <li className="hover:text-orange-600 cursor-pointer">Offers</li>
              <li className="hover:text-orange-600 cursor-pointer">Contact</li>
              <Link to="/login"><li className="hover:text-orange-600 cursor-pointer">Sign In</li></Link>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-[80vh] flex items-center justify-center relative"
        style={{ backgroundImage: 'url(https://blog.foodhub.com/wp-content/uploads/2024/07/Indian-cuisine.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900 via-orange-600 to-transparent opacity-80"></div>
        <div className="relative text-center text-white px-4 py-8">
          <h2 className="text-5xl font-bold mb-4">Welcome to Cuisineberg</h2>
          <p className="text-lg mb-6">Fresh and delicious meals delivered to your doorstep in minutes!</p>
          <button className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 shadow-lg">
            Order Now
          </button>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {fourThumbnail.map((category, index) => (
            <div
              key={index}
              className="bg-orange-50 hover:shadow-lg transition-shadow rounded-lg overflow-hidden text-center p-4"
            >
              <img
                src={category.photo}
                alt={category.name}
                className="w-20 h-20 mx-auto mb-4 rounded-full object-cover"
              />
              <h4 className="text-lg font-bold text-gray-700">{category.name}</h4>
              <p className="text-sm text-gray-500">Explore delicious {category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="container mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Featured Restaurants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white hover:shadow-xl transition-shadow rounded-lg overflow-hidden"
            >
              <img
                src={`https://via.placeholder.com/300x200?text=Restaurant+${item}`}
                alt={`Restaurant ${item}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800">Restaurant {item}</h4>
                <p className="text-gray-600 text-sm">Delicious food, quick delivery</p>
                <button className="mt-4 px-4 py-2 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-orange-50 py-10">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">What Customers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Fast delivery!', 'Amazing taste!', 'Great variety!'].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
              >
                <p className="text-gray-600 italic">"{testimonial}"</p>
                <h4 className="text-lg font-bold text-gray-700 mt-4">Customer {index + 1}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Cuisineberg. All rights reserved.</p>
          <p className="mt-2">
            Follow us on{' '}
            <span className="underline cursor-pointer hover:text-gray-200">Facebook</span>,{' '}
            <span className="underline cursor-pointer hover:text-gray-200">Twitter</span>, and{' '}
            <span className="underline cursor-pointer hover:text-gray-200">Instagram</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
