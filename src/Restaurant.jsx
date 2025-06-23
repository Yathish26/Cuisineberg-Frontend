import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit, FiClock, FiDollarSign, FiImage, FiUsers, FiServer, FiFileText, FiPieChart, FiPrinter } from 'react-icons/fi';
import Header from './Header';
import Footer from './Footer';

export default function Restaurant() {
  return (
    <div className="bg-[#fffaf0] dark:bg-gray-950 min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-100 to-[#fffaf0] dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="block">Transform Your</span>
            <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Restaurant Operations</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            Digital solutions that streamline your service, boost sales, and delight customers
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/retail/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all"
              >
                Register Your Restaurant Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Revolutionize Your Restaurant With Digital Menus
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Benefit 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiEdit />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Effortless Menu Management</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Edit your menus digitally in real-time without reprinting. Update prices, descriptions, and availability instantly across all devices.
              </p>
            </motion.div>
            
            {/* Benefit 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiDollarSign />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Dynamic Pricing & Specials</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Adjust prices for seasonal items and create special offers that appear automatically on customer devices.
              </p>
            </motion.div>
            
            {/* Benefit 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiClock />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Instant Order Processing</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Orders go directly to the kitchen (KOT) and manager dashboard, reducing waiter workload and minimizing errors.
              </p>
            </motion.div>
            
            {/* Benefit 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiImage />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Mouthwatering Visuals</h3>
              <p className="text-gray-700 dark:text-gray-300">
                High-quality food photography increases customer engagement and order values by up to 30%.
              </p>
            </motion.div>
            
            {/* Benefit 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiUsers />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Group Ordering</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Customers can collaborate on orders with shared carts and see real-time bill totals before finalizing.
              </p>
            </motion.div>
            
            {/* Benefit 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiServer />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Staff Assistance</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Waiters can assist elderly customers or make adjustments while maintaining digital accuracy.
              </p>
            </motion.div>
            
            {/* Benefit 7 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiFileText />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Paperless Accuracy</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Eliminate manual order errors with digital records that go simultaneously to kitchen, billing, and management.
              </p>
            </motion.div>
            
            {/* Benefit 8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiPrinter />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Seamless KOT Integration</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Instant kitchen order tickets with modifications and special instructions communicated clearly.
              </p>
            </motion.div>
            
            {/* Benefit 9 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
              className="bg-[#fffaf0] dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 text-4xl mb-4">
                <FiPieChart />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Comprehensive Reporting</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Automated daily and monthly sales reports with insights into popular items, peak times, and revenue trends.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Modernize Your Restaurant?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-10 opacity-90"
          >
            Join the digital dining revolution and see immediate improvements in efficiency and customer satisfaction.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/retail/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-all"
              >
                Get Started Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}