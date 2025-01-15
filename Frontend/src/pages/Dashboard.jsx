import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, FileText, MapPin, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { label: 'Upcoming Appointments', value: '3', icon: Calendar },
    { label: 'Recent Records', value: '8', icon: FileText },
    { label: 'Nearby Hospitals', value: '12', icon: MapPin },
  ];

  const notifications = [
    { title: 'Appointment Reminder', message: 'Dr. Smith tomorrow at 10:00 AM', time: '1h ago' },
    { title: 'Lab Results Available', message: 'Your recent blood test results are ready', time: '3h ago' },
    { title: 'Prescription Refill', message: 'Time to refill your prescription', time: '1d ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, John</h1>
        <p className="text-gray-600">Here's an overview of your health status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Health Overview</h2>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="text-lg font-semibold">120/80 mmHg</p>
              </div>
              <span className="text-green-500 text-sm">Normal</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Heart Rate</p>
                <p className="text-lg font-semibold">72 bpm</p>
              </div>
              <span className="text-green-500 text-sm">Normal</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Blood Sugar</p>
                <p className="text-lg font-semibold">95 mg/dL</p>
              </div>
              <span className="text-green-500 text-sm">Normal</span>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          to="/appointments"
          className="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Book Appointment</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </Link>
        <Link
          to="/records"
          className="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-medium">View Records</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </Link>
        <Link
          to="/hospitals"
          className="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Find Hospital</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;