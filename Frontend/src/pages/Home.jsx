import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import dashboardImage from '../assets/image.png';

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
    <div className="min-h-screen pt-16">
      {/* Hero Section with Subtle Animation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-32 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm mb-6"
            >
              Healthcare Management Simplified
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Your Health,
              <br />
              Our Priority
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-50"
            >
              Manage your healthcare journey with our comprehensive platform
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-x-4"
            >
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section with Hover Effects */}
      <section className="py-24 bg-white">
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
                  className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            >
              A Sneak Peek at Our Dashboard
            </motion.h2>
            <p className="text-gray-600 text-lg">
              Experience a modern, intuitive interface designed for seamless healthcare management
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent h-8 -top-8"></div>
            <img
              src={dashboardImage}
              alt="Dashboard Screenshot"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent h-8 -bottom-8"></div>
          </motion.div>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            >
              About Our Project
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              Our platform revolutionizes healthcare management by allowing users to easily track their health metrics, manage medical records, and book appointments with ease. With top-tier security features and real-time data analysis, we are committed to making healthcare more accessible, efficient, and secure for everyone.
            </motion.p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore the Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;