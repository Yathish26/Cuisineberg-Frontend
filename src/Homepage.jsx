import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPieChart, FiSmartphone, FiTrendingUp } from 'react-icons/fi';
import { PiChefHat } from "react-icons/pi";


export default function Homepage() {
  return (
    <div className="bg-[#fffaf0] dark:bg-gray-950 min-h-screen flex flex-col justify-between transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 bg-gradient-to-b from-blue-100 to-[#fffaf0] transition-colors duration-300 dark:from-gray-800 dark:to-gray-900 text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8 flex justify-center">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <PiChefHat className="text-5xl text-blue-600 dark:text-blue-400" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="block"
            >
              Revolutionizing Dining
            </motion.span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              Digital Menus & Beyond
            </motion.span>
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            Replace physical menus with interactive digital experiences that showcase your food's story, ingredients, and nutrition.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            <Link to="/explore">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                Start Ordering <FiArrowRight />
              </motion.button>
            </Link>
            <Link to="/restaurant">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                For Restaurants <PiChefHat />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-[#fffaf0] dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Transform Your Dining Experience
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiSmartphone />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Interactive Digital Menus</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Stunning food photography, detailed ingredients, nutritional facts, and chef's recommendations at your fingertips.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiTrendingUp />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Real-Time Specials</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Restaurants can instantly push today's specials, seasonal items, and promotions directly to customer devices.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiPieChart />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart Restaurant Tools</h4>
              <p className="text-gray-700 dark:text-gray-300">
                eMenu management, KOT orders, bill summaries, and daily sales reports - all in one powerful platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#fffaf0] to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900 rounded-2xl opacity-50 blur"></div>
              <div className="relative bg-white dark:bg-gray-800 p-2 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                  alt="Digital Menu Example" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Experience the Future of Dining</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Beautiful food photography that makes your menu items irresistible</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Detailed ingredient lists and nutritional information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Allergen alerts and dietary preference filters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Instant updates for daily specials and seasonal items</span>
              </li>
            </ul>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="mt-8 inline-block"
            >
              <Link to="/howitworks" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                See How It Works <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-6 bg-blue-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Restaurant?</h3>
          <p className="text-xl mb-8 opacity-90">Join hundreds of restaurants already providing exceptional digital dining experiences.</p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link to="/retail/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all">
              Get Started Today <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}