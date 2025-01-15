import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: Activity,
      title: 'Health Monitoring',
      description: 'Track your health metrics and medical history in real-time',
    },
    {
      icon: Shield,
      title: 'Secure Records',
      description: 'Your health data is protected with enterprise-grade security',
    },
    {
      icon: Clock,
      title: 'Quick Appointments',
      description: 'Book and manage appointments with healthcare providers easily',
    },
  ];

  return (
    <div className="min-h-screen pt-16"> {/* Added pt-16 to ensure content is below fixed navbar */}
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Your Health, Our Priority
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8"
            >
              Manage your healthcare journey with our comprehensive platform
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="p-6 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Screenshot Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-semibold mb-6"
          >
            A Sneak Peek at Our Dashboard
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <img
              src="https://via.placeholder.com/1200x800" // Replace with your dashboard screenshot
              alt="Dashboard Screenshot"
              className="mx-auto rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-semibold mb-6"
          >
            About Our Project
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-8"
          >
            Our platform revolutionizes healthcare management by allowing users to easily track their health metrics, manage medical records, and book appointments with ease. With top-tier security features and real-time data analysis, we are committed to making healthcare more accessible, efficient, and secure for everyone.
          </motion.p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Explore the Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
